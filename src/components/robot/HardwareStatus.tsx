
import { useState } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Wifi, 
  Activity,
  HardDrive,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// In a real app, this would come from API data
interface HardwareMetrics {
  cpu: number;
  memory: number;
  temperature: number;
  networkSignal: number;
  diskSpace: number;
}

// Mock hardware data
const mockHardwareData: HardwareMetrics = {
  cpu: 42,
  memory: 68,
  temperature: 72,
  networkSignal: 85,
  diskSpace: 37
};

export default function HardwareStatus() {
  const [expanded, setExpanded] = useState(false);
  const [hardwareData, setHardwareData] = useState<HardwareMetrics>(mockHardwareData);

  // Get status color based on value
  const getStatusColor = (value: number, invertScale: boolean = false) => {
    const threshold = invertScale ? 
      { green: 40, yellow: 70 } : 
      { green: 70, yellow: 40 };
    
    if (invertScale) {
      return value < threshold.green ? "bg-green-500" :
             value < threshold.yellow ? "bg-yellow-500" :
             "bg-red-500";
    } else {
      return value > threshold.green ? "bg-green-500" :
             value > threshold.yellow ? "bg-yellow-500" :
             "bg-red-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium flex items-center">
          <Cpu size={16} className="mr-2 text-primary" />
          Hardware Status
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Cpu size={14} className="mr-1.5" />
                    CPU Usage
                  </div>
                  <span className="text-sm font-medium">{hardwareData.cpu}%</span>
                </div>
                <Progress 
                  value={hardwareData.cpu} 
                  className="h-2" 
                  indicatorClassName={getStatusColor(hardwareData.cpu, true)}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <HardDrive size={14} className="mr-1.5" />
                    Memory Usage
                  </div>
                  <span className="text-sm font-medium">{hardwareData.memory}%</span>
                </div>
                <Progress 
                  value={hardwareData.memory} 
                  className="h-2" 
                  indicatorClassName={getStatusColor(hardwareData.memory, true)}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Thermometer size={14} className="mr-1.5" />
                    Temperature
                  </div>
                  <span className="text-sm font-medium">{hardwareData.temperature}°C</span>
                </div>
                <Progress 
                  value={hardwareData.temperature} 
                  className="h-2" 
                  indicatorClassName={getStatusColor(hardwareData.temperature, true)}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Wifi size={14} className="mr-1.5" />
                    Network Signal
                  </div>
                  <span className="text-sm font-medium">{hardwareData.networkSignal}%</span>
                </div>
                <Progress 
                  value={hardwareData.networkSignal} 
                  className="h-2" 
                  indicatorClassName={getStatusColor(hardwareData.networkSignal)}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <HardDrive size={14} className="mr-1.5" />
                    Disk Space
                  </div>
                  <span className="text-sm font-medium">{hardwareData.diskSpace}% used</span>
                </div>
                <Progress 
                  value={hardwareData.diskSpace} 
                  className="h-2" 
                  indicatorClassName={getStatusColor(hardwareData.diskSpace, true)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
