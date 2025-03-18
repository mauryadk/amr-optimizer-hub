
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemSettings from "@/components/settings/SystemSettings";
import MqttSettings from "@/components/settings/MqttSettings";
import VDA5050Settings from "@/components/settings/VDA5050Settings";
import DatabaseStatus from "@/components/settings/DatabaseStatus";
import DatabaseConnection from "@/components/settings/DatabaseConnection";

export default function Settings() {
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <SystemSettings />
        </TabsContent>
        
        <TabsContent value="connectivity" className="space-y-6">
          <MqttSettings />
          <VDA5050Settings />
        </TabsContent>
        
        <TabsContent value="database" className="space-y-6">
          <DatabaseStatus />
          <DatabaseConnection />
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="grid gap-6">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">Advanced System Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These settings are for advanced users. Changing these settings can affect system performance.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
