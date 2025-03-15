
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import MapView from '@/components/map/MapView';
import MapEditor from '@/components/map/MapEditor';
import { robots, fleetSummary } from '@/utils/mockData';
import { 
  LocateFixed, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw,
  Truck,
  Battery,
  AlertTriangle,
  Edit,
  Eye
} from 'lucide-react';

export default function Map() {
  const [editMode, setEditMode] = useState(false);
  const [showBackgroundMap, setShowBackgroundMap] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  
  // Add page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    return () => {
      document.body.classList.remove('page-transition');
    };
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
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm ${editMode ? 'bg-primary text-white' : 'subtle-glass'}`}
                >
                  {editMode ? <Eye size={16} className="mr-1.5" /> : <Edit size={16} className="mr-1.5" />}
                  {editMode ? 'View Mode' : 'Edit Mode'}
                </button>
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
              <button 
                className="subtle-glass px-3 py-1.5 rounded-md flex items-center text-sm"
                onClick={() => setShowPaths(!showPaths)}
              >
                <Layers size={16} className="mr-1.5" />
                {showPaths ? 'Hide Paths' : 'Show Paths'}
              </button>
              
              <button 
                className="subtle-glass px-3 py-1.5 rounded-md flex items-center text-sm"
                onClick={() => setShowBackgroundMap(!showBackgroundMap)}
              >
                <LocateFixed size={16} className="mr-1.5" />
                {showBackgroundMap ? 'Hide ROS Map' : 'Show ROS Map'}
              </button>
              
              <button className="subtle-glass px-3 py-1.5 rounded-md flex items-center text-sm">
                <RefreshCw size={16} className="mr-1.5" />
                Refresh
              </button>
            </div>
            
            <div className="flex">
              <button className="subtle-glass px-2 py-1.5 rounded-l-md border-r border-white/20">
                <ZoomIn size={16} />
              </button>
              <button className="subtle-glass px-2 py-1.5 rounded-r-md">
                <ZoomOut size={16} />
              </button>
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
