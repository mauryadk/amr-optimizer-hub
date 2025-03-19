import { useState, useEffect, useRef, useCallback } from 'react';
import { robotPositions, robots, getStatusColor } from '@/utils/mockData';
import { 
  BatteryMedium, 
  AlertCircle,
  Truck,
  Map as MapIcon,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Save,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NavigationLayer from './NavigationLayer';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Polygon } from '@/types/map';

interface MapViewProps {
  editMode?: boolean;
  showBackgroundMap?: boolean;
  showPaths?: boolean;
  isGeneratingMap?: boolean;
  isFullscreen?: boolean;
  showLabels?: boolean;
  onPolygonCreated?: (id: string | null) => void;
  isEditingNodes?: boolean;
}

export default function MapView({ 
  editMode = false, 
  showBackgroundMap = true,
  showPaths = true,
  isGeneratingMap = false,
  isFullscreen = true,
  showLabels = true,
  onPolygonCreated,
  isEditingNodes = false
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
  const [polygons, setPolygons] = useState<Polygon[]>([
    {
      id: "poly1",
      name: "Loading Zone A",
      points: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
      ],
      color: "rgba(59, 130, 246, 0.3)"
    },
    {
      id: "poly2",
      name: "Storage Area B",
      points: [
        { x: 300, y: 150 },
        { x: 400, y: 150 },
        { x: 400, y: 250 },
        { x: 300, y: 250 }
      ],
      color: "rgba(236, 72, 153, 0.3)"
    }
  ]);
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [currentPolygonPoints, setCurrentPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [showPolygonNameDialog, setShowPolygonNameDialog] = useState(false);
  const [newPolygonName, setNewPolygonName] = useState("");
  const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null);
  const [editingPolygon, setEditingPolygon] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
    if (editMode || isEditingNodes) {
      setIsDrawingPolygon(true);
    } else {
      setIsDrawingPolygon(false);
      setCurrentPolygonPoints([]);
    }
  }, [editMode, isEditingNodes]);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const { data, error } = await supabase
          .from('AMR')
          .select('*');
          
        if (error) {
          console.error('Error fetching robots:', error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('Robots loaded from Supabase:', data);
          // Update UI with robot data if needed
        } else {
          console.log('No robots found in database, using mock data');
        }
      } catch (error) {
        console.error('Error in fetchRobots:', error);
      }
    };
    
    fetchRobots();
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

  useEffect(() => {
    if (isGeneratingMap && mapGenerationProgress < 100) {
      const interval = setInterval(() => {
        setMapGenerationProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 5) + 1;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isGeneratingMap, mapGenerationProgress]);

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

  const saveMap = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/map-save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession().then(res => res.data.session?.access_token)}`
        },
        body: JSON.stringify({
          mapData: {
            name: 'warehouse_map',
            timestamp: new Date().toISOString(),
            nodes: [],
            paths: [],
            polygons: polygons
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save map');
      }

      const result = await response.json();
      
      toast({
        title: "Map saved successfully",
        description: `Map ID: ${result.id}`
      });
    } catch (error) {
      console.error('Error saving map:', error);
      toast({
        title: "Error saving map",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  }, [polygons]);

  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!editMode || !isDrawingPolygon) return;
    
    if (!mapContainerRef.current) return;
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / viewScale - viewPosition.x / viewScale;
    const y = (e.clientY - rect.top) / viewScale - viewPosition.y / viewScale;
    
    setCurrentPolygonPoints(prev => [...prev, { x, y }]);
    
    if (currentPolygonPoints.length >= 2) {
      toast({
        title: "Point added",
        description: "Click 'Complete' when finished or add more points",
      });
    }
  }, [editMode, isDrawingPolygon, currentPolygonPoints.length, viewScale, viewPosition]);

  const completePolygon = useCallback(() => {
    if (currentPolygonPoints.length < 3) {
      toast({
        title: "Not enough points",
        description: "A polygon requires at least 3 points",
        variant: "destructive"
      });
      return;
    }
    
    setShowPolygonNameDialog(true);
  }, [currentPolygonPoints]);

  const saveNewPolygon = useCallback(() => {
    if (!newPolygonName) {
      toast({
        title: "Name required",
        description: "Please provide a name for this zone",
        variant: "destructive"
      });
      return;
    }
    
    const newPolygon: Polygon = {
      id: `poly${Date.now()}`,
      name: newPolygonName,
      points: [...currentPolygonPoints],
      color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`
    };
    
    setPolygons(prev => [...prev, newPolygon]);
    setCurrentPolygonPoints([]);
    setNewPolygonName("");
    setShowPolygonNameDialog(false);
    setIsDrawingPolygon(false);
    
    if (onPolygonCreated) {
      onPolygonCreated(newPolygon.id);
    }
    
    toast({
      title: "Zone created",
      description: `"${newPolygonName}" has been added to the map`,
    });
  }, [newPolygonName, currentPolygonPoints, onPolygonCreated]);

  const cancelPolygonCreation = useCallback(() => {
    setCurrentPolygonPoints([]);
    setIsDrawingPolygon(false);
    setShowPolygonNameDialog(false);
    setNewPolygonName("");
    
    if (onPolygonCreated) {
      onPolygonCreated(null);
    }
    
    toast({
      title: "Drawing cancelled",
      description: "Polygon creation has been cancelled",
    });
  }, [onPolygonCreated]);

  const handlePolygonClick = useCallback((polygonId: string) => {
    setSelectedPolygon(polygonId);
  }, []);

  const handleEditPolygon = useCallback(() => {
    if (!selectedPolygon) return;
    setEditingPolygon(selectedPolygon);
    const polygon = polygons.find(p => p.id === selectedPolygon);
    if (polygon) {
      setNewPolygonName(polygon.name);
      setShowPolygonNameDialog(true);
    }
  }, [selectedPolygon, polygons]);

  const updatePolygonName = useCallback(() => {
    if (!editingPolygon || !newPolygonName) return;
    
    setPolygons(prev => prev.map(p => 
      p.id === editingPolygon ? { ...p, name: newPolygonName } : p
    ));
    
    setNewPolygonName("");
    setShowPolygonNameDialog(false);
    setEditingPolygon(null);
    
    toast({
      title: "Zone updated",
      description: `The zone has been renamed to "${newPolygonName}"`,
    });
  }, [editingPolygon, newPolygonName]);

  const handleDeletePolygon = useCallback(() => {
    if (!selectedPolygon) return;
    setShowDeleteDialog(true);
  }, [selectedPolygon]);

  const confirmDeletePolygon = useCallback(() => {
    if (!selectedPolygon) return;
    
    const polygonToDelete = polygons.find(p => p.id === selectedPolygon);
    
    setPolygons(prev => prev.filter(p => p.id !== selectedPolygon));
    setSelectedPolygon(null);
    setShowDeleteDialog(false);
    
    toast({
      title: "Zone deleted",
      description: `"${polygonToDelete?.name}" has been removed from the map`,
    });
  }, [selectedPolygon, polygons]);

  const containerClass = isFullscreen 
    ? "fixed inset-0 p-0 z-10 bg-gray-50" 
    : "glass-card rounded-xl p-5 shadow-sm h-full relative overflow-hidden";

  return (
    <div
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
          editMode || isEditingNodes ? "cursor-crosshair" : isDraggingView ? "cursor-grabbing" : "cursor-grab",
          isFullscreen ? "h-screen w-screen" : "h-[calc(100%-2rem)]"
        )}
        ref={mapContainerRef}
        onMouseDown={!isEditingNodes ? handleViewDragStart : undefined}
        onMouseMove={!isEditingNodes ? handleViewDragMove : undefined}
        onMouseUp={!isEditingNodes ? handleViewDragEnd : undefined}
        onMouseLeave={!isEditingNodes ? handleViewDragEnd : undefined}
        onWheel={!isEditingNodes ? handleWheel : undefined}
        onClick={handleMapClick}
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
              isEditingNodes={isEditingNodes}
            />
            
            {polygons.map(polygon => (
              <div key={polygon.id} 
                onClick={() => handlePolygonClick(polygon.id)}
                className={cn(
                  "absolute top-0 left-0 cursor-pointer transition-all",
                  selectedPolygon === polygon.id ? "ring-2 ring-primary ring-offset-2" : ""
                )}
              >
                <svg 
                  width="800" 
                  height="600" 
                  viewBox="0 0 800 600" 
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  <polygon 
                    points={polygon.points.map(p => `${p.x},${p.y}`).join(' ')} 
                    fill={polygon.color}
                    stroke={selectedPolygon === polygon.id ? "#3b82f6" : "#888"}
                    strokeWidth={selectedPolygon === polygon.id ? "2" : "1"}
                    strokeDasharray={selectedPolygon === polygon.id ? "none" : "none"}
                  />
                </svg>
                
                {showLabels && (
                  <div 
                    className={cn(
                      "absolute px-2 py-1 text-xs font-medium bg-white rounded shadow-sm border",
                      selectedPolygon === polygon.id ? "bg-primary text-white" : "bg-white text-gray-800"
                    )}
                    style={{ 
                      left: polygon.points.reduce((sum, p) => sum + p.x, 0) / polygon.points.length, 
                      top: polygon.points.reduce((sum, p) => sum + p.y, 0) / polygon.points.length,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {polygon.name}
                  </div>
                )}
              </div>
            ))}
            
            {isDrawingPolygon && currentPolygonPoints.length > 0 && (
              <svg 
                width="800" 
                height="600" 
                viewBox="0 0 800 600" 
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <polyline 
                  points={currentPolygonPoints.map(p => `${p.x},${p.y}`).join(' ')} 
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                {currentPolygonPoints.map((point, index) => (
                  <circle 
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#3b82f6"
                  />
                ))}
              </svg>
            )}
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
              <div
                key={position.robotId}
                className="absolute"
                style={{ 
                  left: `${position.x}px`, 
                  top: `${position.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: hoveredRobot === position.robotId ? 10 : 5
                }}
                onMouseEnter={() => setHoveredRobot(position.robotId)}
                onMouseLeave={() => setHoveredRobot(null)}
              >
                <div 
                  className={cn(
                    "rounded-full flex items-center justify-center relative cursor-pointer",
                    robot.status === 'active' ? "w-8 h-8" : "w-7 h-7",
                    robot.status === 'error' ? "bg-red-100" : isGeneratingMap && robot.id === 'robot1' ? "bg-blue-100" : "bg-white"
                  )}
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
                    <div
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
                    </div>
                  )}
                </div>
              </div>
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
      
      {editMode && isDrawingPolygon && currentPolygonPoints.length >= 3 && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-md p-2 flex space-x-2">
          <Button 
            size="sm" 
            className="flex items-center"
            onClick={completePolygon}
          >
            <Check className="mr-2 h-4 w-4" />
            Complete Zone
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center"
            onClick={cancelPolygonCreation}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      )}
      
      {selectedPolygon && !editMode && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white rounded-md shadow-md p-2 flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center"
            onClick={handleEditPolygon}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center"
            onClick={handleDeletePolygon}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
      
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
        <div className="flex items-center mt-2">
          <div className="w-6 h-3 bg-blue-200 opacity-70 mr-2"></div>
          <span>Zone</span>
        </div>
      </div>
      
      {showBackgroundMap && mapLoaded && !isGeneratingMap && (
        <div className="absolute bottom-5 left-5 bg-white rounded-md shadow-sm px-3 py-2 text-xs border border-gray-100">
          <div className="font-medium mb-1">Map Legend</div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-gray-800 opacity-20 mr-2"></div>
            <span>Walls/Obstacles</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-blue-500 opacity-40 mr-2"></div>
            <span>Navigation Area</span>
          </div>
        </div>
      )}

      {/* Dialog for polygon name */}
      <Dialog open={showPolygonNameDialog} onOpenChange={(open) => !open && setShowPolygonNameDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPolygon ? "Edit Zone Name" : "New Zone"}</DialogTitle>
            <DialogDescription>
              {editingPolygon ? "Update the name for this zone" : "Give this zone a descriptive name"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div
