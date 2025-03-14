
import { useState, useEffect, useCallback } from 'react';
import mqttService from '@/services/mqtt';

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

export function useMqtt(topic?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Connect to MQTT broker
  const connect = useCallback(async (config: MqttConfig) => {
    try {
      const success = await mqttService.connect(config);
      setIsConnected(success);
      return success;
    } catch (error) {
      console.error('Failed to connect to MQTT broker:', error);
      setIsConnected(false);
      return false;
    }
  }, []);
  
  // Disconnect from MQTT broker
  const disconnect = useCallback(async () => {
    try {
      await mqttService.disconnect();
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to disconnect from MQTT broker:', error);
    }
  }, []);
  
  // Publish a message to a topic
  const publish = useCallback((publishTopic: string, message: any) => {
    mqttService.publish(publishTopic, message);
  }, []);
  
  // Subscribe to a topic
  const subscribe = useCallback((subscribeTopic: string, callback?: (message: any) => void) => {
    const messageHandler = (message: any) => {
      setLastMessage(message);
      setMessages(prev => [...prev, message]);
      
      if (callback) {
        callback(message);
      }
    };
    
    mqttService.subscribe(subscribeTopic, messageHandler);
    
    // Return unsubscribe function
    return () => {
      mqttService.unsubscribe(subscribeTopic, messageHandler);
    };
  }, []);
  
  // Subscribe to the topic provided in the hook parameters
  useEffect(() => {
    if (topic && isConnected) {
      const unsubscribe = subscribe(topic);
      return () => unsubscribe();
    }
  }, [topic, isConnected, subscribe]);
  
  // Check connection status
  useEffect(() => {
    const connected = mqttService.isConnectedStatus();
    setIsConnected(connected);
  }, []);
  
  return {
    isConnected,
    lastMessage,
    messages,
    connect,
    disconnect,
    publish,
    subscribe
  };
}
