
import { toast } from '@/hooks/use-toast';

interface MqttConfig {
  brokerUrl: string;
  port: string;
  username: string;
  password: string;
  clientId: string;
  useTls: boolean;
  cleanSession: boolean;
  keepAlive: number;
}

class MqttService {
  private client: any = null;
  private isConnected: boolean = false;
  private subscriptions: Map<string, Function[]> = new Map();
  private config: MqttConfig | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  // In a real implementation, this would use an actual MQTT client library
  // For demo purposes, we're simulating the MQTT client behavior
  
  async connect(config: MqttConfig): Promise<boolean> {
    // Store config for reconnection
    this.config = config;
    
    console.log(`Connecting to MQTT broker: ${config.brokerUrl}:${config.port}`);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful connection
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    console.log('MQTT connection established');
    toast({
      title: "MQTT Connected",
      description: `Connected to ${config.brokerUrl}:${config.port}`,
    });
    
    // Set up simulated message reception
    this.simulateIncomingMessages();
    
    return true;
  }
  
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }
    
    console.log('Disconnecting from MQTT broker');
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.isConnected = false;
    this.subscriptions.clear();
    
    console.log('MQTT disconnected');
    toast({
      title: "MQTT Disconnected",
      description: "Disconnected from MQTT broker",
    });
  }
  
  subscribe(topic: string, callback: Function): void {
    if (!this.isConnected) {
      console.error('Cannot subscribe: MQTT client not connected');
      return;
    }
    
    console.log(`Subscribing to topic: ${topic}`);
    
    // Add to subscriptions map
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, []);
    }
    
    this.subscriptions.get(topic)?.push(callback);
    
    console.log(`Subscribed to topic: ${topic}`);
  }
  
  unsubscribe(topic: string, callback?: Function): void {
    if (!this.subscriptions.has(topic)) {
      return;
    }
    
    if (callback) {
      // Remove specific callback
      const callbacks = this.subscriptions.get(topic) || [];
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      
      // If no callbacks left, remove the topic
      if (callbacks.length === 0) {
        this.subscriptions.delete(topic);
      }
    } else {
      // Remove all callbacks for this topic
      this.subscriptions.delete(topic);
    }
    
    console.log(`Unsubscribed from topic: ${topic}`);
  }
  
  publish(topic: string, message: any): void {
    if (!this.isConnected) {
      console.error('Cannot publish: MQTT client not connected');
      return;
    }
    
    console.log(`Publishing to topic: ${topic}`, message);
    
    // In a real implementation, this would publish to the MQTT broker
    // For demo purposes, we just log the message
  }
  
  isConnectedStatus(): boolean {
    return this.isConnected;
  }
  
  // Simulate receiving messages
  private simulateIncomingMessages(): void {
    if (!this.isConnected) return;
    
    // Simulate receiving robot status updates every 5 seconds
    setInterval(() => {
      if (!this.isConnected) return;
      
      const robotId = Math.floor(Math.random() * 6) + 1;
      const batteryLevel = Math.floor(Math.random() * 100);
      const robotTopic = `uagv/v1/robot00${robotId}/state`;
      
      if (this.subscriptions.has(robotTopic)) {
        const callbacks = this.subscriptions.get(robotTopic) || [];
        const message = {
          batteryLevel,
          position: {
            x: Math.random() * 600,
            y: Math.random() * 400,
            theta: Math.random() * 360
          },
          velocity: Math.random() * 1.5,
          timestamp: new Date().toISOString()
        };
        
        callbacks.forEach(callback => callback(message));
      }
    }, 5000);
  }
  
  // Reconnection logic
  private async attemptReconnect(): Promise<void> {
    if (this.isConnected || !this.config || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    try {
      await this.connect(this.config);
    } catch (error) {
      console.error('Reconnection failed:', error);
      
      // Try again after delay
      setTimeout(() => this.attemptReconnect(), 5000);
    }
  }
}

// Create a singleton instance
const mqttService = new MqttService();

export default mqttService;
