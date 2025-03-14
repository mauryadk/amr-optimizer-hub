
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import MapView from '@/components/map/MapView';
import { robots, robotPositions, fleetSummary } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { 
  LocateFixed, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw,
  Truck,
  Battery,
  AlertTriangle
} from 'lucide-react';

export default function Map() {
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
            <h1 className="text-3xl font-bold">Fleet Map</h1>
            <p className="text-gray-500 mt-1">Visualize your robots' positions in real-time</p>
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
              <button className="subtle-glass px-3 py-1.5 rounded-md flex items-center text-sm">
                <Layers size={16} className="mr-1.5" />
                Layers
              </button>
              
              <button className="subtle-glass px-3 py-1.5 rounded-md flex items-center text-sm">
                <LocateFixed size={16} className="mr-1.5" />
                Center
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
          
          {/* Main Map View */}
          <div className="mt-4 h-[calc(100vh-250px)]">
            <MapView />
          </div>
        </div>
      </div>
    </div>
  );
}
