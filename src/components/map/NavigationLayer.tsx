
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Package, 
  BoxSelect,
  CircleDot,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PathNode, PathEdge, generateTestNavigationGraph, findShortestPath } from '@/utils/pathCalculator';
import { toast } from '@/hooks/use-toast';

interface NavigationLayerProps {
  editMode: boolean;
  showPaths: boolean;
  robotPositions?: {robotId: string, x: number, y: number}[];
  onNodeSelect?: (nodeId: string) => void;
  onPathSelect?: (edgeId: string) => void;
}

export default function NavigationLayer({
  editMode,
  showPaths,
  robotPositions = [],
  onNodeSelect,
  onPathSelect
}: NavigationLayerProps) {
  const [nodes, setNodes] = useState<PathNode[]>([]);
  const [edges, setEdges] = useState<PathEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

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
    if (editMode) {
      setSelectedNodeId(nodeId);
      if (onNodeSelect) onNodeSelect(nodeId);
      
      toast({
        title: "Node selected",
        description: `Selected ${nodes.find(n => n.id === nodeId)?.name}`,
      });
    }
  };

  // Handle edge selection
  const handleEdgeClick = (edgeId: string) => {
    if (editMode) {
      setSelectedEdgeId(edgeId);
      if (onPathSelect) onPathSelect(edgeId);
      
      toast({
        title: "Path selected",
        description: "You can now edit this path's properties",
      });
    }
  };

  // Handle node drag start
  const handleDragStart = (nodeId: string) => {
    if (editMode) {
      setIsDragging(true);
      setDraggedNodeId(nodeId);
    }
  };

  // Handle node drag
  const handleDrag = (e: React.MouseEvent, nodeId: string) => {
    if (editMode && isDragging && draggedNodeId === nodeId) {
      const rect = (e.target as Element).closest('.map-container')?.getBoundingClientRect();
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
    if (editMode) {
      setIsDragging(false);
      setDraggedNodeId(null);
    }
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

  if (!showPaths) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Render edges first (under nodes) */}
      {edges.map(edge => (
        <div
          key={edge.id}
          className={getEdgeClassName(edge)}
          style={calculateLineStyle(edge)}
          onClick={() => handleEdgeClick(edge.id)}
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
            activePath.includes(node.id) ? "ring-2 ring-green-400 ring-opacity-50" : ""
          )}
          style={{ 
            left: `${node.x}px`, 
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: selectedNodeId === node.id ? 10 : 5
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => handleNodeClick(node.id)}
          onMouseDown={() => handleDragStart(node.id)}
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
      {robotPositions.map((position) => (
        <motion.div
          key={position.robotId}
          className="absolute bg-green-100 rounded-full p-1 border-2 border-green-500"
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
      ))}
    </div>
  );
}
