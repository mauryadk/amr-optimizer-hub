
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Book, 
  FileText, 
  Code, 
  Server, 
  Map, 
  Truck, 
  Cog, 
  HardHat, 
  BoxesIcon
} from 'lucide-react';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto p-6 pb-24">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-gray-500 mt-1 mb-8">
              Learn how to use the AMR Fleet Management System
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8 bg-white shadow-sm border border-gray-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Book className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="robots" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Truck className="w-4 h-4 mr-2" />
                Robots
              </TabsTrigger>
              <TabsTrigger value="mapping" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Map className="w-4 h-4 mr-2" />
                Mapping
              </TabsTrigger>
              <TabsTrigger value="tasks" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <BoxesIcon className="w-4 h-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <Cog className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <TabsContent value="overview" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">AMR Fleet Management System</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The Anzo Controls AMR Fleet Management System provides comprehensive tools for managing a fleet 
                    of Autonomous Mobile Robots (AMRs). This documentation will guide you through the various features 
                    of the system and help you optimize your robot operations.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <div className="flex items-center mb-3">
                        <HardHat className="w-6 h-6 text-primary mr-2" />
                        <h3 className="text-lg font-medium text-slate-800">Key Features</h3>
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Real-time monitoring of all robots</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Interactive map visualization</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Task scheduling and assignment</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Map distribution to connected robots</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Battery and system health monitoring</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <div className="flex items-center mb-3">
                        <Server className="w-6 h-6 text-primary mr-2" />
                        <h3 className="text-lg font-medium text-slate-800">System Requirements</h3>
                      </div>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Modern web browser (Chrome, Firefox, Edge)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Network connectivity to robot fleet</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>VDA5050 compatible robots</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>MQTT broker for robot communication</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="robots" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">Robot Management</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The Robots section allows you to monitor and control your entire fleet of AMRs. 
                    You can view detailed information about each robot, including its status, battery level, 
                    current location, and assigned tasks.
                  </p>
                  
                  <div className="mt-8 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Adding a New Robot</h3>
                      <ol className="space-y-3 text-gray-600 list-decimal pl-5">
                        <li>Click the <strong>Add Robot</strong> button in the top-right corner</li>
                        <li>Enter the required information:
                          <ul className="ml-5 mt-2 space-y-1 list-disc">
                            <li>Robot Name</li>
                            <li>Model</li>
                            <li>IP Address</li>
                            <li>Initial Location</li>
                          </ul>
                        </li>
                        <li>Click <strong>Add Robot</strong> to complete the process</li>
                      </ol>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Robot Control Panel</h3>
                      <p className="text-gray-600 mb-4">
                        Each robot card features a control panel that allows you to:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Pause and resume operations</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Trigger emergency stop</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Monitor battery level</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Check system health</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mapping" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">Mapping & Navigation</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The Map section provides tools for viewing and editing robot navigation maps, 
                    distributing maps to robots, and generating new maps with the robots.
                  </p>
                  
                  <div className="mt-8 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Map Distribution</h3>
                      <p className="text-gray-600 mb-4">
                        Distribute navigation maps to your robots to ensure they all have the latest mapping data:
                      </p>
                      <ol className="space-y-3 text-gray-600 list-decimal pl-5">
                        <li>Open the Map page and click <strong>Distribute Map</strong></li>
                        <li>Select the robots that should receive the updated map</li>
                        <li>Click <strong>Distribute Map</strong> to send the map to selected robots</li>
                      </ol>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Generating New Maps</h3>
                      <p className="text-gray-600 mb-4">
                        Generate a new map using one of your robots:
                      </p>
                      <ol className="space-y-3 text-gray-600 list-decimal pl-5">
                        <li>Click <strong>Generate New Map</strong> on the Map page</li>
                        <li>Select the robot to use for mapping</li>
                        <li>Set the mapping parameters and start the process</li>
                        <li>Monitor the progress as the robot maps the area</li>
                        <li>Save the map when finished</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">Task Management</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The Tasks section allows you to create, assign, and monitor tasks for your robot fleet.
                  </p>
                  
                  <div className="mt-8 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-3">Creating Tasks</h3>
                      <p className="text-gray-600 mb-4">
                        Create new tasks for your robots:
                      </p>
                      <ol className="space-y-3 text-gray-600 list-decimal pl-5">
                        <li>Navigate to the Tasks page and click <strong>Create Task</strong></li>
                        <li>Fill in the task details:
                          <ul className="ml-5 mt-2 space-y-1 list-disc">
                            <li>Title and description</li>
                            <li>Priority level</li>
                            <li>Location</li>
                            <li>Assign to a specific robot (optional)</li>
                          </ul>
                        </li>
                        <li>Click <strong>Create</strong> to add the task to the queue</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-slate-800">System Settings</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The Settings section allows you to configure the system parameters, including MQTT connection,
                    VDA5050 settings, and database configuration.
                  </p>
                  
                  <div className="mt-8 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                      <h3 className="text-lg font-medium text-slate-800 mb-3">VDA5050 Configuration</h3>
                      <p className="text-gray-600 mb-4">
                        Configure VDA5050 settings for robot communication:
                      </p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Interface version</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Topic prefix</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Manufacturer ID</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                          <span>Update intervals</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
