
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Database, Server, RefreshCw, HardDrive, Network } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DatabaseConnection() {
  const { toast } = useToast();
  const [useLocalDb, setUseLocalDb] = useState(false);
  const [dbType, setDbType] = useState('postgres');
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

  const handleDbTypeChange = (value: string) => {
    setDbType(value);
    // Update port based on database type
    if (value === 'postgres') {
      setDbConfig(prev => ({ ...prev, port: '5432' }));
    } else if (value === 'mysql') {
      setDbConfig(prev => ({ ...prev, port: '3306' }));
    } else if (value === 'mssql') {
      setDbConfig(prev => ({ ...prev, port: '1433' }));
    }
  };

  const handleTestConnection = () => {
    setTestLoading(true);
    // Simulate testing connection
    setTimeout(() => {
      setTestLoading(false);
      toast({
        title: "Connection Test",
        description: useLocalDb 
          ? `Successfully connected to local ${dbType} database` 
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
          ? `Local ${dbType} database configuration saved` 
          : "Cloud database configuration saved",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Database className="h-4 w-4 mr-2" />
          Database Connection
        </CardTitle>
        <CardDescription className="text-xs">
          Configure your database connection settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-local-db"
              checked={useLocalDb}
              onCheckedChange={setUseLocalDb}
            />
            <Label htmlFor="use-local-db" className="flex items-center text-sm">
              <Server className="h-3.5 w-3.5 mr-1.5" />
              Use Local Database Server
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {useLocalDb 
              ? "Connect to a local database server for development" 
              : "Using cloud database server (default)"}
          </p>
        </div>

        {useLocalDb && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="db-type" className="text-sm">Database Type</Label>
              <Select value={dbType} onValueChange={handleDbTypeChange}>
                <SelectTrigger id="db-type">
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postgres">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4" />
                      PostgreSQL
                    </div>
                  </SelectItem>
                  <SelectItem value="mysql">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4" />
                      MySQL
                    </div>
                  </SelectItem>
                  <SelectItem value="mssql">
                    <div className="flex items-center">
                      <HardDrive className="mr-2 h-4 w-4" />
                      SQL Server
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="host" className="text-sm">Host</Label>
                <Input
                  id="host"
                  name="host"
                  placeholder="localhost"
                  value={dbConfig.host}
                  onChange={handleInputChange}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="port" className="text-sm">Port</Label>
                <Input
                  id="port"
                  name="port"
                  placeholder={dbType === 'postgres' ? "5432" : dbType === 'mysql' ? "3306" : "1433"}
                  value={dbConfig.port}
                  onChange={handleInputChange}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="database" className="text-sm">Database Name</Label>
              <Input
                id="database"
                name="database"
                placeholder={dbType === 'postgres' ? "postgres" : "master"}
                value={dbConfig.database}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder={dbType === 'postgres' ? "postgres" : dbType === 'mysql' ? "root" : "sa"}
                value={dbConfig.username}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="●●●●●●●●"
                value={dbConfig.password}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm">Advanced Options</Label>
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" className="text-xs h-7 flex items-center">
                  <Network size={12} className="mr-1.5" />
                  Test SSL Connection
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 flex items-center">
                  <HardDrive size={12} className="mr-1.5" />
                  Verify Schema
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testLoading}>
          {testLoading ? (
            <>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Network className="mr-1.5 h-3.5 w-3.5" />
              Test Connection
            </>
          )}
        </Button>
        <Button size="sm" onClick={handleSaveConfig} disabled={saveLoading}>
          {saveLoading ? (
            <>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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
