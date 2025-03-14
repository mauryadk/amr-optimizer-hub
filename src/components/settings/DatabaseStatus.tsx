
import { useState } from 'react';
import { 
  Database, 
  Server, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function DatabaseStatus() {
  // In a real application, these would be fetched from an API
  const [connections, setConnections] = useState({
    mssql: {
      status: 'connected',
      lastSync: '2 minutes ago',
      host: 'sql-server.example.com'
    },
    mongodb: {
      status: 'connected',
      lastSync: '5 minutes ago',
      host: 'mongo-db.example.com'
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
      className="glass-card rounded-xl p-5 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Database size={18} className="mr-2 text-primary" />
          Database Connections
        </h2>
        
        <button 
          onClick={refreshConnections}
          disabled={refreshing}
          className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors flex items-center"
        >
          <RefreshCw size={14} className={cn("mr-1.5", refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>
      
      <div className="space-y-4">
        {/* MSSQL Connection */}
        <div className="bg-white p-4 rounded-lg border border-gray-100">
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
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            Last sync: {connections.mssql.lastSync}
          </div>
        </div>
        
        {/* MongoDB Connection */}
        <div className="bg-white p-4 rounded-lg border border-gray-100">
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
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            Last sync: {connections.mongodb.lastSync}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p>These connections are simulated. In a production environment, you would connect to real database instances via a backend service.</p>
      </div>
    </motion.div>
  );
}
