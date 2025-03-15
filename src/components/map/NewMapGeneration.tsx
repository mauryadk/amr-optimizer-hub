
import { useState } from 'react';
import { Play, Square, Check, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { robots } from '@/utils/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewMapGenerationProps {
  onClose: () => void;
  onStartGeneration: () => void;
  onStopGeneration: () => void;
}

export default function NewMapGeneration({ 
  onClose, 
  onStartGeneration, 
  onStopGeneration 
}: NewMapGenerationProps) {
  const [selectedRobot, setSelectedRobot] = useState<string>('');
  const [mapName, setMapName] = useState<string>('');
  const [resolution, setResolution] = useState<string>('0.05');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const activeRobots = robots.filter(robot => robot.status === 'active');

  const handleStartGeneration = () => {
    if (!selectedRobot) {
      toast({
        title: "No robot selected",
        description: "Please select a robot to generate the map.",
        variant: "destructive"
      });
      return;
    }

    if (!mapName.trim()) {
      toast({
        title: "No map name provided",
        description: "Please enter a name for the new map.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    onStartGeneration();
    
    // Simulate map generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const handleStopGeneration = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
    onStopGeneration();
    toast({
      title: "Map generation stopped",
      description: "The map generation process has been cancelled."
    });
  };

  const handleSaveMap = () => {
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setIsGenerating(false);
      setGenerationProgress(0);
      onStopGeneration();
      toast({
        title: "Map saved successfully",
        description: `Map "${mapName}" has been saved and is ready for distribution.`
      });
      onClose();
    }, 1500);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>New Map Generation</DialogTitle>
        <DialogDescription>
          Select a robot to start mapping a new area. The robot will explore and build a map in real-time.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        {!isGenerating ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="mapName">Map Name</Label>
              <Input 
                id="mapName" 
                value={mapName} 
                onChange={e => setMapName(e.target.value)} 
                placeholder="e.g., Warehouse Floor 1" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="robotSelect">Select Robot</Label>
              <Select value={selectedRobot} onValueChange={setSelectedRobot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a robot for mapping" />
                </SelectTrigger>
                <SelectContent>
                  {activeRobots.length > 0 ? (
                    activeRobots.map(robot => (
                      <SelectItem key={robot.id} value={robot.id}>
                        {robot.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No active robots available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {activeRobots.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No active robots available for mapping. Please ensure at least one robot is online.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resolution">Map Resolution (m/pixel)</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue placeholder="Select map resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">High (0.01 m/pixel)</SelectItem>
                  <SelectItem value="0.05">Medium (0.05 m/pixel)</SelectItem>
                  <SelectItem value="0.1">Low (0.1 m/pixel)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Map Generation Progress</Label>
                <span className="text-sm font-medium">{generationProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${generationProgress}%` }} 
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {generationProgress < 100 
                  ? "Robot is exploring and mapping the environment..." 
                  : "Map generation complete! You can now save the map."}
              </p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium mb-1">Map Information</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-gray-500">Name:</div>
                <div>{mapName}</div>
                <div className="text-gray-500">Robot:</div>
                <div>{robots.find(r => r.id === selectedRobot)?.name}</div>
                <div className="text-gray-500">Resolution:</div>
                <div>{resolution} m/pixel</div>
                <div className="text-gray-500">Area covered:</div>
                <div>{Math.floor(generationProgress * 5.2)}m²</div>
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        {!isGenerating ? (
          <>
            <Button variant="outline" onClick={onClose}>
              <X size={16} className="mr-1.5" />
              Cancel
            </Button>
            <Button 
              onClick={handleStartGeneration} 
              disabled={!selectedRobot || !mapName.trim() || activeRobots.length === 0}
            >
              <Play size={16} className="mr-1.5" />
              Start Mapping
            </Button>
          </>
        ) : generationProgress < 100 ? (
          <>
            <Button variant="outline" onClick={onClose}>
              <X size={16} className="mr-1.5" />
              Close
            </Button>
            <Button variant="destructive" onClick={handleStopGeneration}>
              <Square size={16} className="mr-1.5" />
              Stop Mapping
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onClose}>
              <X size={16} className="mr-1.5" />
              Cancel
            </Button>
            <Button onClick={handleSaveMap} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Square size={16} className="mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1.5" />
                  Save Map
                </>
              )}
            </Button>
          </>
        )}
      </DialogFooter>
    </>
  );
}
