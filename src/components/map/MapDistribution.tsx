
import { useState } from 'react';
import { Check, X, RefreshCw, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { robots } from '@/utils/mockData';

interface MapDistributionProps {
  onClose: () => void;
}

export default function MapDistribution({ onClose }: MapDistributionProps) {
  const [selectedRobots, setSelectedRobots] = useState<string[]>([]);
  const [isDistributing, setIsDistributing] = useState(false);
  const { toast } = useToast();

  const toggleRobotSelection = (robotId: string) => {
    setSelectedRobots(prev => 
      prev.includes(robotId) 
        ? prev.filter(id => id !== robotId)
        : [...prev, robotId]
    );
  };

  const selectAll = () => {
    setSelectedRobots(robots.map(robot => robot.id));
  };

  const deselectAll = () => {
    setSelectedRobots([]);
  };

  const handleDistribute = () => {
    if (selectedRobots.length === 0) {
      toast({
        title: "No robots selected",
        description: "Please select at least one robot to distribute the map to.",
        variant: "destructive"
      });
      return;
    }

    setIsDistributing(true);
    
    // Simulate distribution process
    setTimeout(() => {
      setIsDistributing(false);
      toast({
        title: "Map distributed successfully",
        description: `Map has been distributed to ${selectedRobots.length} robot(s).`
      });
      onClose();
    }, 2000);
  };

  return (
    <>
      <DialogHeader className="bg-gradient-to-r from-slate-800 to-slate-700 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg text-white">
        <div className="flex items-center">
          <HardHat className="mr-2 text-slate-300" size={20} />
          <DialogTitle className="text-white">Distribute Map</DialogTitle>
        </div>
        <DialogDescription className="text-slate-300">
          Select robots to distribute the current map to. This will update their navigation data.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Available Robots</span>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="text-xs border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deselectAll}
              className="text-xs border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              Deselect All
            </Button>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {robots.map(robot => (
            <div 
              key={robot.id}
              className={`flex items-center justify-between p-3 rounded-md mb-2 border cursor-pointer transition-all ${
                selectedRobots.includes(robot.id) 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-sm' 
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
              onClick={() => toggleRobotSelection(robot.id)}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  robot.status === 'active' 
                    ? 'bg-green-500' 
                    : robot.status === 'charging' 
                    ? 'bg-yellow-400' 
                    : robot.status === 'idle'
                    ? 'bg-blue-400'
                    : robot.status === 'maintenance'
                    ? 'bg-purple-500'
                    : 'bg-red-500'
                }`} />
                <div>
                  <div className="font-medium text-slate-800">{robot.name}</div>
                  <div className="text-xs text-slate-500">
                    {robot.status === 'active' 
                      ? 'Online - Ready for updates' 
                      : robot.status === 'charging' 
                      ? 'Charging - Can receive updates' 
                      : robot.status === 'idle'
                      ? 'Idle - Ready for updates'
                      : robot.status === 'maintenance'
                      ? 'Maintenance - Updates delayed'
                      : 'Error - Updates may fail'}
                  </div>
                </div>
              </div>
              <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                selectedRobots.includes(robot.id) 
                  ? 'bg-primary text-white' 
                  : 'border border-slate-300 bg-slate-50'
              }`}>
                {selectedRobots.includes(robot.id) && <Check size={12} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="border-t border-slate-200 pt-4 mt-2">
        <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-100">
          <X size={16} className="mr-1.5" />
          Cancel
        </Button>
        <Button onClick={handleDistribute} disabled={isDistributing} className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white">
          {isDistributing ? (
            <>
              <RefreshCw size={16} className="mr-1.5 animate-spin" />
              Distributing...
            </>
          ) : (
            <>
              <Check size={16} className="mr-1.5" />
              Distribute Map
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
