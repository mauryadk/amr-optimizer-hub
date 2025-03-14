
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Radio, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function MqttSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    brokerUrl: 'mqtt://broker.example.com',
    port: '1883',
    username: 'amr_system',
    clientId: 'amr-fleet-manager',
    useTls: true,
    cleanSession: true,
    keepAlive: '60'
  });

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate connection to MQTT broker
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast({
        title: "MQTT Connection Established",
        description: "Connected to MQTT broker successfully",
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    // Simulate disconnection from MQTT broker
    setTimeout(() => {
      setIsConnected(false);
      setIsLoading(false);
      toast({
        title: "MQTT Disconnected",
        description: "Disconnected from MQTT broker",
      });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-md h-full">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-3">
          <CardTitle className="flex items-center text-xl font-semibold text-primary">
            <Radio size={18} className="mr-2" />
            MQTT Configuration
          </CardTitle>
          <CardDescription>
            Configure MQTT broker connection for real-time data exchange
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            {isConnected ? (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Disconnect
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Connect
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brokerUrl">Broker URL</Label>
              <Input 
                id="brokerUrl" 
                name="brokerUrl"
                value={settings.brokerUrl} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input 
                id="port" 
                name="port"
                value={settings.port} 
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                name="username"
                value={settings.username} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input 
                id="clientId" 
                name="clientId"
                value={settings.clientId} 
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password"
              type="password" 
              value="••••••••" 
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="useTls" className="cursor-pointer">Use TLS</Label>
              <Switch 
                id="useTls"
                checked={settings.useTls}
                onCheckedChange={(checked) => handleSwitchChange('useTls', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="cleanSession" className="cursor-pointer">Clean Session</Label>
              <Switch 
                id="cleanSession"
                checked={settings.cleanSession}
                onCheckedChange={(checked) => handleSwitchChange('cleanSession', checked)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keepAlive">Keep Alive (seconds)</Label>
            <Input 
              id="keepAlive" 
              name="keepAlive"
              type="number" 
              value={settings.keepAlive} 
              onChange={handleChange}
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50/70 py-3 flex justify-end">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Reset</Button>
            <Button size="sm">Save Changes</Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
