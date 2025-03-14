
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import TaskForm from '@/components/tasks/TaskForm';
import { tasks, robots, getTaskPriorityColor, getTaskStatusColor, formatDate } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Truck, 
  Calendar,
  X,
  MoreHorizontal
} from 'lucide-react';

export default function Tasks() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
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
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold">Tasks</h1>
              <p className="text-gray-500 mt-1">Manage and assign tasks to your robot fleet</p>
            </div>
            
            <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-primary/90 transition-colors">
              <Plus size={18} className="mr-1.5" />
              New Task
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
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-md border border-gray-300 flex items-center hover:bg-gray-50 transition-colors">
                <Filter size={18} className="mr-1.5 text-gray-500" />
                Filter
              </button>
              
              <select className="px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none pr-8 bg-no-repeat bg-[right_12px_center]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundSize: "16px" }}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
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
            {['All', 'Pending', 'In Progress', 'Completed', 'Failed'].map((status, index) => (
              <button
                key={status}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  index === 0
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {status}
              </button>
            ))}
          </motion.div>
          
          {/* Tasks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            {/* Task Form Card */}
            <TaskForm />
            
            {/* Tasks List */}
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className={cn(
                  "glass-card rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer",
                  selectedTask === task.id ? "ring-2 ring-primary/30" : ""
                )}
                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={cn(
                      "p-2 rounded-md mr-4",
                      task.status === 'pending' ? 'bg-blue-100' :
                      task.status === 'in-progress' ? 'bg-yellow-100' :
                      task.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                    )}>
                      {task.status === 'pending' ? 
                        <Clock size={18} className="text-blue-600" /> :
                      task.status === 'in-progress' ? 
                        <Activity size={18} className="text-yellow-600" /> :
                      task.status === 'completed' ? 
                        <CheckCircle2 size={18} className="text-green-600" /> :
                        <AlertTriangle size={18} className="text-red-600" />
                      }
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          getTaskPriorityColor(task.priority)
                        )}>
                          {task.priority}
                        </span>
                        
                        <div className="flex items-center ml-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full mr-1",
                            getTaskStatusColor(task.status)
                          )} />
                          <span className="text-xs text-gray-600 capitalize">{task.status.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal size={18} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  {task.description}
                </div>
                
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  {task.assignedTo && (
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <Truck size={14} className="mr-1" />
                      {robots.find(r => r.id === task.assignedTo)?.name || 'Unknown'}
                    </div>
                  )}
                  
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(task.createdAt)}
                  </div>
                </div>
                
                {selectedTask === task.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                        <X size={14} className="mr-1.5" />
                        Cancel
                      </button>
                      
                      {task.status !== 'completed' && (
                        <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center">
                          <CheckCircle2 size={14} className="mr-1.5" />
                          {task.status === 'pending' ? 'Start Task' : 'Complete Task'}
                        </button>
                      )}
                      
                      {task.status === 'pending' && !task.assignedTo && (
                        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
                          <Truck size={14} className="mr-1.5" />
                          Assign Robot
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
