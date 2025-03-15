
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, HardHat, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Robot } from '@/utils/mockData';

interface AddRobotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRobot: (robot: Omit<Robot, 'id'>) => void;
}

export default function AddRobotDialog({ open, onOpenChange, onAddRobot }: AddRobotDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    model: 'AMR-100',
    ipAddress: '192.168.1.',
    location: 'Warehouse Zone A',
    batteryLevel: 100,
    image: 'https://images.unsplash.com/photo-1581092921461-7765b507d9e4?auto=format&fit=crop&q=80&w=300&h=300'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ipAddress) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to add robot
    setTimeout(() => {
      const newRobot = {
        ...formData,
        status: 'idle' as const,
        lastActive: new Date().toISOString()
      };
      
      onAddRobot(newRobot);
      
      toast({
        title: "Robot added successfully",
        description: `${formData.name} has been added to your fleet`
      });
      
      // Reset form and close dialog
      setFormData({
        name: '',
        model: 'AMR-100',
        ipAddress: '192.168.1.',
        location: 'Warehouse Zone A',
        batteryLevel: 100,
        image: 'https://images.unsplash.com/photo-1581092921461-7765b507d9e4?auto=format&fit=crop&q=80&w=300&h=300'
      });
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-slate-50 to-white border-slate-200">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-slate-800">
            <HardHat className="mr-2 text-primary" size={20} />
            Add New Robot
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new robot to add to your fleet.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Robot Name *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Scout-07" 
                value={formData.name}
                onChange={handleInputChange}
                className="border-slate-300 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model" className="text-slate-700">Model</Label>
              <Select 
                value={formData.model} 
                onValueChange={(value) => handleSelectChange('model', value)}
              >
                <SelectTrigger id="model" className="border-slate-300">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMR-100">AMR-100</SelectItem>
                  <SelectItem value="AMR-200">AMR-200</SelectItem>
                  <SelectItem value="AMR-300">AMR-300</SelectItem>
                  <SelectItem value="AMR-400">AMR-400</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipAddress" className="text-slate-700">IP Address *</Label>
              <Input 
                id="ipAddress" 
                name="ipAddress" 
                placeholder="e.g. 192.168.1.107" 
                value={formData.ipAddress}
                onChange={handleInputChange}
                className="border-slate-300 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-700">Initial Location</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => handleSelectChange('location', value)}
              >
                <SelectTrigger id="location" className="border-slate-300">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warehouse Zone A">Warehouse Zone A</SelectItem>
                  <SelectItem value="Warehouse Zone B">Warehouse Zone B</SelectItem>
                  <SelectItem value="Warehouse Zone C">Warehouse Zone C</SelectItem>
                  <SelectItem value="Charging Station 1">Charging Station 1</SelectItem>
                  <SelectItem value="Charging Station 2">Charging Station 2</SelectItem>
                  <SelectItem value="Maintenance Bay">Maintenance Bay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              <X size={16} className="mr-1.5" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="mr-1.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1.5" />
                  Add Robot
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
