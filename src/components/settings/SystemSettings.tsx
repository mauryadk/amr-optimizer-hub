
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Server, 
  Wifi, 
  Globe, 
  RefreshCw,
  DownloadCloud,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function SystemSettings() {
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState({
    autoUpdate: true,
    dataCollection: true,
    secureConnection: true,
    lowPowerMode: false,
    verboseLogging: false
  });

  // Simulate checking for updates
  const checkForUpdates = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl font-semibold text-primary">
            <Shield size={18} className="mr-2" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Configure your AMR system settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server size={16} className="mr-2 text-gray-500" />
                <span>Automatic Updates</span>
              </div>
              <Switch 
                checked={settings.autoUpdate}
                onCheckedChange={(checked) => setSettings({...settings, autoUpdate: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe size={16} className="mr-2 text-gray-500" />
                <span>Data Collection</span>
              </div>
              <Switch 
                checked={settings.dataCollection}
                onCheckedChange={(checked) => setSettings({...settings, dataCollection: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield size={16} className="mr-2 text-gray-500" />
                <span>Secure Connection</span>
              </div>
              <Switch 
                checked={settings.secureConnection}
                onCheckedChange={(checked) => setSettings({...settings, secureConnection: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wifi size={16} className="mr-2 text-gray-500" />
                <span>Low Power Mode</span>
              </div>
              <Switch 
                checked={settings.lowPowerMode}
                onCheckedChange={(checked) => setSettings({...settings, lowPowerMode: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server size={16} className="mr-2 text-gray-500" />
                <span>Verbose Logging</span>
              </div>
              <Switch 
                checked={settings.verboseLogging}
                onCheckedChange={(checked) => setSettings({...settings, verboseLogging: checked})}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-blue-50/70 py-3 flex justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock size={12} />
            <span>Last checked: 2 hours ago</span>
          </div>
          <button 
            onClick={checkForUpdates}
            disabled={updating}
            className="flex items-center text-xs px-3 py-1.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {updating ? (
              <>
                <RefreshCw size={12} className="mr-1.5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <DownloadCloud size={12} className="mr-1.5" />
                Check for Updates
              </>
            )}
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
