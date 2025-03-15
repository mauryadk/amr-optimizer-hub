
import { useState } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
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
      <DialogHeader>
        <DialogTitle>Distribute Map</DialogTitle>
        <DialogDescription>
          Select robots to distribute the current map to. This will update their navigation data.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Available Robots</span>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deselectAll}
              className="text-xs"
            >
              Deselect All
            </Button>
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2">
          {robots.map(robot => (
            <div 
              key={robot.id}
              className={`flex items-center justify-between p-3 rounded-md mb-2 border cursor-pointer ${
                selectedRobots.includes(robot.id) 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
              onClick={() => toggleRobotSelection(robot.id)}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  robot.status === 'active' 
                    ? 'bg-green-500' 
                    : robot.status === 'charging' 
                    ? 'bg-yellow-400' 
                    : 'bg-red-500'
                }`} />
                <div>
                  <div className="font-medium">{robot.name}</div>
                  <div className="text-xs text-gray-500">
                    {robot.status === 'active' 
                      ? 'Online - Ready for updates' 
                      : robot.status === 'charging' 
                      ? 'Charging - Can receive updates' 
                      : 'Error - Updates may fail'}
                  </div>
                </div>
              </div>
              <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                selectedRobots.includes(robot.id) 
                  ? 'bg-primary text-white' 
                  : 'border border-gray-300'
              }`}>
                {selectedRobots.includes(robot.id) && <Check size={12} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          <X size={16} className="mr-1.5" />
          Cancel
        </Button>
        <Button onClick={handleDistribute} disabled={isDistributing}>
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
