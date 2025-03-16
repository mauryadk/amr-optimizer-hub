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
  ZoomOut,
  Save
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
  isGeneratingMap?: boolean;
  isFullscreen?: boolean;
}

export default function MapView({ 
  editMode = false, 
  showBackgroundMap = true,
  showPaths = true,
  isGeneratingMap = false,
  isFullscreen = false
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
  const [mapGenerationProgress, setMapGenerationProgress] = useState(0);
  const [showMapPreview, setShowMapPreview] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGeneratingMap) {
      const interval = setInterval(() => {
        setMapGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 2000);
      
      return () => {
        clearInterval(interval);
        setMapGenerationProgress(0);
      };
    }
  }, [isGeneratingMap]);

  useEffect(() => {
    const fetchRobotPositions = async () => {
      try {
        const response = await fetch('/api/robots/positions');
        if (!response.ok) throw new Error('Failed to fetch robot positions');
        const data = await response.json();
        if (data && data.length > 0) {
          setAnimatedPositions(data);
        }
      } catch (error) {
        console.error('Error fetching robot positions:', error);
      }
    };
    
    fetchRobotPositions();
    
    const interval = setInterval(() => {
      fetchRobotPositions();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showBackgroundMap) {
      setMapLoaded(false);
      
      fetch('/api/map/background')
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          if (data) {
            setMapLoaded(true);
          }
        })
        .catch(error => {
          console.error('Error loading background map:', error);
          const timer = setTimeout(() => {
            setMapLoaded(true);
          }, 1000);
          
          return () => clearTimeout(timer);
        });
    }
  }, [showBackgroundMap]);

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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!editMode) {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.min(Math.max(viewScale + delta, 0.5), 2);
      setViewScale(newScale);
    }
  }, [editMode, viewScale]);

  const resetView = useCallback(() => {
    setViewScale(1);
    setViewPosition({ x: 0, y: 0 });
    toast({
      title: "View reset",
      description: "Map view has been reset to the default position"
    });
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    fetch(`/api/map/nodes/${nodeId}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setSelectedNodeInfo(data);
        setShowNodeDetails(true);
      })
      .catch(error => {
        console.error('Error fetching node details:', error);
        setSelectedNodeInfo({
          id: nodeId,
          name: "Pickup Station A",
          type: "pickup",
          connections: 3,
          lastVisited: "2 hours ago"
        });
        setShowNodeDetails(true);
      });
  }, []);

  const handleSaveGeneratingMap = useCallback(() => {
    toast({
      title: "Map saved",
      description: "The current map has been saved as a snapshot"
    });
  }, []);

  const handleViewMapProgress = useCallback(() => {
    setShowMapPreview(true);
  }, []);

  const findRobot = useCallback((id: string) => robots.find(r => r.id === id), []);

  const containerClass = isFullscreen 
    ? "absolute inset-0 p-0 rounded-none" 
    : "glass-card rounded-xl p-5 shadow-sm h-full relative overflow-hidden";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={containerClass}
    >
      {!isFullscreen && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <img 
              src="https://www.anzocontrols.com/wp-content/uploads/2022/11/Client_logo_anzo-removebg-preview-2.png" 
              alt="Anzo Controls"
              className="h-6 mr-2"
            />
            Robot Navigation Map
          </h2>
          
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
      )}

      <div 
        className={cn(
          "relative bg-gray-50 rounded-lg overflow-hidden border border-gray-100 map-container",
          editMode ? "cursor-crosshair" : isDraggingView ? "cursor-grabbing" : "cursor-grab",
          isFullscreen ? "h-full" : "h-[calc(100%-2rem)]"
        )}
        ref={mapContainerRef}
        onMouseDown={handleViewDragStart}
        onMouseMove={handleViewDragMove}
        onMouseUp={handleViewDragEnd}
        onMouseLeave={handleViewDragEnd}
        onWheel={handleWheel}
      >
        {showBackgroundMap && !isGeneratingMap && (
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
        
        {isGeneratingMap && (
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full">
              {mapGenerationProgress < 100 ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                  <p className="text-sm text-gray-700 font-medium">Generating Map: {mapGenerationProgress}%</p>
                  <p className="mt-1 text-xs text-gray-500">Robot is exploring the environment</p>
                  
                  <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 ease-out" 
                      style={{ width: `${mapGenerationProgress}%` }} 
                    />
                  </div>
                  
                  <div className="mt-5 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleViewMapProgress}
                      className="text-xs"
                    >
                      View Progress
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={handleSaveGeneratingMap}
                      className="text-xs"
                    >
                      <Save size={12} className="mr-1" />
                      Save Snapshot
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full">
                  <img 
                    src="https://i.imgur.com/O9mnPeV.png" 
                    alt="Generated Map" 
                    className="w-full h-full object-cover opacity-70"
                    style={{
                      transform: `scale(${viewScale}) translate(${viewPosition.x / viewScale}px, ${viewPosition.y / viewScale}px)`,
                      transformOrigin: 'center',
                    }}
                  />
                  
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                    Map Generation Complete!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {!isGeneratingMap && (
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
        )}

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
                    robot.status === 'error' ? "bg-red-100" : isGeneratingMap && robot.id === 'robot1' ? "bg-blue-100" : "bg-white"
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
                  ) : isGeneratingMap && robot.id === 'robot1' ? (
                    <MapIcon size={16} className="text-blue-500" />
                  ) : (
                    <Truck size={16} className="text-primary" />
                  )}
                  
                  <div className={cn(
                    "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white",
                    isGeneratingMap && robot.id === 'robot1' ? "bg-blue-500" : getStatusColor(robot.status)
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
                          isGeneratingMap && robot.id === 'robot1' ? "bg-blue-500" : getStatusColor(robot.status)
                        )} />
                        <span className="capitalize">
                          {isGeneratingMap && robot.id === 'robot1' ? "Mapping" : robot.status}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <BatteryMedium size={12} className="mr-1 text-gray-500" />
                        <span>{robot.batteryLevel}%</span>
                      </div>
                      
                      {isGeneratingMap && robot.id === 'robot1' && (
                        <div className="flex items-center mt-1 text-xs text-blue-500 font-medium">
                          <MapIcon size={12} className="mr-1" />
                          <span>Map Progress: {mapGenerationProgress}%</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
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
        {isGeneratingMap && (
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Mapping Robot</span>
          </div>
        )}
        <div className="flex items-center">
          <div className="border-2 w-6 border-blue-400 mr-2"></div>
          <span>Preferred Path</span>
        </div>
      </div>
      
      {showBackgroundMap && mapLoaded && !isGeneratingMap && (
        <div className="absolute bottom-5 left-5 bg-white rounded-md shadow-sm px-3 py-2 text-xs border border-gray-100 flex items-center">
          <MapIcon size={14} className="mr-2 text-gray-500" />
          <span>ROS2 Navigation Map (warehouse_1.pgm)</span>
        </div>
      )}
      
      {isGeneratingMap && mapGenerationProgress >= 100 && (
        <div className="absolute bottom-5 left-5 bg-white rounded-md shadow-sm px-3 py-2 text-xs border border-green-200 flex items-center text-green-800 bg-green-50">
          <MapIcon size={14} className="mr-2" />
          <span>New Map Ready (warehouse_new.pgm)</span>
        </div>
      )}
      
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
      
      <Dialog open={showMapPreview} onOpenChange={setShowMapPreview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Map Generation Preview</DialogTitle>
            <DialogDescription>
              Current progress of the map being generated
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <img 
                src={mapGenerationProgress < 50 ? "https://i.imgur.com/EqYYmb0.png" : "https://i.imgur.com/O9mnPeV.png"} 
                alt="Map Generation Preview" 
                className="w-full"
              />
            </div>
            
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>Progress: {mapGenerationProgress}%</span>
              <span>Area mapped: {Math.floor(mapGenerationProgress * 5.2)}m²</span>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-2">Mapping Information</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-gray-500">Robot:</div>
                <div>{robots.find(r => r.id === 'robot1')?.name}</div>
                <div className="text-gray-500">Start time:</div>
                <div>{new Date().toLocaleTimeString()}</div>
                <div className="text-gray-500">Estimated completion:</div>
                <div>{mapGenerationProgress < 100 ? 'Approximately 5 minutes' : 'Complete'}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowMapPreview(false)}
            >
              Close
            </Button>
            {mapGenerationProgress >= 100 && (
              <Button 
                onClick={() => {
                  setShowMapPreview(false);
                  toast({
                    title: "Map saved",
                    description: "The generated map has been saved"
                  });
                }}
              >
                <Save size={16} className="mr-1.5" />
                Save Map
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
