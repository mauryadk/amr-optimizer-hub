
import { useState, useEffect } from 'react';
import { 
  Pause, 
  Play, 
  AlertTriangle, 
  Power, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  StopCircle,
  Zap,
  RotateCw,
  Activity,
  Cpu,
  Navigation
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
  const [advancedMode, setAdvancedMode] = useState(false);
  const [diagnosticsData, setDiagnosticsData] = useState<any>(null);
  const [commandHistory, setCommandHistory] = useState<{command: string, timestamp: string}[]>([]);
  const [connectionStrength, setConnectionStrength] = useState(85);
  const { pauseRobot, resumeRobot, emergencyStop } = useVDA5050();

  // Simulate connection strength fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 6) - 2; // -2 to +3
      setConnectionStrength(prev => Math.min(Math.max(prev + variation, 60), 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Control robot using VDA5050
  const controlRobot = (action: string) => {
    setLoading(action);
    
    // Add to command history
    setCommandHistory(prev => [
      { command: action, timestamp: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9) // Keep only last 10 commands
    ]);
    
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
          case 'restart':
            runDiagnostics('system');
            break;
          case 'calibrate':
            runDiagnostics('sensors');
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

  // Run robot diagnostics
  const runDiagnostics = (type: string) => {
    setDiagnosticsData({ status: 'running', type, progress: 0 });
    
    // Simulate diagnostics progress
    const interval = setInterval(() => {
      setDiagnosticsData(prev => {
        if (!prev) return null;
        
        const newProgress = prev.progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate simulated results
          return {
            status: 'complete',
            type,
            progress: 100,
            results: {
              cpu: 'Normal',
              memory: 'Normal',
              storage: 'Normal',
              network: type === 'network' ? 'Degraded' : 'Normal',
              sensors: type === 'sensors' ? 'Calibrated' : 'Normal',
              motors: 'Normal'
            }
          };
        }
        
        return { ...prev, progress: newProgress };
      });
    }, 400);
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
        <div className="flex items-center">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 mr-2">
            Connection: {connectionStrength}%
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
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
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">Basic Controls</span>
              <button 
                className="text-xs text-primary flex items-center"
                onClick={() => setAdvancedMode(!advancedMode)}
              >
                {advancedMode ? 'Hide Advanced' : 'Show Advanced'}
                {advancedMode ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
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
            
            <AnimatePresence>
              {advancedMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="border-t border-gray-100 pt-3 mb-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Cpu size={14} className="mr-1.5 text-primary" />
                      Advanced Controls
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button 
                        onClick={() => controlRobot('restart')}
                        disabled={loading !== null}
                        className="flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors text-xs"
                      >
                        {loading === 'restart' ? (
                          <RefreshCw size={12} className="mr-1.5 animate-spin" />
                        ) : (
                          <RotateCw size={12} className="mr-1.5" />
                        )}
                        Restart Systems
                      </button>
                      
                      <button 
                        onClick={() => controlRobot('calibrate')}
                        disabled={loading !== null}
                        className="flex items-center justify-center px-3 py-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 transition-colors text-xs"
                      >
                        {loading === 'calibrate' ? (
                          <RefreshCw size={12} className="mr-1.5 animate-spin" />
                        ) : (
                          <Activity size={12} className="mr-1.5" />
                        )}
                        Calibrate Sensors
                      </button>
                      
                      <button 
                        onClick={() => runDiagnostics('system')}
                        disabled={loading !== null || diagnosticsData?.status === 'running'}
                        className="flex items-center justify-center px-3 py-1.5 rounded-md bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100 transition-colors text-xs"
                      >
                        <Cpu size={12} className="mr-1.5" />
                        System Diagnostics
                      </button>
                      
                      <button 
                        onClick={() => runDiagnostics('network')}
                        disabled={loading !== null || diagnosticsData?.status === 'running'}
                        className="flex items-center justify-center px-3 py-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors text-xs"
                      >
                        <Navigation size={12} className="mr-1.5" />
                        Network Test
                      </button>
                    </div>
                    
                    {diagnosticsData && (
                      <div className="bg-gray-50 p-3 rounded-md mb-3 border border-gray-200 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">
                            {diagnosticsData.type.charAt(0).toUpperCase() + diagnosticsData.type.slice(1)} Diagnostics
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {diagnosticsData.status === 'running' ? 'Running' : 'Complete'}
                          </span>
                        </div>
                        
                        {diagnosticsData.status === 'running' ? (
                          <>
                            <Progress 
                              value={diagnosticsData.progress} 
                              className="h-2 mt-2" 
                              indicatorClassName="bg-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {diagnosticsData.progress}% complete
                            </p>
                          </>
                        ) : (
                          <div className="mt-2 text-xs">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              {Object.entries(diagnosticsData.results).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-600 capitalize">{key}:</span>
                                  <span className={`font-medium ${
                                    value === 'Normal' || value === 'Calibrated' 
                                      ? 'text-green-600' 
                                      : value === 'Degraded' 
                                      ? 'text-yellow-600' 
                                      : 'text-red-600'
                                  }`}>
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <h5 className="text-xs font-medium mb-1 text-gray-700">Command History</h5>
                      <div className="bg-gray-900 text-gray-200 p-2 rounded-md text-xs font-mono h-24 overflow-y-auto">
                        {commandHistory.length > 0 ? (
                          commandHistory.map((cmd, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              <span className="text-gray-500">{cmd.timestamp}</span>
                              <span className="text-green-400 mx-1">$</span>
                              <span>{cmd.command}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No commands executed yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
