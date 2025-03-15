
import { useEffect, useState, useCallback } from 'react';
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
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useVDA5050 } from '@/hooks/use-vda5050';
import { Button } from '@/components/ui/button';

export default function Map() {
  const [editMode, setEditMode] = useState(false);
  const [showBackgroundMap, setShowBackgroundMap] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { robotStates, isInitialized } = useVDA5050();
  
  // Add page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    return () => {
      document.body.classList.remove('page-transition');
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
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Map refreshed",
        description: "Latest robot positions and map data loaded"
      });
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Fleet Map</h1>
                <p className="text-gray-500 mt-1">Visualize and edit robot navigation paths</p>
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
              </div>
            </div>
          </motion.div>
          
          {/* Quick Status Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 flex flex-wrap gap-4"
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
          </motion.div>
          
          {/* Map Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 flex justify-between items-center"
          >
            <div className="flex gap-2">
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
            </div>
          </motion.div>
          
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <MapEditor />
            </motion.div>
          )}
          
          {/* Main Map View */}
          <div className="mt-4 h-[calc(100vh-250px)]">
            <MapView 
              editMode={editMode} 
              showBackgroundMap={showBackgroundMap}
              showPaths={showPaths}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
