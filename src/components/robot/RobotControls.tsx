
import { useState } from 'react';
import { 
  Pause, 
  Play, 
  AlertTriangle, 
  Power, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  StopCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Robot } from '@/utils/mockData';
import { useVDA5050 } from '@/hooks/use-vda5050';

interface RobotControlsProps {
  robot: Robot;
}

export default function RobotControls({ robot }: RobotControlsProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { pauseRobot, resumeRobot, emergencyStop } = useVDA5050();

  // Control robot using VDA5050
  const controlRobot = (action: string) => {
    setLoading(action);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(null);
      
      try {
        // Convert robot ID to VDA5050 format (manufacturer_serialNumber)
        const vdaRobotId = `amr_${robot.id}`;
        
        switch (action) {
          case 'pause':
            pauseRobot(vdaRobotId);
            break;
          case 'resume':
            resumeRobot(vdaRobotId);
            break;
          case 'emergency_stop':
            emergencyStop(vdaRobotId);
            break;
          default:
            break;
        }
        
        toast({
          title: `Robot ${action} command sent`,
          description: `Command to ${action} ${robot.name} has been processed`,
        });
      } catch (error) {
        console.error(`Error sending ${action} command:`, error);
        toast({
          title: `Command failed`,
          description: `Failed to send ${action} command to ${robot.name}`,
          variant: "destructive"
        });
      }
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
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
                <span className="text-sm text-gray-500 flex items-center">
                  <Zap size={14} className="mr-1 text-yellow-500" />
                  Battery
                </span>
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
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:from-yellow-500 hover:to-yellow-600 transition-colors disabled:opacity-50 shadow-sm"
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
                  className="flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 transition-colors disabled:opacity-50 shadow-sm"
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
                className="flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading === 'emergency_stop' ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <StopCircle size={16} className="mr-2" />
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
