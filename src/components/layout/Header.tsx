
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle, Settings, HelpCircle, Menu, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  pageTitle?: string;
  userProfile?: any;
}

export default function Header({ pageTitle = "Dashboard", userProfile }: HeaderProps) {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account",
    });
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Map", href: "/map" },
    { label: "Robots", href: "/robots" },
    { label: "Tasks", href: "/tasks" },
    { label: "Settings", href: "/settings" },
    { label: "Documentation", href: "/documentation" }
  ];

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo and page title */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img 
                src="https://www.anzocontrols.com/wp-content/uploads/2022/11/Client_logo_anzo-removebg-preview-2.png" 
                alt="Anzo Controls" 
                className="h-8 mr-2" 
              />
              <span className="hidden md:block text-base font-semibold text-gray-900">
                Fleet Management
              </span>
            </Link>
            <div className="hidden md:block ml-6">
              <h1 className="text-lg font-medium text-gray-800">{pageTitle}</h1>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className="px-2 py-1.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* User dropdown */}
            {userProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="ml-2 flex items-center space-x-2 text-left"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span className="max-w-[100px] truncate text-sm">
                      {userProfile.full_name || userProfile.email || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-0.5">
                      <span>{userProfile.full_name || "User"}</span>
                      <span className="text-xs text-gray-500 truncate">
                        {userProfile.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/documentation" className="cursor-pointer w-full">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <div className={cn(
        "md:hidden border-b border-gray-200 bg-white",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="space-y-0.5 px-2 pb-3 pt-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className="w-full justify-start px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
