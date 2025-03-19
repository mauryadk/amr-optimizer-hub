
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Package, 
  BoxSelect,
  CircleDot,
  Truck,
  Plus,
  Trash2,
  Link,
  RotateCcw,
  BatteryMedium,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PathNode, PathEdge, generateTestNavigationGraph, findShortestPath } from '@/utils/pathCalculator';
import { toast } from '@/hooks/use-toast';
import { robots } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent 
} from '@/components/ui/hover-card';

interface NavigationLayerProps {
  editMode: boolean;
  showPaths: boolean;
  robotPositions?: {robotId: string, x: number, y: number}[];
  onNodeSelect?: (nodeId: string) => void;
  onPathSelect?: (edgeId: string) => void;
  isEditingNodes?: boolean;
}

export default function NavigationLayer({
  editMode,
  showPaths,
  robotPositions = [],
  onNodeSelect,
  onPathSelect,
  isEditingNodes = false
}: NavigationLayerProps) {
  const [nodes, setNodes] = useState<PathNode[]>([]);
  const [edges, setEdges] = useState<PathEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isConnectingNodes, setIsConnectingNodes] = useState(false);
  const [connectionStartNodeId, setConnectionStartNodeId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with test data
  useEffect(() => {
    const { nodes: testNodes, edges: testEdges } = generateTestNavigationGraph();
    setNodes(testNodes);
    setEdges(testEdges);
  }, []);

  // Simulate a robot following a path
  useEffect(() => {
    if (!showPaths) return;
    
    // Find a path from first node to last node
    const firstNodeId = nodes[0]?.id;
    const lastNodeId = nodes[nodes.length - 1]?.id;
    
    if (firstNodeId && lastNodeId) {
      const { path } = findShortestPath(nodes, edges, firstNodeId, lastNodeId);
      setActivePath(path);
    }
  }, [nodes, edges, showPaths]);

  // Handle node selection
  const handleNodeClick = (nodeId: string) => {
    if (isEditingNodes) {
      if (isConnectingNodes) {
        if (connectionStartNodeId) {
          // Create a new connection between nodes
          const newEdgeId = `e${Date.now()}`;
          const newEdge: PathEdge = {
            id: newEdgeId,
            source: connectionStartNodeId,
            target: nodeId,
            bidirectional: true,
            cost: 1,
            preferred: false
          };
          
          setEdges(prev => [...prev, newEdge]);
          setIsConnectingNodes(false);
          setConnectionStartNodeId(null);
          
          toast({
            title: "Path created",
            description: "A new path between nodes has been created",
          });
        } else {
          setConnectionStartNodeId(nodeId);
          toast({
            title: "First node selected",
            description: "Now select the second node to connect to",
          });
        }
      } else {
        setSelectedNodeId(nodeId);
        if (onNodeSelect) onNodeSelect(nodeId);
        
        toast({
          title: "Node selected",
          description: `Selected ${nodes.find(n => n.id === nodeId)?.name}`,
        });
      }
    }
  };

  // Handle edge selection
  const handleEdgeClick = (edgeId: string) => {
    if (isEditingNodes) {
      setSelectedEdgeId(edgeId);
      if (onPathSelect) onPathSelect(edgeId);
      
      toast({
        title: "Path selected",
        description: "You can now edit this path's properties",
      });
    }
  };

  // Handle node drag start
  const handleDragStart = (nodeId: string, e: React.MouseEvent) => {
    if (isEditingNodes) {
      e.stopPropagation();
      setIsDragging(true);
      setDraggedNodeId(nodeId);
    }
  };

  // Handle node drag
  const handleDrag = (e: React.MouseEvent, nodeId: string) => {
    if (isEditingNodes && isDragging && draggedNodeId === nodeId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === nodeId ? { ...node, x, y } : node
          )
        );
      }
    }
  };

  // Handle node drag end
  const handleDragEnd = () => {
    if (isEditingNodes) {
      setIsDragging(false);
      setDraggedNodeId(null);
    }
  };

  // Add a new node to the map
  const handleAddNode = (e: React.MouseEvent) => {
    if (!isEditingNodes || !isAddingNode || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newNodeId = `n${Date.now()}`;
    const newNode: PathNode = {
      id: newNodeId,
      name: `New Node ${nodes.length + 1}`,
      type: 'junction',
      x,
      y
    };
    
    setNodes(prev => [...prev, newNode]);
    setIsAddingNode(false);
    
    toast({
      title: "Node added",
      description: "A new node has been added to the map",
    });
  };

  // Delete the selected node
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    
    // Remove all edges connected to this node
    const filteredEdges = edges.filter(
      edge => edge.source !== selectedNodeId && edge.target !== selectedNodeId
    );
    
    setEdges(filteredEdges);
    setNodes(prev => prev.filter(node => node.id !== selectedNodeId));
    setSelectedNodeId(null);
    
    toast({
      title: "Node deleted",
      description: "The node and its connections have been removed",
    });
  };

  // Delete the selected edge
  const handleDeleteEdge = () => {
    if (!selectedEdgeId) return;
    
    setEdges(prev => prev.filter(edge => edge.id !== selectedEdgeId));
    setSelectedEdgeId(null);
    
    toast({
      title: "Path deleted",
      description: "The path has been removed",
    });
  };

  // Toggle path preference
  const handleTogglePreference = () => {
    if (!selectedEdgeId) return;
    
    setEdges(prev => prev.map(edge => 
      edge.id === selectedEdgeId ? { ...edge, preferred: !edge.preferred } : edge
    ));
    
    toast({
      title: "Path preference updated",
      description: "The path preference has been toggled",
    });
  };

  // Get icon based on node type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'charging':
        return <Zap size={16} className="text-yellow-500" />;
      case 'pickup':
        return <Package size={16} className="text-blue-500" />;
      case 'delivery':
        return <BoxSelect size={16} className="text-indigo-500" />;
      case 'storage':
        return <Package size={16} className="text-gray-500" />;
      case 'junction':
        return <CircleDot size={16} className="text-purple-500" />;
      default:
        return <MapPin size={16} className="text-red-500" />;
    }
  };

  // Get line className based on edge properties
  const getEdgeClassName = (edge: PathEdge) => {
    return cn(
      "absolute border-2 origin-left",
      edge.preferred ? "border-blue-400" : "border-gray-300",
      activePath.includes(edge.source) && activePath.includes(edge.target) ? "border-green-500" : "",
      selectedEdgeId === edge.id ? "border-primary" : ""
    );
  };

  // Calculate line style for an edge
  const calculateLineStyle = (edge: PathEdge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return {};
    
    const dx = targetNode.x - sourceNode.x;
    const dy = targetNode.y - sourceNode.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    return {
      width: `${length}px`,
      transform: `translate(${sourceNode.x}px, ${sourceNode.y}px) rotate(${angle}deg)`,
    };
  };

  // Find robot details by ID
  const findRobotDetails = (id: string) => {
    return robots.find(r => r.id === id) || null;
  };

  if (!showPaths) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" ref={containerRef} onClick={handleAddNode}>
      {/* Render edges first (under nodes) */}
      {edges.map(edge => (
        <div
          key={edge.id}
          className={getEdgeClassName(edge)}
          style={calculateLineStyle(edge)}
          onClick={(e) => {
            e.stopPropagation();
            handleEdgeClick(edge.id);
          }}
          onMouseOver={() => !editMode && setSelectedEdgeId(edge.id)}
          onMouseOut={() => !editMode && setSelectedEdgeId(null)}
        />
      ))}
      
      {/* Then render nodes */}
      {nodes.map(node => (
        <motion.div
          key={node.id}
          className={cn(
            "absolute pointer-events-auto rounded-full p-1.5 border-2 cursor-pointer transition-all duration-200",
            selectedNodeId === node.id 
              ? "bg-white border-primary shadow-md" 
              : "bg-white/80 border-gray-300 hover:border-primary/70",
            activePath.includes(node.id) ? "ring-2 ring-green-400 ring-opacity-50" : "",
            connectionStartNodeId === node.id ? "ring-2 ring-blue-500" : ""
          )}
          style={{ 
            left: `${node.x}px`, 
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: selectedNodeId === node.id ? 10 : 5
          }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.stopPropagation();
            handleNodeClick(node.id);
          }}
          onMouseDown={(e) => handleDragStart(node.id, e)}
          onMouseMove={(e) => handleDrag(e, node.id)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {getNodeIcon(node.type)}
          
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs whitespace-nowrap">
            {node.name}
          </div>
        </motion.div>
      ))}
      
      {/* Render robot positions on top */}
      {robotPositions.map((position) => {
        const robotDetails = findRobotDetails(position.robotId);
        
        return (
          <HoverCard key={position.robotId} openDelay={100} closeDelay={200}>
            <HoverCardTrigger asChild>
              <motion.div
                className="absolute bg-green-100 rounded-full p-1 border-2 border-green-500 pointer-events-auto"
                style={{ 
                  left: `${position.x}px`, 
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20
                }}
                animate={{ 
                  x: [0, 2, 0, -2, 0],
                  y: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2 
                }}
              >
                <Truck size={14} className="text-green-600" />
              </motion.div>
            </HoverCardTrigger>
            
            <HoverCardContent side="top" className="w-64 p-4">
              {robotDetails ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-base">{robotDetails.name}</h3>
                    <div className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      robotDetails.status === 'active' ? "bg-green-100 text-green-800" :
                      robotDetails.status === 'charging' ? "bg-yellow-100 text-yellow-800" :
                      robotDetails.status === 'error' ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    )}>
                      {robotDetails.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <div className="text-gray-500">ID:</div>
                    <div>{robotDetails.id}</div>
                    
                    <div className="text-gray-500">Model:</div>
                    <div>{robotDetails.model}</div>
                    
                    <div className="text-gray-500">Status:</div>
                    <div className="capitalize">{robotDetails.status}</div>
                  </div>
                  
                  <div className="pt-2 flex space-x-4">
                    <div className="flex items-center">
                      <BatteryMedium className="h-4 w-4 mr-1 text-gray-500" />
                      <div className="text-sm">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full",
                              robotDetails.batteryLevel > 60 ? "bg-green-500" :
                              robotDetails.batteryLevel > 30 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${robotDetails.batteryLevel}%` }}
                          />
                        </div>
                        <span className="text-xs">{robotDetails.batteryLevel}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Wifi className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-xs">Connected</span>
                    </div>
                  </div>
                  
                  <div className="pt-1 text-xs text-gray-500">
                    Current Task: {robotDetails.currentTask || "None"}
                  </div>
                </div>
              ) : (
                <div className="text-sm">Robot data unavailable</div>
              )}
            </HoverCardContent>
          </HoverCard>
        );
      })}

      {/* Node editing controls */}
      {isEditingNodes && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 pointer-events-auto flex space-x-2 z-10">
          <Button 
            variant={isAddingNode ? "secondary" : "outline"} 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingNode(!isAddingNode);
              setIsConnectingNodes(false);
              setConnectionStartNodeId(null);
              
              if (!isAddingNode) {
                toast({
                  title: "Add mode activated",
                  description: "Click anywhere on the map to add a new node",
                });
              }
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Node
          </Button>
          
          <Button 
            variant={isConnectingNodes ? "secondary" : "outline"} 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsConnectingNodes(!isConnectingNodes);
              setIsAddingNode(false);
              setConnectionStartNodeId(null);
              
              if (!isConnectingNodes) {
                toast({
                  title: "Connect mode activated",
                  description: "Select two nodes to create a path between them",
                });
              }
            }}
            disabled={nodes.length < 2}
          >
            <Link className="mr-1 h-4 w-4" />
            Connect
          </Button>
          
          {selectedNodeId && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode();
              }}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete Node
            </Button>
          )}
          
          {selectedEdgeId && (
            <>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEdge();
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete Path
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePreference();
                }}
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Toggle Preferred
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
