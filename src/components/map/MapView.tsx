
import { useState, useEffect, useRef, useCallback } from 'react';
import { robotPositions, robots, getStatusColor } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { 
  BatteryMedium, 
  AlertCircle,
  Truck,
  Map as MapIcon,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NavigationLayer from './NavigationLayer';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MapViewProps {
  editMode?: boolean;
  showBackgroundMap?: boolean;
  showPaths?: boolean;
}

export default function MapView({ 
  editMode = false, 
  showBackgroundMap = true,
  showPaths = true
}: MapViewProps) {
  const [hoveredRobot, setHoveredRobot] = useState<string | null>(null);
  const [animatedPositions, setAnimatedPositions] = useState(robotPositions);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewScale, setViewScale] = useState(1);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isDraggingView, setIsDraggingView] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<any>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Simulated movement for active robots
  useEffect(() => {
    // Only animate robots with "active" status
    const activeRobotIds = robots
      .filter(robot => robot.status === 'active')
      .map(robot => robot.id);
      
    const interval = setInterval(() => {
      setAnimatedPositions(prev => 
        prev.map(pos => {
          if (activeRobotIds.includes(pos.robotId)) {
            return {
              ...pos,
              x: pos.x + (Math.random() * 6 - 3),
              y: pos.y + (Math.random() * 6 - 3)
            };
          }
          return pos;
        })
      );
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate loading ROS map
  useEffect(() => {
    if (showBackgroundMap) {
      setMapLoaded(false);
      const timer = setTimeout(() => {
        setMapLoaded(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showBackgroundMap]);

  // Handle view dragging
  const handleViewDragStart = useCallback((e: React.MouseEvent) => {
    if (!editMode) {
      setIsDraggingView(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [editMode]);

  const handleViewDragMove = useCallback((e: React.MouseEvent) => {
    if (isDraggingView && !editMode) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      setViewPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDraggingView, editMode, dragStart]);

  const handleViewDragEnd = useCallback(() => {
    setIsDraggingView(false);
  }, []);

  // Handle zoom in/out button clicks
  const handleZoomIn = useCallback(() => {
    setViewScale(prev => Math.min(prev + 0.1, 2));
    toast({
      title: "Zoomed in",
      description: `Zoom level: ${Math.round((viewScale + 0.1) * 100)}%`
    });
  }, [viewScale]);

  const handleZoomOut = useCallback(() => {
    setViewScale(prev => Math.max(prev - 0.1, 0.5));
    toast({
      title: "Zoomed out",
      description: `Zoom level: ${Math.round((viewScale - 0.1) * 100)}%`
    });
  }, [viewScale]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!editMode) {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(viewScale + delta, 0.5), 2);
      setViewScale(newScale);
    }
  }, [editMode, viewScale]);

  // Reset view
  const resetView = useCallback(() => {
    setViewScale(1);
    setViewPosition({ x: 0, y: 0 });
    toast({
      title: "View reset",
      description: "Map view has been reset to the default position"
    });
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeInfo({
      id: nodeId,
      name: "Pickup Station A",
      type: "pickup",
      connections: 3,
      lastVisited: "2 hours ago"
    });
    setShowNodeDetails(true);
  }, []);

  // Find robot details
  const findRobot = useCallback((id: string) => robots.find(r => r.id === id), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-5 shadow-sm h-full relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Robot Navigation Map</h2>
        
        {!editMode && (
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetView}
              className="flex items-center"
            >
              <RotateCw size={14} className="mr-1" />
              Reset View
            </Button>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded-md">
              Zoom: {Math.round(viewScale * 100)}%
            </div>
          </div>
        )}
      </div>

      <div 
        className={cn(
          "relative h-[calc(100%-2rem)] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 map-container",
          editMode ? "cursor-crosshair" : isDraggingView ? "cursor-grabbing" : "cursor-grab"
        )}
        ref={mapContainerRef}
        onMouseDown={handleViewDragStart}
        onMouseMove={handleViewDragMove}
        onMouseUp={handleViewDragEnd}
        onMouseLeave={handleViewDragEnd}
        onWheel={handleWheel}
      >
        {/* ROS2 Navigation Map Layer */}
        {showBackgroundMap && (
          <div className="absolute inset-0 z-0">
            {!mapLoaded ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading ROS2 navigation map...</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full opacity-30">
                <img 
                  src="https://i.imgur.com/jVEwTyi.png" 
                  alt="ROS2 Navigation Map" 
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${viewScale}) translate(${viewPosition.x / viewScale}px, ${viewPosition.y / viewScale}px)`,
                    transformOrigin: 'center',
                  }}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Navigation Path Layer */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `scale(${viewScale}) translate(${viewPosition.x / viewScale}px, ${viewPosition.y / viewScale}px)`,
            transformOrigin: 'center',
          }}
        >
          <NavigationLayer 
            editMode={editMode} 
            showPaths={showPaths}
            robotPositions={animatedPositions}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Robot Marker Layer */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `scale(${viewScale}) translate(${viewPosition.x / viewScale}px, ${viewPosition.y / viewScale}px)`,
            transformOrigin: 'center',
          }}
        >
          {animatedPositions.map(position => {
            const robot = findRobot(position.robotId);
            if (!robot) return null;
            
            return (
              <motion.div
                key={position.robotId}
                className="absolute"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.3 }}
                style={{ 
                  left: `${position.x}px`, 
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: hoveredRobot === position.robotId ? 10 : 5
                }}
                onMouseEnter={() => setHoveredRobot(position.robotId)}
                onMouseLeave={() => setHoveredRobot(null)}
              >
                <motion.div 
                  className={cn(
                    "rounded-full flex items-center justify-center relative cursor-pointer",
                    robot.status === 'active' ? "w-8 h-8" : "w-7 h-7",
                    robot.status === 'error' ? "bg-red-100" : "bg-white"
                  )}
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    x: robot.status === 'active' ? [0, 1, 0, -1, 0] : 0,
                    y: robot.status === 'active' ? [0, 1, 0, -1, 0] : 0,
                  }}
                  transition={{ 
                    x: { repeat: Infinity, duration: 2 },
                    y: { repeat: Infinity, duration: 2 }
                  }}
                >
                  {robot.status === 'error' ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : (
                    <Truck size={16} className="text-primary" />
                  )}
                  
                  <div className={cn(
                    "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white",
                    getStatusColor(robot.status)
                  )} />
                  
                  {hoveredRobot === position.robotId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-2 rounded-md shadow-md text-sm whitespace-nowrap z-10 border border-gray-100"
                    >
                      <div className="font-medium">{robot.name}</div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-1.5",
                          getStatusColor(robot.status)
                        )} />
                        <span className="capitalize">{robot.status}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <BatteryMedium size={12} className="mr-1 text-gray-500" />
                        <span>{robot.batteryLevel}%</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-16 right-5 flex flex-col bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
          <button 
            className="p-2 hover:bg-gray-50 border-b border-gray-100 transition-colors"
            onClick={handleZoomIn}
          >
            <ZoomIn size={18} />
          </button>
          <button 
            className="p-2 hover:bg-gray-50 transition-colors"
            onClick={handleZoomOut}
          >
            <ZoomOut size={18} />
          </button>
        </div>
      </div>
      
      {/* Map Legend */}
      <div className="absolute bottom-5 right-5 bg-white rounded-md shadow-sm px-3 py-2 text-xs border border-gray-100">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Active Robot</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <span>Charging Robot</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Error State</span>
        </div>
        <div className="flex items-center">
          <div className="border-2 w-6 border-blue-400 mr-2"></div>
          <span>Preferred Path</span>
        </div>
      </div>
      
      {/* ROS Map Info */}
      {showBackgroundMap && mapLoaded && (
        <div className="absolute bottom-5 left-5 bg-white rounded-md shadow-sm px-3 py-2 text-xs border border-gray-100 flex items-center">
          <MapIcon size={14} className="mr-2 text-gray-500" />
          <span>ROS2 Navigation Map (warehouse_1.pgm)</span>
        </div>
      )}
      
      {/* Node Details Dialog */}
      <Dialog open={showNodeDetails} onOpenChange={setShowNodeDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Node Details</DialogTitle>
            <DialogDescription>
              Information about the selected station
            </DialogDescription>
          </DialogHeader>
          
          {selectedNodeInfo && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">ID:</div>
                <div className="text-sm">{selectedNodeInfo.id}</div>
                
                <div className="text-sm font-medium">Name:</div>
                <div className="text-sm">{selectedNodeInfo.name}</div>
                
                <div className="text-sm font-medium">Type:</div>
                <div className="text-sm capitalize">{selectedNodeInfo.type}</div>
                
                <div className="text-sm font-medium">Connected paths:</div>
                <div className="text-sm">{selectedNodeInfo.connections}</div>
                
                <div className="text-sm font-medium">Last visited:</div>
                <div className="text-sm">{selectedNodeInfo.lastVisited}</div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium mb-2">Connected Stations</h4>
                <ul className="text-xs space-y-1">
                  <li>• Junction 2 (distance: 25m)</li>
                  <li>• Charging Station 1 (distance: 40m)</li>
                  <li>• Delivery Point A (distance: 15m)</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNodeDetails(false)}>Close</Button>
            <Button>Edit Node</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
