
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  delay?: number;
}

export default function StatusCard({ 
  title, 
  value, 
  icon, 
  trend, 
  bgColor = "bg-white", 
  delay = 0
}: StatusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration:.4, delay: delay * 0.1 }}
      className={cn(
        "glass-card rounded-lg p-3 shadow-sm relative overflow-hidden",
        bgColor
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-bold mt-0.5">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs font-medium px-1 py-0.5 rounded",
                trend.isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
            </div>
          )}
        </div>
        
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-24 h-24 -m-6 rounded-full bg-primary/5"></div>
    </motion.div>
  );
}
