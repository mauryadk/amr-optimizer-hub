
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import StatusCard from '@/components/dashboard/StatusCard';
import FleetOverview from '@/components/dashboard/FleetOverview';
import RobotCard from '@/components/robot/RobotCard';
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
  ChevronRight
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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      
      <div className="flex-1 overflow-x-hidden">
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
            <p className="text-gray-500 mt-1">Monitor and manage your autonomous mobile robots</p>
          </motion.div>
          
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            <StatusCard 
              title="Total Robots" 
              value={fleetSummary.totalRobots} 
              icon={<Truck size={24} />}
              delay={0}
            />
            <StatusCard 
              title="Active Robots" 
              value={fleetSummary.activeRobots} 
              icon={<Activity size={24} />}
              delay={1}
            />
            <StatusCard 
              title="Avg. Battery" 
              value={`${fleetSummary.batteryAverage}%`} 
              icon={<Battery size={24} />}
              delay={2}
            />
            <StatusCard 
              title="Charging" 
              value={fleetSummary.chargingRobots} 
              icon={<Zap size={24} />}
              delay={3}
            />
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
            {/* Fleet Status Chart */}
            <div className="lg:col-span-1">
              <FleetOverview robots={robots} />
            </div>
            
            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card rounded-xl p-5 shadow-sm lg:col-span-2"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Tasks</h3>
                <Link 
                  to="/tasks" 
                  className="text-sm text-primary flex items-center hover:underline"
                >
                  View All <ChevronRight size={16} />
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
                      className="py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className={cn(
                            "mt-0.5 p-1.5 rounded-md flex-shrink-0 mr-3",
                            task.status === 'pending' ? 'bg-blue-100' :
                            task.status === 'in-progress' ? 'bg-yellow-100' :
                            task.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                          )}>
                            {task.status === 'pending' ? 
                              <Clock size={16} className="text-blue-600" /> :
                            task.status === 'in-progress' ? 
                              <Activity size={16} className="text-yellow-600" /> :
                            task.status === 'completed' ? 
                              <CheckCircle2 size={16} className="text-green-600" /> :
                              <AlertTriangle size={16} className="text-red-600" />
                            }
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-500 mt-0.5">{task.location}</p>
                            <div className="flex items-center mt-1.5">
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                task.priority === 'low' ? 'bg-blue-100 text-blue-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              )}>
                                {task.priority}
                              </span>
                              
                              {task.assignedTo && (
                                <div className="ml-2 flex items-center text-xs text-gray-500">
                                  <Truck size={12} className="mr-1" />
                                  {robots.find(r => r.id === task.assignedTo)?.name || 'Unknown Robot'}
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
          
          {/* Quick View Robots */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="text-xl font-semibold"
              >
                Active Robots
              </motion.h2>
              <Link 
                to="/robots"
                className="flex items-center text-primary hover:underline"
              >
                <LayoutGrid size={16} className="mr-1" />
                View All Robots
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeRobots.map((robot, index) => (
                <RobotCard key={robot.id} robot={robot} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
