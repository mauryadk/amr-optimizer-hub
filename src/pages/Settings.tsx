
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import DatabaseStatus from '@/components/settings/DatabaseStatus';
import SystemSettings from '@/components/settings/SystemSettings';
import { Settings as SettingsIcon, Sliders, Database, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MqttSettings from '@/components/settings/MqttSettings';
import VDA5050Settings from '@/components/settings/VDA5050Settings';

export default function Settings() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold flex items-center">
              <SettingsIcon size={28} className="mr-2 text-primary" />
              Settings
            </h1>
            <p className="text-gray-500 mt-1">Configure your AMR fleet management system</p>
          </motion.div>
          
          <Tabs defaultValue="system" className="mb-8">
            <TabsList className="mb-6 bg-muted/50 p-1">
              <TabsTrigger value="system" className="flex items-center gap-1.5">
                <Sliders size={16} />
                <span>System</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-1.5">
                <Database size={16} />
                <span>Database</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-1.5">
                <Radio size={16} />
                <span>Communication</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <SystemSettings />
                </div>
                
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <Card className="overflow-hidden border-none shadow-md">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                        <CardTitle className="text-lg font-semibold">System Information</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Version</span>
                            <span className="font-medium">1.0.0</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Environment</span>
                            <span className="font-medium">Production</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Updated</span>
                            <span className="font-medium">Today</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Build</span>
                            <span className="font-medium">#12345</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="database">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-3">
                  <DatabaseStatus />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="communication">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="lg:col-span-1">
                  <MqttSettings />
                </div>
                <div className="lg:col-span-1">
                  <VDA5050Settings />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
