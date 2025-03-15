
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Map, 
  ListChecks, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Activity,
  BatteryMedium,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Robots', path: '/robots', icon: Truck },
  { name: 'Map', path: '/map', icon: Map },
  { name: 'Tasks', path: '/tasks', icon: ListChecks },
  { name: 'Documentation', path: '/documentation', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border relative transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <Activity className="w-6 h-6" />
          </div>
          {!collapsed && (
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
              Anzo Controls
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent p-1 rounded-md transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 pt-4 pb-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center py-2 px-3 rounded-md transition-all-200",
                  collapsed ? "justify-center" : "",
                  isActive 
                    ? "bg-sidebar-accent text-primary bg-gradient-to-r from-primary/20 to-transparent" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon size={20} className={cn("flex-shrink-0", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <div className={collapsed ? "hidden" : "flex items-center"}>
            <BatteryMedium size={16} className="text-green-400 mr-2" />
            <span className="text-sm text-sidebar-foreground">Fleet Status</span>
          </div>
          <div className={cn(
            "px-2 py-1 rounded text-xs font-medium",
            collapsed ? "bg-green-500/20 text-green-400" : "bg-green-500/10 text-green-400"
          )}>
            {collapsed ? "" : "4"}/{collapsed ? "" : "6"}
          </div>
        </div>
      </div>
    </aside>
  );
}
