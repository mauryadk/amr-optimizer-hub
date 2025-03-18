
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Database, Server, RefreshCw } from 'lucide-react';

export default function DatabaseConnection() {
  const { toast } = useToast();
  const [useLocalDb, setUseLocalDb] = useState(false);
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '5432',
    database: 'postgres',
    username: 'postgres',
    password: '',
  });
  const [testLoading, setTestLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDbConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestConnection = () => {
    setTestLoading(true);
    // Simulate testing connection
    setTimeout(() => {
      setTestLoading(false);
      toast({
        title: "Connection Test",
        description: useLocalDb 
          ? "Successfully connected to local database" 
          : "Successfully connected to cloud database",
      });
    }, 1500);
  };

  const handleSaveConfig = () => {
    setSaveLoading(true);
    // Simulate saving config
    setTimeout(() => {
      setSaveLoading(false);
      toast({
        title: "Configuration Saved",
        description: useLocalDb 
          ? "Local database configuration saved" 
          : "Cloud database configuration saved",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Connection
        </CardTitle>
        <CardDescription>
          Configure your database connection settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-local-db"
              checked={useLocalDb}
              onCheckedChange={setUseLocalDb}
            />
            <Label htmlFor="use-local-db" className="flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Use Local Database Server
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {useLocalDb 
              ? "Connect to a local database server for development" 
              : "Using cloud database server (default)"}
          </p>
        </div>

        {useLocalDb && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  name="host"
                  placeholder="localhost"
                  value={dbConfig.host}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  name="port"
                  placeholder="5432"
                  value={dbConfig.port}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="database">Database Name</Label>
              <Input
                id="database"
                name="database"
                placeholder="postgres"
                value={dbConfig.database}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="postgres"
                value={dbConfig.username}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="●●●●●●●●"
                value={dbConfig.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTestConnection} disabled={testLoading}>
          {testLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>
        <Button onClick={handleSaveConfig} disabled={saveLoading}>
          {saveLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
