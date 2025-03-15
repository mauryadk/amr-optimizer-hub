
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  User, 
  ChevronDown, 
  Check,
  Settings,
  LogOut,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<{ id: string; message: string; read: boolean }[]>([
    { id: '1', message: 'Robot Scout-01 completed task delivery', read: false },
    { id: '2', message: 'Voyager-02 battery low (15%)', read: false },
    { id: '3', message: 'New map snapshot available', read: true },
  ]);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Update page title based on location
  useEffect(() => {
    const path = location.pathname;
    let title = 'Dashboard';
    
    if (path.includes('robots')) title = 'Robot Fleet';
    else if (path.includes('map')) title = 'Navigation Map';
    else if (path.includes('tasks')) title = 'Task Management';
    else if (path.includes('settings')) title = 'System Settings';
    else if (path.includes('documentation')) title = 'Documentation';
    
    setPageTitle(title);
  }, [location]);
  
  // Count unread notifications
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    });
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm py-3 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="max-h-80 overflow-y-auto py-1">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id}
                      className="p-3 cursor-pointer focus:bg-gray-50"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                          <BellRing size={16} className={notification.read ? 'text-gray-500' : 'text-blue-500'} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Just now</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "Support chat initiated",
                description: "Connecting to support services...",
              });
            }}
          >
            <MessageSquare size={18} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <span className="font-medium">Admin</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut size={16} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
