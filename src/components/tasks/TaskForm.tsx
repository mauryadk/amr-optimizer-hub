
import { useState } from 'react';
import { motion } from 'framer-motion';
import { robots } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { 
  CalendarClock, 
  AlignLeft, 
  Truck, 
  Map as MapIcon, 
  AlertTriangle,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [robotId, setRobotId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('tasks', {
        body: {
          title,
          description,
          priority,
          robotId: robotId || undefined,
          startLocation: location || undefined,
          endLocation: location || undefined
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Task created",
        description: "New task has been created successfully"
      });
      
      // Reset form and close
      setTitle('');
      setDescription('');
      setLocation('');
      setPriority('medium');
      setRobotId('');
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Only show active or idle robots as available
  const availableRobots = robots.filter(r => ['active', 'idle'].includes(r.status));
  
  return (
    <>
      {!isFormOpen ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="glass-card rounded-xl p-5 shadow-sm h-full flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <CalendarClock size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium font-sans">Create New Task</h3>
          <p className="text-sm text-gray-500 mt-1">Assign tasks to your robots</p>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-card rounded-xl p-5 shadow-sm h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold font-sans">New Task Assignment</h3>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <div className="relative">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 pl-10"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CalendarClock size={18} />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed task description"
                    rows={3}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 pl-10"
                  />
                  <div className="absolute left-3 top-4 text-gray-400">
                    <AlignLeft size={18} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="robot" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Robot
                  </label>
                  <div className="relative">
                    <select
                      id="robot"
                      value={robotId}
                      onChange={(e) => setRobotId(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 pl-10 appearance-none"
                    >
                      <option value="">Unassigned</option>
                      {availableRobots.map(robot => (
                        <option key={robot.id} value={robot.id}>
                          {robot.name} ({robot.status})
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Truck size={18} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Task location"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MapIcon size={18} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className="flex items-center space-x-2">
                  {['low', 'medium', 'high', 'critical'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        priority === p ? 
                          p === 'low' ? 'bg-blue-100 text-blue-800' :
                          p === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          p === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {p === 'critical' && <AlertTriangle size={14} className="inline mr-1" />}
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </>
  );
}
