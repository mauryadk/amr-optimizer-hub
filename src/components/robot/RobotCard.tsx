
import { useState } from 'react';
import { Robot, getStatusColor, timeElapsed } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  BatteryMedium, 
  BatteryFull, 
  BatteryLow, 
  MapPin, 
  Clock, 
  Info, 
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';

interface RobotCardProps {
  robot: Robot;
  index: number;
}

export default function RobotCard({ robot, index }: RobotCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine battery icon based on level
  const BatteryIcon = robot.batteryLevel > 70 
    ? BatteryFull 
    : robot.batteryLevel > 30 
      ? BatteryMedium 
      : BatteryLow;
  
  // Determine battery color
  const getBatteryColor = () => {
    if (robot.batteryLevel > 60) return 'text-green-500';
    if (robot.batteryLevel > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md",
        expanded ? "shadow-md" : "shadow-sm"
      )}
    >
      <div className="flex justify-between items-start p-4">
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
            <img
              className={cn("h-full w-full object-cover transition-all", !imageLoaded && "blur-load")}
              src={robot.image}
              alt={robot.name}
              onLoad={() => setImageLoaded(true)}
            />
            <div className={cn(
              "absolute bottom-0 left-0 right-0 h-1.5",
              getStatusColor(robot.status)
            )} />
          </div>
          
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{robot.name}</h3>
              <div className={cn(
                "ml-2 w-2 h-2 rounded-full",
                getStatusColor(robot.status)
              )} />
            </div>
            <p className="text-sm text-gray-500">{robot.model}</p>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin size={14} className="mr-1" />
              <span>{robot.location}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreHorizontal size={20} className="text-gray-500" />
        </button>
      </div>
      
      <div className="px-4 pb-1 flex justify-between items-center">
        <div className="flex items-center">
          <BatteryIcon size={16} className={cn("mr-1", getBatteryColor())} />
          <span className={cn("text-sm font-medium", getBatteryColor())}>
            {robot.batteryLevel}%
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>{timeElapsed(robot.lastActive)}</span>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 pb-4 pt-2 border-t border-gray-100 mt-2"
        >
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-sm">
              <span className="text-gray-500">Status</span>
              <div className="flex items-center mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full mr-1",
                  getStatusColor(robot.status)
                )} />
                <span className="capitalize">{robot.status}</span>
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-gray-500">IP Address</span>
              <div className="mt-1">{robot.ipAddress}</div>
            </div>
          </div>
          
          {robot.currentTask && (
            <div className="bg-blue-50 p-2 rounded-md text-sm mb-3">
              <div className="flex items-start">
                <Info size={14} className="text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                <div>
                  <span className="text-blue-700 font-medium">Current Task</span>
                  <p className="text-blue-600 mt-0.5">{robot.currentTask}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 mt-2">
            {robot.status === 'active' ? (
              <button className="btn-outline flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                <Pause size={14} className="mr-1.5" />
                Pause
              </button>
            ) : robot.status !== 'error' && robot.status !== 'maintenance' ? (
              <button className="btn-outline flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                <Play size={14} className="mr-1.5" />
                Activate
              </button>
            ) : null}
            
            <button className="btn-outline flex items-center justify-center px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} className="mr-1.5" />
              Refresh
            </button>
            
            {robot.status === 'error' && (
              <button className="flex items-center justify-center px-3 py-1.5 rounded-md border border-red-300 bg-red-50 text-red-700 text-sm hover:bg-red-100 transition-colors">
                <AlertCircle size={14} className="mr-1.5" />
                Resolve Error
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
