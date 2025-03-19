
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Play, Pause, PowerOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { useVDA5050 } from '@/hooks/use-vda5050';
import { toast } from '@/hooks/use-toast';

const EmergencyStopPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeRobotId, setActiveRobotId] = useState<string | null>(null);
  
  const {
    pauseRobot,
    resumeRobot,
    emergencyStop
  } = useVDA5050();

  const handleEmergencyStop = (robotId?: string) => {
    if (robotId) {
      emergencyStop(robotId);
      toast({
        title: "Emergency Stop Activated",
        description: `Robot ${robotId} has been emergency stopped`,
        variant: "destructive"
      });
    } else {
      // Stop all robots
      ['robot1', 'robot2', 'robot3', 'robot4'].forEach(id => {
        emergencyStop(id);
      });
      toast({
        title: "Emergency Stop Activated",
        description: "All robots have been emergency stopped",
        variant: "destructive"
      });
    }
  };

  const handlePauseResume = (robotId?: string) => {
    if (isPaused) {
      if (robotId) {
        resumeRobot(robotId);
      } else {
        ['robot1', 'robot2', 'robot3', 'robot4'].forEach(id => {
          resumeRobot(id);
        });
      }
      toast({
        title: "Robots Resumed",
        description: robotId ? `Robot ${robotId} has resumed operation` : "All robots have resumed operation",
      });
    } else {
      if (robotId) {
        pauseRobot(robotId);
      } else {
        ['robot1', 'robot2', 'robot3', 'robot4'].forEach(id => {
          pauseRobot(id);
        });
      }
      toast({
        title: "Robots Paused",
        description: robotId ? `Robot ${robotId} has been paused` : "All robots have been paused",
      });
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="bg-white rounded-lg shadow-lg p-4 mb-2 border border-red-200"
          >
            <div className="flex flex-col space-y-3">
              <h3 className="font-medium text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                Emergency Controls
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleEmergencyStop()}
                >
                  <PowerOff className="mr-1 h-4 w-4" />
                  Stop All
                </Button>
                
                <Button 
                  variant={isPaused ? "default" : "outline"} 
                  size="sm" 
                  className="w-full"
                  onClick={() => handlePauseResume()}
                >
                  {isPaused ? (
                    <><Play className="mr-1 h-4 w-4" /> Resume All</>
                  ) : (
                    <><Pause className="mr-1 h-4 w-4" /> Pause All</>
                  )}
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Select robot for individual control:
              </div>
              
              <div className="flex flex-wrap gap-2">
                {['robot1', 'robot2', 'robot3', 'robot4'].map(robotId => (
                  <HoverCard key={robotId}>
                    <HoverCardTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs px-2 py-1 h-auto ${activeRobotId === robotId ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={() => setActiveRobotId(robotId === activeRobotId ? null : robotId)}
                      >
                        {robotId}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-48">
                      <div className="text-sm font-medium">Robot Controls</div>
                      <div className="flex mt-2 space-x-2">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => handleEmergencyStop(robotId)}
                        >
                          Stop
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={() => handlePauseResume(robotId)}
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2" 
              onClick={() => setIsExpanded(false)}
            >
              ×
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-center p-3 rounded-full shadow-lg ${
          isExpanded ? 'bg-white border border-red-300' : 'bg-red-500 text-white'
        }`}
      >
        <AlertTriangle className={`h-6 w-6 ${isExpanded ? 'text-red-500' : 'text-white'}`} />
      </motion.button>
    </div>
  );
};

export default EmergencyStopPanel;
