
import { useState, useEffect } from 'react';
import { locations, robotPositions, robots, getStatusColor } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  BatteryMedium, 
  Zap, 
  Package, 
  Truck,
  BoxSelect,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MapView() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [hoveredRobot, setHoveredRobot] = useState<string | null>(null);
  
  // Simulated movement for active robots
  const [animatedPositions, setAnimatedPositions] = useState(robotPositions);
  
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

  // Get icon based on location type
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'charging':
        return <Zap size={16} className="text-yellow-500" />;
      case 'pickup':
        return <Package size={16} className="text-blue-500" />;
      case 'delivery':
        return <BoxSelect size={16} className="text-indigo-500" />;
      case 'storage':
        return <Package size={16} className="text-gray-500" />;
      default:
        return <MapPin size={16} className="text-red-500" />;
    }
  };

  // Find robot details
  const findRobot = (id: string) => robots.find(r => r.id === id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-5 shadow-sm h-full relative overflow-hidden"
    >
      <h2 className="text-lg font-semibold mb-4">Warehouse Map</h2>

      <div className="relative h-[calc(100%-2rem)] bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
        {/* Map markers for locations */}
        {locations.map(location => (
          <motion.div
            key={location.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={cn(
              "absolute rounded-full p-1.5 border-2 cursor-pointer transition-all duration-200",
              selectedLocation === location.id 
                ? "bg-white border-primary shadow-md" 
                : "bg-white/80 border-gray-300 hover:border-primary/70"
            )}
            style={{ 
              left: `${location.x}px`, 
              top: `${location.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setSelectedLocation(location.id)}
          >
            {getLocationIcon(location.type)}
            
            {selectedLocation === location.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white rounded shadow-sm text-xs whitespace-nowrap"
              >
                {location.name}
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {/* Robot markers */}
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
                
                {robot.status === 'charging' && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 opacity-50"
                  />
                )}
                
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
      
      <div className="absolute bottom-5 right-5 bg-white rounded-md shadow-sm px-3 py-2 text-xs border border-gray-100">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Active Robot</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
          <span>Charging Robot</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Error State</span>
        </div>
      </div>
    </motion.div>
  );
}
