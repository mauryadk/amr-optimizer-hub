
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import MapView from '@/components/map/MapView';
import MapEditor from '@/components/map/MapEditor';
import { robots, fleetSummary } from '@/utils/mockData';
import { 
  LocateFixed, 
  Layers, 
  RefreshCw,
  Truck,
  Battery,
  AlertTriangle,
  Edit,
  Eye,
  Loader2,
  Save,
  Share2,
  Upload,
  Download,
  MapPin,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useVDA5050 } from '@/hooks/use-vda5050';
import { Button } from '@/components/ui/button';
import MapDistribution from '@/components/map/MapDistribution';
import NewMapGeneration from '@/components/map/NewMapGeneration';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function Map() {
  const [editMode, setEditMode] = useState(false);
  const [showBackgroundMap, setShowBackgroundMap] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [showDistributionDialog, setShowDistributionDialog] = useState(false);
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);
  
  const { robotStates, isInitialized } = useVDA5050();
  
  // Add page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    return () => {
      document.body.classList.remove('page-transition');
    };
  }, []);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(err => {
          toast({
            title: "Fullscreen error",
            description: err.message,
            variant: "destructive"
          });
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          toast({
            title: "Exit fullscreen error",
            description: err.message,
            variant: "destructive"
          });
        });
      }
    }
  }, []);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
    toast({
      title: editMode ? "View mode activated" : "Edit mode activated",
      description: editMode 
        ? "You can now navigate the map" 
        : "You can now edit navigation nodes and paths"
    });
  }, [editMode]);

  // Toggle ROS map
  const toggleRosMap = useCallback(() => {
    setShowBackgroundMap(prev => !prev);
    toast({
      title: showBackgroundMap ? "ROS map hidden" : "ROS map visible",
    });
  }, [showBackgroundMap]);

  // Toggle paths
  const togglePaths = useCallback(() => {
    setShowPaths(prev => !prev);
    toast({
      title: showPaths ? "Paths hidden" : "Paths visible",
    });
  }, [showPaths]);

  // Refresh map data
  const refreshMap = useCallback(() => {
    setIsLoading(true);
    // Simulate API call to backend
    fetch('/api/map/refresh')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .catch(error => {
        console.error('Error refreshing map:', error);
        // Fall back to mock data if API fails
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "Map refreshed",
            description: "Latest robot positions and map data loaded"
          });
        }, 1500);
      });
  }, []);

  // Save current map
  const saveMap = useCallback(() => {
    setIsLoading(true);
    // Simulate API call to backend
    fetch('/api/map/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        timestamp: new Date().toISOString(),
        user: 'admin'
      }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .catch(error => {
        console.error('Error saving map:', error);
        // Fall back to mock behavior if API fails
        setTimeout(() => {
          setIsLoading(false);
          toast({
            title: "Map saved",
            description: "Current map has been saved to the database"
          });
        }, 1000);
      });
  }, []);

  if (isFullscreen) {
    return (
      <div 
        ref={fullscreenRef}
        className="h-screen w-screen bg-black relative"
      >
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="bg-white/20 backdrop-blur-sm"
            onClick={toggleFullscreen}
          >
            <Minimize2 size={18} />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="bg-white/20 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        <div className="h-full w-full">
          <MapView 
            editMode={false} 
            showBackgroundMap={showBackgroundMap}
            showPaths={showPaths}
            isGeneratingMap={isGeneratingMap}
            isFullscreen={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        <div className="p-4 max-w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src="https://www.anzocontrols.com/wp-content/uploads/2022/11/Client_logo_anzo-removebg-preview-2.png" 
                  alt="Anzo Controls" 
                  className="h-12 object-contain"
                />
                <div>
                  <h1 className="text-2xl font-bold">Fleet Map</h1>
                  <p className="text-gray-500 text-sm">Visualize and edit robot navigation paths</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={toggleEditMode}
                  variant={editMode ? "default" : "outline"}
                  className="flex items-center"
                >
                  {editMode ? <Eye size={16} className="mr-1.5" /> : <Edit size={16} className="mr-1.5" />}
                  {editMode ? 'View Mode' : 'Edit Mode'}
                </Button>
                
                <Button 
                  onClick={toggleFullscreen}
                  variant="outline"
                  className="flex items-center"
                >
                  <Maximize2 size={16} className="mr-1.5" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Quick Status Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 flex flex-wrap gap-3"
          >
            <div className="subtle-glass px-4 py-2 rounded-md flex items-center">
              <div className="p-1.5 rounded-full bg-primary/10 mr-3">
                <Truck size={16} className="text-primary" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Robots</div>
                <div className="font-semibold">{fleetSummary.activeRobots}</div>
              </div>
            </div>
            
            <div className="subtle-glass px-4 py-2 rounded-md flex items-center">
              <div className="p-1.5 rounded-full bg-yellow-100 mr-3">
                <Battery size={16} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Charging</div>
                <div className="font-semibold">{fleetSummary.chargingRobots}</div>
              </div>
            </div>
            
            <div className="subtle-glass px-4 py-2 rounded-md flex items-center">
              <div className="p-1.5 rounded-full bg-red-100 mr-3">
                <AlertTriangle size={16} className="text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Errors</div>
                <div className="font-semibold">{fleetSummary.errorRobots}</div>
              </div>
            </div>
            
            {/* New Map Generation Status */}
            {isGeneratingMap && (
              <div className="subtle-glass px-4 py-2 rounded-md flex items-center">
                <div className="p-1.5 rounded-full bg-blue-100 mr-3">
                  <MapPin size={16} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Map Generation</div>
                  <div className="font-semibold text-blue-600">In Progress</div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Map Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 flex justify-between items-center"
          >
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={togglePaths}
              >
                <Layers size={16} className="mr-1.5" />
                {showPaths ? 'Hide Paths' : 'Show Paths'}
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={toggleRosMap}
              >
                <LocateFixed size={16} className="mr-1.5" />
                {showBackgroundMap ? 'Hide ROS Map' : 'Show ROS Map'}
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={refreshMap}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw size={16} className="mr-1.5" />
                )}
                Refresh
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={saveMap}
                disabled={isLoading}
              >
                <Save size={16} className="mr-1.5" />
                Save Map
              </Button>
              
              <Dialog open={showDistributionDialog} onOpenChange={setShowDistributionDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Share2 size={16} className="mr-1.5" />
                    Distribute Map
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <MapDistribution onClose={() => setShowDistributionDialog(false)} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={showGenerationDialog} onOpenChange={setShowGenerationDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant={isGeneratingMap ? "default" : "outline"}
                    size="sm"
                    className="flex items-center"
                  >
                    <MapPin size={16} className="mr-1.5" />
                    New Map Generation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <NewMapGeneration 
                    onClose={() => setShowGenerationDialog(false)}
                    onStartGeneration={() => {
                      setIsGeneratingMap(true);
                      setShowGenerationDialog(false);
                    }}
                    onStopGeneration={() => setIsGeneratingMap(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Upload size={16} className="mr-1.5" />
                Import
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Download size={16} className="mr-1.5" />
                Export
              </Button>
            </div>
          </motion.div>
          
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-3"
            >
              <MapEditor />
            </motion.div>
          )}
          
          {/* Main Map View */}
          <div 
            ref={fullscreenRef} 
            className="mt-3 h-[calc(100vh-220px)]"
          >
            <MapView 
              editMode={editMode} 
              showBackgroundMap={showBackgroundMap}
              showPaths={showPaths}
              isGeneratingMap={isGeneratingMap}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
