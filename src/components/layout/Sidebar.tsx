
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Robots', path: '/robots', icon: Truck },
  { name: 'Map', path: '/map', icon: Map },
  { name: 'Tasks', path: '/tasks', icon: ListChecks },
  { name: 'Documentation', path: '/documentation', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border relative transition-all duration-300 ease-in-out",
        collapsed ? "w-[45px]" : "w-[160px]"
      )}
    >
      <div className="flex items-center justify-between p-1.5 border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {collapsed ? (
            <Activity className="w-4 h-4 text-primary" />
          ) : (
            <div className="flex items-center">
              <img 
                src="https://www.anzocontrols.com/wp-content/uploads/2022/11/Client_logo_anzo-removebg-preview-2.png" 
                alt="Anzo Controls"
                className="h-5 mr-1" 
              />
              <span className="text-[11px] font-semibold text-sidebar-foreground">
                Controls
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent p-0.5 rounded-md transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 pt-1 pb-1">
        <ul className="space-y-0.5 px-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center py-0.5 px-1.5 rounded-md transition-all-200 text-[11px]",
                    collapsed ? "justify-center" : "",
                    isActive 
                      ? "bg-sidebar-accent text-primary bg-gradient-to-r from-primary/20 to-transparent" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon size={14} className={cn("flex-shrink-0", !collapsed && "mr-1.5")} />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-1">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <div className={collapsed ? "hidden" : "flex items-center"}>
            <BatteryMedium size={10} className="text-green-400 mr-1" />
            <span className="text-[10px] text-sidebar-foreground">Fleet Status</span>
          </div>
          <div className={cn(
            "px-1 py-0.5 rounded text-[10px] font-medium",
            collapsed ? "bg-green-500/20 text-green-400" : "bg-green-500/10 text-green-400"
          )}>
            {collapsed ? "" : "4"}/{collapsed ? "" : "6"}
          </div>
        </div>
      </div>
      
      <div className="p-0.5 text-center text-[8px] text-gray-500 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-[8px]">© {new Date().getFullYear()} Anzo Controls</div>
        )}
      </div>
    </aside>
  );
}
