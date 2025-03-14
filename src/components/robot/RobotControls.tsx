
import { useState } from 'react';
import { 
  Pause, 
  Play, 
  AlertTriangle, 
  Power, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Robot } from '@/utils/mockData';

interface RobotControlsProps {
  robot: Robot;
}

export default function RobotControls({ robot }: RobotControlsProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Simulate robot control actions
  const controlRobot = (action: string) => {
    setLoading(action);
    
    // This would be replaced with actual API calls
    setTimeout(() => {
      setLoading(null);
      toast({
        title: `Robot ${action} command sent`,
        description: `Command to ${action} ${robot.name} has been processed`,
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium flex items-center">
          <Power size={16} className="mr-2 text-primary" />
          Control Panel
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Battery</span>
                <span className="text-sm font-medium">{robot.batteryLevel}%</span>
              </div>
              <Progress 
                value={robot.batteryLevel} 
                className="h-2" 
                indicatorClassName={cn(
                  robot.batteryLevel > 60 ? "bg-green-500" :
                  robot.batteryLevel > 30 ? "bg-yellow-500" :
                  "bg-red-500"
                )}
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">System Health</span>
                <span className="text-sm font-medium">
                  {robot.status === 'error' ? 'Critical' : robot.status === 'maintenance' ? 'Maintenance Required' : 'Normal'}
                </span>
              </div>
              <Progress 
                value={robot.status === 'error' ? 30 : robot.status === 'maintenance' ? 70 : 95} 
                className="h-2" 
                indicatorClassName={cn(
                  robot.status === 'error' ? "bg-red-500" :
                  robot.status === 'maintenance' ? "bg-yellow-500" :
                  "bg-green-500"
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {robot.status === 'active' ? (
                <button 
                  onClick={() => controlRobot('pause')}
                  disabled={loading !== null}
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {loading === 'pause' ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Pause size={16} className="mr-2" />
                  )}
                  Pause
                </button>
              ) : (
                <button 
                  onClick={() => controlRobot('resume')}
                  disabled={loading !== null || robot.status === 'error' || robot.status === 'maintenance'}
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading === 'resume' ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Play size={16} className="mr-2" />
                  )}
                  Resume
                </button>
              )}
              
              <button 
                onClick={() => controlRobot('emergency_stop')}
                disabled={loading !== null}
                className="flex items-center justify-center px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading === 'emergency_stop' ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <AlertTriangle size={16} className="mr-2" />
                )}
                E-Stop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
