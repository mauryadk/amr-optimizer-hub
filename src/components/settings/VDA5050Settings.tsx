
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Truck, Save, RotateCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function VDA5050Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    baseUrl: '/v1',
    manufacturerId: 'manufacturer1',
    serialNumber: 'AMR12345',
    interfaceVersion: '1.1',
    topicPrefix: 'uagv',
    orderUpdateInterval: '5000',
    stateUpdateInterval: '1000',
    connectionParams: {
      visualizationEnabled: true,
      connectionTimeout: '10000',
      errorThreshold: '3',
      factoryMapId: 'map-01'
    }
  });

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API request to save settings
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "VDA5050 Settings Saved",
        description: "Your VDA5050 interface settings have been updated",
      });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleNestedChange = (name: string, value: string) => {
    setSettings({
      ...settings,
      connectionParams: {
        ...settings.connectionParams,
        [name]: value
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-md h-full">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-3">
          <CardTitle className="flex items-center text-xl font-semibold text-primary">
            <Truck size={18} className="mr-2" />
            VDA5050 Interface
          </CardTitle>
          <CardDescription>
            Configure VDA5050 protocol settings for AGV communication
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input 
                id="baseUrl" 
                name="baseUrl"
                value={settings.baseUrl} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interfaceVersion">Interface Version</Label>
              <Select defaultValue={settings.interfaceVersion}>
                <SelectTrigger id="interfaceVersion">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0</SelectItem>
                  <SelectItem value="1.1">1.1</SelectItem>
                  <SelectItem value="2.0">2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturerId">Manufacturer ID</Label>
              <Input 
                id="manufacturerId" 
                name="manufacturerId"
                value={settings.manufacturerId} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input 
                id="serialNumber" 
                name="serialNumber"
                value={settings.serialNumber} 
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topicPrefix">Topic Prefix</Label>
              <Input 
                id="topicPrefix" 
                name="topicPrefix"
                value={settings.topicPrefix} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="factoryMapId">Factory Map ID</Label>
              <Input 
                id="factoryMapId" 
                name="factoryMapId"
                value={settings.connectionParams.factoryMapId} 
                onChange={(e) => handleNestedChange('factoryMapId', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderUpdateInterval">Order Update Interval (ms)</Label>
              <Input 
                id="orderUpdateInterval" 
                name="orderUpdateInterval"
                type="number"
                value={settings.orderUpdateInterval} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stateUpdateInterval">State Update Interval (ms)</Label>
              <Input 
                id="stateUpdateInterval" 
                name="stateUpdateInterval"
                type="number"
                value={settings.stateUpdateInterval} 
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="connectionTimeout">Connection Timeout (ms)</Label>
              <Input 
                id="connectionTimeout" 
                name="connectionTimeout"
                type="number"
                value={settings.connectionParams.connectionTimeout} 
                onChange={(e) => handleNestedChange('connectionTimeout', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="errorThreshold">Error Threshold</Label>
              <Input 
                id="errorThreshold" 
                name="errorThreshold"
                type="number"
                value={settings.connectionParams.errorThreshold} 
                onChange={(e) => handleNestedChange('errorThreshold', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="visualizationEnabled" 
              checked={settings.connectionParams.visualizationEnabled}
              onCheckedChange={(checked) => {
                handleNestedChange('visualizationEnabled', checked === true ? 'true' : 'false')
              }}
            />
            <Label htmlFor="visualizationEnabled" className="cursor-pointer">Enable visualization in map view</Label>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50/70 py-3 flex justify-between">
          <Button variant="outline" size="sm">
            <RotateCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
