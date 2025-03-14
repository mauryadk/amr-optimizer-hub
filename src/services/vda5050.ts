
import mqttService from './mqtt';
import { toast } from '@/hooks/use-toast';

// VDA5050 message types
export interface VDA5050OrderState {
  headerId: number;
  timestamp: string;
  version: string;
  manufacturer: string;
  serialNumber: string;
  orderId: string;
  orderUpdateId: number;
  lastNodeId: string;
  lastNodeSequenceId: number;
  nodeStates: VDA5050NodeState[];
  edgeStates: VDA5050EdgeState[];
  actionStates: any[];
  batteryState: {
    batteryCharge: number;
    charging: boolean;
  };
  operatingMode: string;
  errors: any[];
  warnings: any[];
  informations: any[];
}

interface VDA5050NodeState {
  nodeId: string;
  sequenceId: number;
  nodeDescription: string;
  nodePosition: {
    x: number;
    y: number;
    mapId: string;
  };
  released: boolean;
}

interface VDA5050EdgeState {
  edgeId: string;
  sequenceId: number;
  released: boolean;
}

interface VDA5050Config {
  baseUrl: string;
  manufacturerId: string;
  serialNumber: string;
  interfaceVersion: string;
  topicPrefix: string;
  orderUpdateInterval: number;
  stateUpdateInterval: number;
  connectionParams: {
    visualizationEnabled: boolean;
    connectionTimeout: number;
    errorThreshold: number;
    factoryMapId: string;
  };
}

class VDA5050Service {
  private config: VDA5050Config | null = null;
  private isConnected: boolean = false;
  private robotStates: Map<string, VDA5050OrderState> = new Map();
  private listeners: Map<string, Function[]> = new Map();
  private headerCounter: number = 0;
  
  // Initialize the VDA5050 service
  async initialize(config: VDA5050Config): Promise<boolean> {
    this.config = config;
    console.log('Initializing VDA5050 service with config:', config);
    
    // Subscribe to robot state updates
    this.subscribeToRobotUpdates();
    
    this.isConnected = true;
    return true;
  }
  
  // Subscribe to robot state updates via MQTT
  private subscribeToRobotUpdates(): void {
    if (!this.config) return;
    
    // In VDA5050, robots publish their state to a topic like:
    // {topicPrefix}/{interfaceVersion}/{manufacturerId}/{serialNumber}/state
    const topicBase = `${this.config.topicPrefix}/${this.config.interfaceVersion}`;
    
    // Subscribe to all robot updates (wildcard)
    const stateTopic = `${topicBase}/+/+/state`;
    
    mqttService.subscribe(stateTopic, (message: any, topic: string) => {
      // Extract robot ID from topic
      const parts = topic.split('/');
      const robotId = `${parts[2]}_${parts[3]}`; // manufacturer_serialNumber
      
      // Parse and store the state
      this.updateRobotState(robotId, message);
    });
    
    console.log(`Subscribed to robot state updates: ${stateTopic}`);
  }
  
  // Update a robot's state and notify listeners
  private updateRobotState(robotId: string, state: VDA5050OrderState): void {
    this.robotStates.set(robotId, state);
    
    // Notify listeners for this specific robot
    this.notifyListeners(robotId, state);
    
    // Notify listeners for all robots
    this.notifyListeners('all', this.getAllRobotStates());
  }
  
  // Send an order to a robot
  sendOrder(robotId: string, order: any): void {
    if (!this.config || !mqttService.isConnectedStatus()) {
      toast({
        title: "Cannot send order",
        description: "MQTT connection is not established",
        variant: "destructive"
      });
      return;
    }
    
    const [manufacturer, serialNumber] = robotId.split('_');
    const topic = `${this.config.topicPrefix}/${this.config.interfaceVersion}/${manufacturer}/${serialNumber}/order`;
    
    // Add VDA5050 header to order
    const orderWithHeader = {
      headerId: this.headerCounter++,
      timestamp: new Date().toISOString(),
      version: this.config.interfaceVersion,
      manufacturer,
      serialNumber,
      ...order
    };
    
    mqttService.publish(topic, orderWithHeader);
    
    console.log(`Sent order to robot ${robotId}:`, orderWithHeader);
    toast({
      title: "Order sent",
      description: `Order ${order.orderId} sent to robot ${robotId}`
    });
  }
  
  // Send a control command to a robot (instantAction in VDA5050)
  sendControlCommand(robotId: string, command: string, params: any = {}): void {
    if (!this.config || !mqttService.isConnectedStatus()) {
      toast({
        title: "Cannot send command",
        description: "MQTT connection is not established",
        variant: "destructive"
      });
      return;
    }
    
    const [manufacturer, serialNumber] = robotId.split('_');
    const topic = `${this.config.topicPrefix}/${this.config.interfaceVersion}/${manufacturer}/${serialNumber}/instantActions`;
    
    // Create VDA5050 instantAction
    const action = {
      headerId: this.headerCounter++,
      timestamp: new Date().toISOString(),
      version: this.config.interfaceVersion,
      manufacturer,
      serialNumber,
      actions: [
        {
          actionId: `cmd_${Date.now()}`,
          actionType: command,
          actionParameters: params
        }
      ]
    };
    
    mqttService.publish(topic, action);
    
    console.log(`Sent control command to robot ${robotId}:`, action);
    toast({
      title: "Command sent",
      description: `${command} command sent to robot ${robotId}`
    });
  }
  
  // Get the state of a specific robot
  getRobotState(robotId: string): VDA5050OrderState | undefined {
    return this.robotStates.get(robotId);
  }
  
  // Get all robot states
  getAllRobotStates(): Map<string, VDA5050OrderState> {
    return new Map(this.robotStates);
  }
  
  // Add listener for robot state updates
  addListener(robotId: string, callback: Function): void {
    if (!this.listeners.has(robotId)) {
      this.listeners.set(robotId, []);
    }
    
    this.listeners.get(robotId)?.push(callback);
  }
  
  // Remove listener
  removeListener(robotId: string, callback: Function): void {
    if (!this.listeners.has(robotId)) {
      return;
    }
    
    const callbacks = this.listeners.get(robotId) || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }
  
  // Notify all listeners for a specific robot ID
  private notifyListeners(robotId: string, state: any): void {
    const callbacks = this.listeners.get(robotId) || [];
    callbacks.forEach(callback => callback(state));
  }
  
  // Control commands
  pauseRobot(robotId: string): void {
    this.sendControlCommand(robotId, 'pauseOrder');
  }
  
  resumeRobot(robotId: string): void {
    this.sendControlCommand(robotId, 'resumeOrder');
  }
  
  emergencyStop(robotId: string): void {
    this.sendControlCommand(robotId, 'emergencyStop');
  }
  
  cancelOrder(robotId: string, orderId: string): void {
    this.sendControlCommand(robotId, 'cancelOrder', { orderId });
  }
}

// Create a singleton instance
const vda5050Service = new VDA5050Service();

export default vda5050Service;
