
import { useState } from 'react';
import { 
  Database, 
  Server, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RefreshCw,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function DatabaseStatus() {
  // In a real application, these would be fetched from an API
  const [connections, setConnections] = useState({
    mssql: {
      status: 'connected',
      lastSync: '2 minutes ago',
      host: 'sql-server.example.com',
      queryTime: 24
    },
    mongodb: {
      status: 'connected',
      lastSync: '5 minutes ago',
      host: 'mongo-db.example.com',
      queryTime: 12
    }
  });
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Simulate refresh action
  const refreshConnections = () => {
    setRefreshing(true);
    
    // This would be replaced with actual API calls
    setTimeout(() => {
      setRefreshing(false);
      // Update last sync time
      setConnections(prev => ({
        mssql: {
          ...prev.mssql,
          lastSync: 'just now'
        },
        mongodb: {
          ...prev.mongodb,
          lastSync: 'just now'
        }
      }));
      
      toast({
        title: "Database connections refreshed",
        description: "All database connections are up to date"
      });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3">
          <CardTitle className="flex items-center text-xl font-semibold text-primary">
            <Database size={18} className="mr-2" />
            Database Connections
          </CardTitle>
          <CardDescription>
            Monitor and manage your database connections
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-5">
          <div className="space-y-4">
            {/* MSSQL Connection */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Server size={16} className="mr-2 text-blue-500" />
                    SQL Server
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{connections.mssql.host}</p>
                </div>
                
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium flex items-center",
                  connections.mssql.status === 'connected' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                  {connections.mssql.status === 'connected' ? 
                    <CheckCircle2 size={12} className="mr-1" /> : 
                    <XCircle size={12} className="mr-1" />
                  }
                  {connections.mssql.status === 'connected' ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Last sync</span>
                  <span className="text-sm font-medium flex items-center mt-1">
                    <Clock size={12} className="mr-1 text-gray-400" />
                    {connections.mssql.lastSync}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Avg. query time</span>
                  <span className="text-sm font-medium flex items-center mt-1">
                    <LineChart size={12} className="mr-1 text-gray-400" />
                    {connections.mssql.queryTime}ms
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* MongoDB Connection */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Server size={16} className="mr-2 text-green-500" />
                    MongoDB
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{connections.mongodb.host}</p>
                </div>
                
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium flex items-center",
                  connections.mongodb.status === 'connected' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                  {connections.mongodb.status === 'connected' ? 
                    <CheckCircle2 size={12} className="mr-1" /> : 
                    <XCircle size={12} className="mr-1" />
                  }
                  {connections.mongodb.status === 'connected' ? 'Connected' : 'Disconnected'}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Last sync</span>
                  <span className="text-sm font-medium flex items-center mt-1">
                    <Clock size={12} className="mr-1 text-gray-400" />
                    {connections.mongodb.lastSync}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Avg. query time</span>
                  <span className="text-sm font-medium flex items-center mt-1">
                    <LineChart size={12} className="mr-1 text-gray-400" />
                    {connections.mongodb.queryTime}ms
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50/70 py-3 flex justify-between">
          <div className="text-xs text-gray-500">
            Connections are automatically refreshed every 5 minutes
          </div>
          <button 
            onClick={refreshConnections}
            disabled={refreshing}
            className="flex items-center text-xs px-3 py-1.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            <RefreshCw size={12} className={cn("mr-1.5", refreshing && "animate-spin")} />
            {refreshing ? "Refreshing..." : "Refresh Now"}
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
