
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import StatusCard from '@/components/dashboard/StatusCard';
import FleetOverview from '@/components/dashboard/FleetOverview';
import RobotCard from '@/components/robot/RobotCard';
import DatabaseStatus from '@/components/settings/DatabaseStatus';
import { 
  robots, 
  tasks, 
  fleetSummary,
  formatDate
} from '@/utils/mockData';
import { 
  Truck, 
  Battery, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  LayoutGrid,
  Clock,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Index() {
  // Active robots to display in quick view
  const activeRobots = robots.slice(0, 3);
  
  // Recent tasks
  const recentTasks = tasks.slice(0, 4);
  
  // Add page transition effect
  useEffect(() => {
    document.body.classList.add('page-transition');
    return () => {
      document.body.classList.remove('page-transition');
    };
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor and manage your autonomous mobile robots</p>
      </motion.div>
      
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <StatusCard 
          title="Total Robots" 
          value={fleetSummary.totalRobots} 
          icon={<Truck size={20} />}
          delay={0}
        />
        <StatusCard 
          title="Active Robots" 
          value={fleetSummary.activeRobots} 
          icon={<Activity size={20} />}
          delay={1}
        />
        <StatusCard 
          title="Avg. Battery" 
          value={`${fleetSummary.batteryAverage}%`} 
          icon={<Battery size={20} />}
          delay={2}
        />
        <StatusCard 
          title="Charging" 
          value={fleetSummary.chargingRobots} 
          icon={<Zap size={20} />}
          delay={3}
        />
      </div>

      {/* AMR Locations Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card rounded-xl p-3 shadow-sm mt-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold flex items-center">
            <MapPin size={16} className="mr-1.5 text-primary" />
            AMR Locations
          </h3>
          <Link to="/map" className="text-xs text-primary hover:underline flex items-center">
            Full Map <ChevronRight size={14} className="ml-0.5" />
          </Link>
        </div>
        <div className="bg-gray-100 rounded-lg h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30"></div>
          {robots.map((robot) => (
            <div 
              key={robot.id}
              className="absolute w-4 h-4 bg-primary rounded-full shadow-md"
              style={{ 
                left: `${Math.random() * 90 + 5}%`, 
                top: `${Math.random() * 80 + 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-sm whitespace-nowrap">
                {robot.name}: {robot.batteryLevel}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
        {/* Fleet Overview */}
        <div className="lg:col-span-1">
          <FleetOverview robots={robots} />
        </div>
        
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-xl p-3 shadow-sm lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold">Recent Tasks</h3>
            <Link 
              to="/tasks" 
              className="text-xs text-primary flex items-center hover:underline"
            >
              View All <ChevronRight size={14} className="ml-0.5" />
            </Link>
          </div>
          
          <div className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="py-2 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className={cn(
                        "mt-0.5 p-1 rounded-md flex-shrink-0 mr-2",
                        task.status === 'pending' ? 'bg-blue-100' :
                        task.status === 'in-progress' ? 'bg-yellow-100' :
                        task.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                      )}>
                        {task.status === 'pending' ? 
                          <Clock size={14} className="text-blue-600" /> :
                        task.status === 'in-progress' ? 
                          <Activity size={14} className="text-yellow-600" /> :
                        task.status === 'completed' ? 
                          <CheckCircle2 size={14} className="text-green-600" /> :
                          <AlertTriangle size={14} className="text-red-600" />
                        }
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{task.location}</p>
                        <div className="flex items-center mt-1">
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            task.priority === 'low' ? 'bg-blue-100 text-blue-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          )}>
                            {task.priority}
                          </span>
                          
                          {task.assignedTo && (
                            <div className="ml-2 flex items-center text-xs text-gray-500">
                              <Truck size={10} className="mr-1" />
                              {robots.find(r => r.id === task.assignedTo)?.name || 'Unknown'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {formatDate(task.createdAt)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Active Robots */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-base font-semibold"
          >
            Active Robots
          </motion.h2>
          <Link 
            to="/robots"
            className="text-xs flex items-center text-primary hover:underline"
          >
            <LayoutGrid size={14} className="mr-1" />
            View All Robots
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeRobots.map((robot, index) => (
            <RobotCard key={robot.id} robot={robot} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
