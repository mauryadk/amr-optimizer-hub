
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, 
  Code, 
  Server, 
  Database, 
  Key, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  Copy,
  RefreshCw,
  PlayCircle,
  ExternalLink
} from "lucide-react";

export default function Documentation() {
  const [apiTestEndpoint, setApiTestEndpoint] = useState("");
  const [apiTestResult, setApiTestResult] = useState<null | { success: boolean; message: string; data?: any }>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  
  const apiCategories = [
    {
      id: "amr-endpoints",
      name: "AMR Endpoints",
      apis: [
        { method: "GET", path: "/api/robots", description: "List all robots in the fleet" },
        { method: "GET", path: "/api/robots/:id", description: "Get details of a specific robot" },
        { method: "GET", path: "/api/robots/positions", description: "Get current positions of all robots" },
        { method: "POST", path: "/api/robots/:id/command", description: "Send a command to a specific robot" }
      ]
    },
    {
      id: "map-endpoints",
      name: "Map Endpoints",
      apis: [
        { method: "GET", path: "/api/map/background", description: "Get the background map" },
        { method: "GET", path: "/api/map/nodes", description: "Get all map nodes" },
        { method: "GET", path: "/api/map/nodes/:id", description: "Get details of a specific node" },
        { method: "POST", path: "/api/map/polygons", description: "Create a new polygon zone" }
      ]
    },
    {
      id: "task-endpoints",
      name: "Task Endpoints",
      apis: [
        { method: "GET", path: "/api/tasks", description: "List all tasks" },
        { method: "POST", path: "/api/tasks", description: "Create a new task" },
        { method: "GET", path: "/api/tasks/:id", description: "Get details of a specific task" },
        { method: "PUT", path: "/api/tasks/:id", description: "Update a task" }
      ]
    }
  ];
  
  const handleTestApi = async () => {
    if (!apiTestEndpoint) {
      toast({
        title: "Missing endpoint",
        description: "Please enter an API endpoint to test",
        variant: "destructive"
      });
      return;
    }
    
    setIsTestingApi(true);
    setApiTestResult(null);
    
    try {
      // Simulating API test - in a real app, you'd make an actual fetch call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (apiTestEndpoint.includes("/robots")) {
        setApiTestResult({
          success: true,
          message: "API request successful",
          data: [
            { id: "robot1", name: "AMR-001", status: "active", batteryLevel: 87 },
            { id: "robot2", name: "AMR-002", status: "charging", batteryLevel: 42 }
          ]
        });
      } else if (apiTestEndpoint.includes("/map")) {
        setApiTestResult({
          success: true,
          message: "API request successful",
          data: { mapId: "warehouse_1", version: "2.3", lastUpdated: "2023-10-15" }
        });
      } else {
        setApiTestResult({
          success: false,
          message: "Endpoint not found or not accessible"
        });
      }
    } catch (error) {
      setApiTestResult({
        success: false,
        message: "Error testing API: " + (error instanceof Error ? error.message : "Unknown error")
      });
    } finally {
      setIsTestingApi(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center mb-6">
        <FileText className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">System Documentation</h1>
      </div>
      
      <Tabs defaultValue="api-reference">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="api-reference" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            API Reference
          </TabsTrigger>
          <TabsTrigger value="getting-started" className="flex items-center">
            <PlayCircle className="mr-2 h-4 w-4" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="configuration" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-reference" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Complete reference of all API endpoints available in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">API Testing Tool</h3>
                  <Badge variant="outline" className="ml-2">Beta</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Enter an API endpoint to test it directly from the documentation
                </p>
                
                <div className="flex space-x-2">
                  <Input 
                    placeholder="/api/robots" 
                    value={apiTestEndpoint} 
                    onChange={(e) => setApiTestEndpoint(e.target.value)}
                  />
                  <Button 
                    onClick={handleTestApi} 
                    disabled={isTestingApi}
                    className="flex items-center"
                  >
                    {isTestingApi ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                    Test
                  </Button>
                </div>
                
                {apiTestResult && (
                  <div className="mt-4">
                    <Alert variant={apiTestResult.success ? "default" : "destructive"}>
                      {apiTestResult.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <AlertTitle>{apiTestResult.success ? "Success" : "Error"}</AlertTitle>
                      <AlertDescription>{apiTestResult.message}</AlertDescription>
                    </Alert>
                    
                    {apiTestResult.data && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-md border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Response</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(apiTestResult.data, null, 2));
                              toast({
                                title: "Copied to clipboard",
                                description: "API response has been copied to your clipboard"
                              });
                            }}
                          >
                            <Copy className="mr-2 h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                        <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                          {JSON.stringify(apiTestResult.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {apiCategories.map((category) => (
                  <AccordionItem value={category.id} key={category.id}>
                    <AccordionTrigger className="text-lg">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Method</TableHead>
                            <TableHead>Endpoint</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="w-[100px]">Try</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.apis.map((api, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    api.method === "GET" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    api.method === "POST" ? "bg-green-50 text-green-700 border-green-200" :
                                    api.method === "PUT" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    "bg-red-50 text-red-700 border-red-200"
                                  }
                                >
                                  {api.method}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{api.path}</TableCell>
                              <TableCell className="hidden md:table-cell">{api.description}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setApiTestEndpoint(api.path.replace(/:id/, "1"));
                                    toast({
                                      title: "Endpoint loaded",
                                      description: `${api.method} ${api.path} is ready to test`
                                    });
                                  }}
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  <span className="sr-only">Test API</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  How to authenticate with the API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  The API uses JWT token-based authentication. To authenticate, include the JWT token in the Authorization header:
                </p>
                <pre className="text-xs bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
                  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </pre>
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Token expiration is set to 24 hours. Make sure to refresh your token before it expires.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Data Models
                </CardTitle>
                <CardDescription>
                  Core data structures used in the API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Robot</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
{`{
  "id": "string",
  "name": "string",
  "status": "active | charging | error | offline",
  "batteryLevel": "number",
  "position": { "x": "number", "y": "number" },
  "lastUpdated": "ISO timestamp"
}`}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Task</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto">
{`{
  "id": "string",
  "type": "pickup | delivery | charge",
  "status": "pending | in-progress | completed | failed",
  "assignedTo": "robot id",
  "priority": "number",
  "createdAt": "ISO timestamp"
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with the Fleet Management System</CardTitle>
              <CardDescription>
                Quick introduction to using the system effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Overview</h3>
                <p className="text-sm">
                  The Anzo Controls Fleet Management System provides a comprehensive solution for managing, monitoring, and controlling your robot fleet. This guide will help you get started with the basic operations.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">System Components</h3>
                <ul className="list-disc list-inside space-y-2 text-sm pl-4">
                  <li><strong>Dashboard:</strong> Main overview of fleet status and operations</li>
                  <li><strong>Robot Fleet:</strong> Detailed view and control of individual robots</li>
                  <li><strong>Map:</strong> Interactive navigation map with real-time positions</li>
                  <li><strong>Task Management:</strong> Create and manage tasks for your fleet</li>
                  <li><strong>Settings:</strong> Configure system parameters and connections</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Quick Start Steps</h3>
                <ol className="list-decimal list-inside space-y-3 text-sm pl-4">
                  <li>
                    <strong>Set up your database connection</strong>
                    <p className="text-xs text-gray-500 mt-1">
                      Navigate to Settings and configure your database connection parameters.
                    </p>
                  </li>
                  <li>
                    <strong>Connect to your robot fleet</strong>
                    <p className="text-xs text-gray-500 mt-1">
                      Configure MQTT settings to establish communication with your robots.
                    </p>
                  </li>
                  <li>
                    <strong>Set up your map</strong>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload your facility map or generate a new one using the Map page.
                    </p>
                  </li>
                  <li>
                    <strong>Create your first task</strong>
                    <p className="text-xs text-gray-500 mt-1">
                      Navigate to Task Management to schedule your first operation.
                    </p>
                  </li>
                </ol>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Download User Manual
                </Button>
                <Button className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Tutorial Videos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configuration options and settings for the Fleet Management System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Database Configuration</h3>
                <p className="text-sm mb-3">
                  The system supports multiple database providers. You can configure your connection in the Settings page.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Connection Format</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>PostgreSQL</TableCell>
                      <TableCell className="font-mono text-xs">postgresql://user:password@host:port/database</TableCell>
                      <TableCell>Recommended for production</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MySQL</TableCell>
                      <TableCell className="font-mono text-xs">mysql://user:password@host:port/database</TableCell>
                      <TableCell>Also supported</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>SQL Server</TableCell>
                      <TableCell className="font-mono text-xs">sqlserver://user:password@host:port/database</TableCell>
                      <TableCell>Enterprise environments</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">MQTT Settings</h3>
                <p className="text-sm">
                  Configure MQTT broker settings to establish real-time communication with your robot fleet.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-2">
                  <li><strong>Broker URL:</strong> Address of your MQTT broker</li>
                  <li><strong>Port:</strong> Typically 1883 (non-TLS) or 8883 (TLS)</li>
                  <li><strong>Username/Password:</strong> Authentication credentials</li>
                  <li><strong>Client ID:</strong> Unique identifier for this connection</li>
                  <li><strong>Topics:</strong> Configure topic patterns for robot communication</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Map Configuration</h3>
                <p className="text-sm">
                  The system supports different map formats and configurations.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-2">
                  <li><strong>Supported formats:</strong> .pgm, .yaml (ROS map format), .json (custom format)</li>
                  <li><strong>Resolution:</strong> Configure map resolution in meters per pixel</li>
                  <li><strong>Origin:</strong> Define the origin coordinates (x, y, theta)</li>
                  <li><strong>Zones:</strong> Define custom polygonal zones on the map</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">VDA5050 Protocol Support</h3>
                <p className="text-sm">
                  The system implements the VDA5050 protocol for AGV communication.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm pl-4 mt-2">
                  <li><strong>Version:</strong> VDA5050 1.1</li>
                  <li><strong>Supported message types:</strong> order, instantActions, state, visualization</li>
                  <li><strong>Custom extensions:</strong> Available for specific vendor implementations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
