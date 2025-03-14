
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Robot, getStatusColor } from '@/utils/mockData';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FleetOverviewProps {
  robots: Robot[];
}

export default function FleetOverview({ robots }: FleetOverviewProps) {
  // Count robots by status
  const statusCounts = robots.reduce((acc, robot) => {
    const status = robot.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Format data for chart
  const data = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  
  // Colors for each status
  const COLORS = {
    active: '#22c55e', // green-500
    idle: '#60a5fa', // blue-400
    charging: '#facc15', // yellow-400
    maintenance: '#a855f7', // purple-500
    error: '#ef4444', // red-500
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-5 shadow-sm h-full"
    >
      <h3 className="text-lg font-semibold mb-4">Fleet Status Overview</h3>
      
      <div className="flex items-center justify-center h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              animationBegin={300}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS] || '#9ca3af'} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} robots`, '']} 
              labelFormatter={(name) => `Status: ${name}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                borderColor: 'rgba(229, 231, 235, 1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between p-2 rounded-md bg-white/50">
            <div className="flex items-center">
              <div className={cn(
                "w-3 h-3 rounded-full mr-2",
                getStatusColor(status as any)
              )} />
              <span className="text-sm capitalize">{status}</span>
            </div>
            <span className="text-sm font-medium">{count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
