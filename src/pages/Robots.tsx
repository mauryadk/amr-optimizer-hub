
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { robots as initialRobots, Robot } from '@/utils/mockData';
import RobotCard from '@/components/robot/RobotCard';
import Sidebar from '@/components/layout/Sidebar';
import { Plus, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddRobotDialog from '@/components/robot/AddRobotDialog';
import { toast } from '@/hooks/use-toast';

export default function Robots() {
  const [robots, setRobots] = useState<Robot[]>(initialRobots);
  const [filteredRobots, setFilteredRobots] = useState<Robot[]>(robots);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addRobotOpen, setAddRobotOpen] = useState(false);
  
  // Add page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    return () => {
      document.body.classList.remove('page-transition');
    };
  }, []);
  
  // Filter robots based on search query and status filter
  useEffect(() => {
    let result = robots;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(robot => 
        robot.name.toLowerCase().includes(query) || 
        robot.model.toLowerCase().includes(query) ||
        robot.location.toLowerCase().includes(query)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(robot => robot.status === statusFilter);
    }
    
    setFilteredRobots(result);
  }, [robots, searchQuery, statusFilter]);
  
  const handleAddRobot = (newRobot: Omit<Robot, 'id'>) => {
    // Generate a new ID
    const newId = (Math.max(...robots.map(r => parseInt(r.id))) + 1).toString().padStart(3, '0');
    
    const robotWithId: Robot = {
      id: newId,
      ...newRobot
    };
    
    setRobots(prev => [...prev, robotWithId]);
    toast({
      title: "Fleet updated",
      description: `${newRobot.name} has been added to your fleet`
    });
  };
  
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status.toLowerCase());
  };

  return (
    <div className="min-h-screen flex bg-gray-50 bg-gradient-to-b from-gray-50 to-white">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Robots</h1>
              <p className="text-gray-500 mt-1">View and manage all robots in your fleet</p>
            </div>
            
            <button 
              onClick={() => setAddRobotOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors shadow-md"
            >
              <Plus size={18} className="mr-1.5" />
              Add Robot
            </button>
          </motion.div>
          
          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search robots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-md border border-gray-300 flex items-center hover:bg-gray-50 transition-colors bg-white shadow-sm">
                <Filter size={18} className="mr-1.5 text-gray-500" />
                Filter
              </button>
              
              <select 
                className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none pr-8 bg-no-repeat bg-[right_12px_center] shadow-sm" 
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundSize: "16px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="idle">Idle</option>
                <option value="charging">Charging</option>
                <option value="maintenance">Maintenance</option>
                <option value="error">Error</option>
              </select>
            </div>
          </motion.div>
          
          {/* Status Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {['All', 'Active', 'Idle', 'Charging', 'Maintenance', 'Error'].map((status, index) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm",
                  statusFilter === status.toLowerCase()
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {status}
              </button>
            ))}
          </motion.div>
          
          {/* Robots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {filteredRobots.length > 0 ? (
              filteredRobots.map((robot, index) => (
                <RobotCard key={robot.id} robot={robot} index={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No robots found matching your filters</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddRobotDialog 
        open={addRobotOpen} 
        onOpenChange={setAddRobotOpen} 
        onAddRobot={handleAddRobot}
      />
    </div>
  );
}
