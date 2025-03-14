
import { useState, useEffect, useCallback } from 'react';
import vda5050Service, { VDA5050OrderState } from '@/services/vda5050';

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

export function useVDA5050() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [robotStates, setRobotStates] = useState<Map<string, VDA5050OrderState>>(new Map());
  
  // Initialize VDA5050 service
  const initialize = useCallback(async (config: VDA5050Config) => {
    try {
      const success = await vda5050Service.initialize(config);
      setIsInitialized(success);
      return success;
    } catch (error) {
      console.error('Failed to initialize VDA5050 service:', error);
      setIsInitialized(false);
      return false;
    }
  }, []);
  
  // Get state updates for all robots
  useEffect(() => {
    if (isInitialized) {
      const handleStateUpdate = (states: Map<string, VDA5050OrderState>) => {
        setRobotStates(new Map(states));
      };
      
      vda5050Service.addListener('all', handleStateUpdate);
      
      return () => {
        vda5050Service.removeListener('all', handleStateUpdate);
      };
    }
  }, [isInitialized]);
  
  // Get state for a specific robot
  const getRobotState = useCallback((robotId: string) => {
    return vda5050Service.getRobotState(robotId);
  }, []);
  
  // Send an order to a robot
  const sendOrder = useCallback((robotId: string, order: any) => {
    vda5050Service.sendOrder(robotId, order);
  }, []);
  
  // Control commands
  const pauseRobot = useCallback((robotId: string) => {
    vda5050Service.pauseRobot(robotId);
  }, []);
  
  const resumeRobot = useCallback((robotId: string) => {
    vda5050Service.resumeRobot(robotId);
  }, []);
  
  const emergencyStop = useCallback((robotId: string) => {
    vda5050Service.emergencyStop(robotId);
  }, []);
  
  const cancelOrder = useCallback((robotId: string, orderId: string) => {
    vda5050Service.cancelOrder(robotId, orderId);
  }, []);
  
  return {
    isInitialized,
    robotStates,
    initialize,
    getRobotState,
    sendOrder,
    pauseRobot,
    resumeRobot,
    emergencyStop,
    cancelOrder
  };
}
