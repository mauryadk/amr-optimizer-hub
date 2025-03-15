
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  Trash2, 
  CornerUpRight, 
  CornerDownRight,
  PenLine,
  RouteOff,
  ArrowDownUp,
  Navigation
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type EditMode = 'add-node' | 'add-path' | 'delete' | 'move' | 'select';

export default function MapEditor() {
  const [activeEditMode, setActiveEditMode] = useState<EditMode>('select');
  const [isPathOptionsOpen, setIsPathOptionsOpen] = useState(false);
  const { toast } = useToast();

  const handleModeChange = (mode: EditMode) => {
    setActiveEditMode(mode);
    toast({
      title: "Edit mode changed",
      description: `Now in ${mode.replace('-', ' ')} mode`,
    });
  };

  return (
    <div className="glass-card rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-medium">Map Editor</h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          {activeEditMode.replace('-', ' ')} mode
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        <button
          onClick={() => handleModeChange('select')}
          className={`p-2 rounded-md flex flex-col items-center justify-center text-xs ${
            activeEditMode === 'select' ? 'bg-primary/20 text-primary' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <PenLine size={18} className="mb-1" />
          Select
        </button>
        
        <button
          onClick={() => handleModeChange('add-node')}
          className={`p-2 rounded-md flex flex-col items-center justify-center text-xs ${
            activeEditMode === 'add-node' ? 'bg-primary/20 text-primary' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <Plus size={18} className="mb-1" />
          Add Node
        </button>
        
        <button
          onClick={() => handleModeChange('add-path')}
          className={`p-2 rounded-md flex flex-col items-center justify-center text-xs ${
            activeEditMode === 'add-path' ? 'bg-primary/20 text-primary' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <CornerUpRight size={18} className="mb-1" />
          Add Path
        </button>
        
        <button
          onClick={() => handleModeChange('move')}
          className={`p-2 rounded-md flex flex-col items-center justify-center text-xs ${
            activeEditMode === 'move' ? 'bg-primary/20 text-primary' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <ArrowDownUp size={18} className="mb-1" />
          Move
        </button>
        
        <button
          onClick={() => handleModeChange('delete')}
          className={`p-2 rounded-md flex flex-col items-center justify-center text-xs ${
            activeEditMode === 'delete' ? 'bg-primary/20 text-primary' : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <Trash2 size={18} className="mb-1" />
          Delete
        </button>
      </div>

      <Dialog>
        <div className="flex gap-2">
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus size={14} className="mr-1" /> Add Station
            </Button>
          </DialogTrigger>
          
          <Button variant="outline" size="sm" className="w-full" onClick={() => setIsPathOptionsOpen(!isPathOptionsOpen)}>
            {isPathOptionsOpen ? <RouteOff size={14} className="mr-1" /> : <Navigation size={14} className="mr-1" />}
            {isPathOptionsOpen ? 'Hide Path Options' : 'Path Options'}
          </Button>
        </div>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Station</DialogTitle>
            <DialogDescription>
              Create a new station for robots to navigate to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="e.g. Charging Station 1" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <select 
                id="type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3"
              >
                <option value="charging">Charging Station</option>
                <option value="pickup">Pickup Point</option>
                <option value="delivery">Delivery Point</option>
                <option value="storage">Storage</option>
                <option value="junction">Junction</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coordinates" className="text-right">
                Coordinates
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input id="x-coord" placeholder="X" className="w-1/2" />
                <Input id="y-coord" placeholder="Y" className="w-1/2" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Station</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {isPathOptionsOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-3 bg-gray-50 rounded-md"
        >
          <h4 className="text-sm font-medium mb-2">Path Options</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <input type="checkbox" id="bidirectional" className="mr-2" />
              <label htmlFor="bidirectional" className="text-xs">Bidirectional</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="preferred" className="mr-2" />
              <label htmlFor="preferred" className="text-xs">Preferred Path</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="avoid-obstacles" className="mr-2" />
              <label htmlFor="avoid-obstacles" className="text-xs">Avoid Obstacles</label>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="high-speed" className="mr-2" />
              <label htmlFor="high-speed" className="text-xs">High Speed</label>
            </div>
          </div>
          
          <div className="mt-2">
            <label htmlFor="path-cost" className="text-xs block mb-1">Path Cost Factor</label>
            <input type="range" id="path-cost" min="1" max="10" className="w-full" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
