
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Map, BookOpen, Code, Zap, Terminal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

export default function Documentation() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  
  const handleDemo = (demo: string) => {
    setActiveDemo(demo);
    toast({
      title: `Running demo: ${demo}`,
      description: 'Interactive demo is now running',
    });
    
    // Reset after 10 seconds
    setTimeout(() => {
      setActiveDemo(null);
    }, 10000);
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center mb-6">
        <BookOpen className="mr-3 text-primary" size={24} />
        <h1 className="text-2xl font-bold">Documentation</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview" className="flex items-center">
              <FileText size={16} className="mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="robots" className="flex items-center">
              <Truck size={16} className="mr-2" />
              Robot Control
            </TabsTrigger>
            <TabsTrigger value="mapping" className="flex items-center">
              <Map size={16} className="mr-2" />
              Mapping
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center">
              <Code size={16} className="mr-2" />
              API Reference
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Welcome to Anzo Controls</h2>
              <p className="text-blue-700">
                This documentation provides comprehensive information about using the Anzo Controls system
                for managing your autonomous robot fleet. Use the tabs above to navigate through different
                sections of the documentation.
              </p>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">Getting Started</h3>
            <p className="text-gray-700 mb-4">
              Anzo Controls provides a unified interface for managing autonomous mobile robots (AMRs) in 
              industrial environments. The system allows you to:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Monitor the status and position of all robots in real-time</li>
              <li>Create and manage navigation maps</li>
              <li>Assign and track tasks</li>
              <li>Receive alerts and notifications about system events</li>
              <li>Configure system settings and integrations</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">System Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2">Hardware Requirements</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Modern web browser (Chrome, Firefox, Edge)</li>
                  <li>Display resolution: minimum 1280x720</li>
                  <li>Network connectivity to robot fleet</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2">Software Requirements</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>ROS2 compatible robots</li>
                  <li>VDA5050 interface support</li>
                  <li>MQTT broker for communications</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h4 className="font-medium flex items-center text-amber-700">
                <Zap size={18} className="mr-2" /> Quick Start Guide
              </h4>
              <p className="text-amber-700 mt-2 text-sm">
                For a quick introduction to the system, try one of our interactive demos:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`bg-white ${activeDemo === 'robot-connection' ? 'border-primary text-primary' : ''}`}
                  onClick={() => handleDemo('robot-connection')}
                >
                  Connect Robot
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`bg-white ${activeDemo === 'map-creation' ? 'border-primary text-primary' : ''}`}
                  onClick={() => handleDemo('map-creation')}
                >
                  Create Map
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`bg-white ${activeDemo === 'task-assignment' ? 'border-primary text-primary' : ''}`}
                  onClick={() => handleDemo('task-assignment')}
                >
                  Assign Task
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`bg-white ${activeDemo === 'fleet-monitoring' ? 'border-primary text-primary' : ''}`}
                  onClick={() => handleDemo('fleet-monitoring')}
                >
                  Monitor Fleet
                </Button>
              </div>
              {activeDemo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-white rounded border border-amber-200"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-amber-800">
                      Demo: {activeDemo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h5>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      Running...
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>This interactive demo is running. Check the related section in the documentation for more details.</p>
                    <div className="mt-2 bg-amber-50 p-2 rounded font-mono text-xs overflow-x-auto">
                      <Terminal size={14} className="inline-block mr-1" />
                      {activeDemo === 'robot-connection' && 'connecting to robot via VDA5050...'}
                      {activeDemo === 'map-creation' && 'generating navigation map...'}
                      {activeDemo === 'task-assignment' && 'assigning new delivery task to robot...'}
                      {activeDemo === 'fleet-monitoring' && 'initializing fleet monitoring dashboard...'}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="robots" className="space-y-4">
            <h2 className="text-xl font-semibold">Robot Control Documentation</h2>
            <p className="text-gray-700">
              Learn how to control, monitor, and manage your robot fleet using the Anzo Controls system.
            </p>
            
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium">Robot Control Commands</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-gray-600">Command</th>
                      <th className="text-left py-2 font-medium text-gray-600">Description</th>
                      <th className="text-left py-2 font-medium text-gray-600">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-primary">pause</td>
                      <td className="py-2">Pause robot movement</td>
                      <td className="py-2 font-mono text-xs">robot.pause()</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-primary">resume</td>
                      <td className="py-2">Resume robot movement</td>
                      <td className="py-2 font-mono text-xs">robot.resume()</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-primary">move_to</td>
                      <td className="py-2">Move robot to coordinates</td>
                      <td className="py-2 font-mono text-xs">robot.move_to(x, y)</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-mono text-primary">e_stop</td>
                      <td className="py-2">Emergency stop</td>
                      <td className="py-2 font-mono text-xs">robot.e_stop()</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Status Monitoring</h3>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    The system provides real-time monitoring of robot status including:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Battery level</li>
                    <li>Current position</li>
                    <li>Operating status</li>
                    <li>Current task</li>
                    <li>Error conditions</li>
                  </ul>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Common Troubleshooting</h3>
                </div>
                <div className="p-4 space-y-2">
                  <div className="mb-2">
                    <h4 className="font-medium text-sm">Robot Not Connecting</h4>
                    <p className="text-xs text-gray-600">Check network settings and MQTT connection.</p>
                  </div>
                  <div className="mb-2">
                    <h4 className="font-medium text-sm">Robot Stuck in Error State</h4>
                    <p className="text-xs text-gray-600">Check physical obstacles and use reset function.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Battery Issues</h4>
                    <p className="text-xs text-gray-600">Verify charging station connection and battery health.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mapping" className="space-y-4">
            <h2 className="text-xl font-semibold">Mapping Documentation</h2>
            <p className="text-gray-700">
              Learn how to create, edit, and manage navigation maps for your robot fleet.
            </p>
            
            <div className="mt-4 p-5 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Map Creation Process</h3>
              <ol className="list-decimal list-inside space-y-2 text-green-700 ml-2">
                <li>Select a robot with mapping capabilities</li>
                <li>Choose "Generate New Map" from the map controls</li>
                <li>Guide the robot through the environment or use auto-explore</li>
                <li>Review and save the generated map</li>
                <li>Distribute the map to other robots in the fleet</li>
              </ol>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Map Editing</h3>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p>The map editor allows you to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                    <li>Add and remove nodes</li>
                    <li>Create and modify paths</li>
                    <li>Define node types (pickup, delivery, etc.)</li>
                    <li>Set path properties (bidirectional, preferred)</li>
                  </ul>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Map Distribution</h3>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p>Once a map is created, you can:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                    <li>Select which robots receive the map</li>
                    <li>Monitor distribution progress</li>
                    <li>Verify map reception by each robot</li>
                    <li>Roll back to previous map versions if needed</li>
                  </ul>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium">Map File Formats</h3>
                </div>
                <div className="p-4 space-y-2 text-sm">
                  <p>Supported map formats include:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs">
                    <li>ROS2 map format (.pgm + .yaml)</li>
                    <li>VDA5050 compatible JSON</li>
                    <li>Proprietary Anzo map format</li>
                    <li>Export to common GIS formats</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <h2 className="text-xl font-semibold">API Reference</h2>
            <p className="text-gray-700">
              Technical reference for the Anzo Controls API for system integration.
            </p>
            
            <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div className="text-green-400 mb-2">// Example API request to control a robot</div>
              <div className="text-blue-300">const response = await fetch(</div>
              <div className="pl-4 text-yellow-300">'https://api.anzocontrols.com/v1/robots/001/control',</div>
              <div className="pl-4 text-blue-300">{'{'}</div>
              <div className="pl-8 text-blue-300">method: 'POST',</div>
              <div className="pl-8 text-blue-300">headers: {'{'}</div>
              <div className="pl-12 text-blue-300">'Content-Type': 'application/json',</div>
              <div className="pl-12 text-blue-300">'Authorization': 'Bearer YOUR_API_KEY'</div>
              <div className="pl-8 text-blue-300">{'}'},</div>
              <div className="pl-8 text-blue-300">body: JSON.stringify({'{'}</div>
              <div className="pl-12 text-blue-300">command: 'move_to',</div>
              <div className="pl-12 text-blue-300">params: {'{'}</div>
              <div className="pl-16 text-blue-300">x: 100,</div>
              <div className="pl-16 text-blue-300">y: 200</div>
              <div className="pl-12 text-blue-300">{'}'}</div>
              <div className="pl-8 text-blue-300">{'}'})</div>
              <div className="pl-4 text-blue-300">{'}'}</div>
              <div className="text-blue-300">{')'};</div>
            </div>
            
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium">Available Endpoints</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Endpoint</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Method</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-600">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/robots</td>
                      <td className="py-2 px-4 text-green-600">GET</td>
                      <td className="py-2 px-4">List all robots</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/robots/{'{id}'}</td>
                      <td className="py-2 px-4 text-green-600">GET</td>
                      <td className="py-2 px-4">Get robot details</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/robots/{'{id}'}/control</td>
                      <td className="py-2 px-4 text-blue-600">POST</td>
                      <td className="py-2 px-4">Send control command</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/maps</td>
                      <td className="py-2 px-4 text-green-600">GET</td>
                      <td className="py-2 px-4">List all maps</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/maps/{'{id}'}</td>
                      <td className="py-2 px-4 text-green-600">GET</td>
                      <td className="py-2 px-4">Get map details</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/maps/{'{id}'}/distribute</td>
                      <td className="py-2 px-4 text-blue-600">POST</td>
                      <td className="py-2 px-4">Distribute map to robots</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 font-mono text-xs">/v1/tasks</td>
                      <td className="py-2 px-4 text-green-600">GET</td>
                      <td className="py-2 px-4">List all tasks</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-mono text-xs">/v1/tasks</td>
                      <td className="py-2 px-4 text-blue-600">POST</td>
                      <td className="py-2 px-4">Create new task</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText className="mr-2 text-blue-500" size={20} />
            User Guide
          </h3>
          <p className="text-gray-600 mb-4">
            Comprehensive user guide for operating the Anzo Controls system.
          </p>
          <Button className="w-full">Download PDF</Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Code className="mr-2 text-purple-500" size={20} />
            API Documentation
          </h3>
          <p className="text-gray-600 mb-4">
            Technical documentation for integrating with the Anzo API.
          </p>
          <Button className="w-full">View API Docs</Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Terminal className="mr-2 text-green-500" size={20} />
            Command Reference
          </h3>
          <p className="text-gray-600 mb-4">
            Complete reference of all available robot control commands.
          </p>
          <Button className="w-full">Browse Commands</Button>
        </div>
      </div>
    </div>
  );
}
