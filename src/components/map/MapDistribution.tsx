
import { useState, useEffect } from 'react';
import { Check, X, RefreshCw, HardHat, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { robots } from '@/utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface MapDistributionProps {
  onClose: () => void;
}

export default function MapDistribution({ onClose }: MapDistributionProps) {
  const [selectedRobots, setSelectedRobots] = useState<string[]>([]);
  const [isDistributing, setIsDistributing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRobots, setFilteredRobots] = useState(robots);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [distributionProgress, setDistributionProgress] = useState<Record<string, number>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();

  // Filter robots based on search query and status filter
  useEffect(() => {
    let filtered = robots;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(robot => 
        robot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        robot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        robot.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(robot => statusFilter.includes(robot.status));
    }
    
    setFilteredRobots(filtered);
  }, [searchQuery, statusFilter]);

  const toggleRobotSelection = (robotId: string) => {
    setSelectedRobots(prev => 
      prev.includes(robotId) 
        ? prev.filter(id => id !== robotId)
        : [...prev, robotId]
    );
  };

  const selectAll = () => {
    setSelectedRobots(filteredRobots.map(robot => robot.id));
  };

  const deselectAll = () => {
    setSelectedRobots([]);
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
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
    
    // Initialize progress for each selected robot
    const initialProgress: Record<string, number> = {};
    selectedRobots.forEach(robotId => {
      initialProgress[robotId] = 0;
    });
    setDistributionProgress(initialProgress);
    setOverallProgress(0);
    
    // Simulate distribution process with progress updates
    const interval = setInterval(() => {
      setDistributionProgress(prev => {
        const newProgress = { ...prev };
        let allComplete = true;
        let totalProgress = 0;
        
        // Update progress for each robot
        selectedRobots.forEach(robotId => {
          if (newProgress[robotId] < 100) {
            // Different robots progress at different speeds
            const speed = Math.random() * 15 + 5;
            newProgress[robotId] = Math.min(100, newProgress[robotId] + speed);
            if (newProgress[robotId] < 100) {
              allComplete = false;
            }
          }
          totalProgress += newProgress[robotId];
        });
        
        // Calculate overall progress
        const overall = totalProgress / selectedRobots.length;
        setOverallProgress(Math.round(overall));
        
        // If all robots are complete, clear interval
        if (allComplete) {
          clearInterval(interval);
          
          // Small delay before closing
          setTimeout(() => {
            setIsDistributing(false);
            toast({
              title: "Map distributed successfully",
              description: `Map has been distributed to ${selectedRobots.length} robot(s).`
            });
            onClose();
          }, 1000);
        }
        
        return newProgress;
      });
    }, 300);
    
    // Cleanup function
    return () => clearInterval(interval);
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
        <div className="flex items-center mb-4">
          <div className="relative flex-1 mr-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search robots..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "border-primary text-primary" : ""}
          >
            <Filter size={18} />
          </Button>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200"
            >
              <h4 className="text-sm font-medium mb-2">Filter by Status</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {['active', 'idle', 'charging', 'maintenance', 'error'].map(status => (
                  <button
                    key={status}
                    className={`px-2 py-1 rounded-md text-xs flex items-center justify-center capitalize ${
                      statusFilter.includes(status)
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-white border border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => toggleStatusFilter(status)}
                  >
                    {statusFilter.includes(status) && <Check size={12} className="mr-1" />}
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Available Robots ({filteredRobots.length})
          </span>
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
          {filteredRobots.length > 0 ? (
            filteredRobots.map(robot => (
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
                <div className="flex items-center">
                  {isDistributing && selectedRobots.includes(robot.id) && (
                    <div className="mr-3 w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300" 
                        style={{ width: `${distributionProgress[robot.id] || 0}%` }} 
                      />
                    </div>
                  )}
                  <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                    selectedRobots.includes(robot.id) 
                      ? 'bg-primary text-white' 
                      : 'border border-slate-300 bg-slate-50'
                  }`}>
                    {selectedRobots.includes(robot.id) && <Check size={12} />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-500">
              <p>No robots match your search criteria.</p>
              <Button 
                variant="link" 
                className="mt-1 h-auto p-0"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter([]);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="border-t border-slate-200 pt-4 mt-2">
        {isDistributing && (
          <div className="w-full mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${overallProgress}%` }} 
              />
            </div>
          </div>
        )}
        
        <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-100">
          <X size={16} className="mr-1.5" />
          Cancel
        </Button>
        <Button 
          onClick={handleDistribute} 
          disabled={isDistributing || selectedRobots.length === 0} 
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white"
        >
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
