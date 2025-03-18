
import { useState, useEffect } from 'react';
import { Copyright, Heart, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [uptime, setUptime] = useState(0);
  const { toast } = useToast();
  
  // Update the copyright year when mounted
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Simulate system uptime counter
  useEffect(() => {
    const startTime = new Date().getTime();
    
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      setUptime(elapsedSeconds);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Format uptime to display as days, hours, minutes, seconds
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const handleDocClick = (docName: string) => {
    toast({
      title: "Documentation",
      description: `Opening ${docName} in a new tab`,
    });
  };

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-300 py-2 px-4 text-xs">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <div className="mr-2">
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-200"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <path 
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 15.75a5.25 5.25 0 0 1-5.25-5.25c0-2.9 2.35-5.25 5.25-5.25s5.25 2.35 5.25 5.25-2.35 5.25-5.25 5.25z" 
                  fill="currentColor"
                />
              </motion.svg>
            </div>
            <div>
              <div className="text-white font-semibold text-xs">Anzo Controls</div>
              <div className="text-[10px] text-slate-400">Industrial Automation</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-2 md:mb-0">
            <div className="flex space-x-3 mb-1">
              <motion.a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Github size={14} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Twitter size={14} />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Linkedin size={14} />
              </motion.a>
            </div>
            <div className="text-slate-500 text-[10px] flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span>
              System Uptime: {formatUptime(uptime)}
            </div>
          </div>
          
          <div className="flex items-center">
            <Copyright size={12} className="mr-1 text-slate-400" />
            <span className="text-[10px]">Copyright {currentYear} Anzo Controls</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-2 md:mb-0">
            <Heart size={12} className="mr-1 text-red-400" />
            <span className="text-slate-400 text-[10px]">Made for industrial automation</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <button 
              className="text-slate-400 hover:text-white transition-colors text-[10px] flex items-center"
              onClick={() => handleDocClick("API Documentation")}
            >
              API Docs
              <ExternalLink size={8} className="ml-1" />
            </button>
            <button 
              className="text-slate-400 hover:text-white transition-colors text-[10px] flex items-center"
              onClick={() => handleDocClick("User Manual")}
            >
              Manual
              <ExternalLink size={8} className="ml-1" />
            </button>
            <button 
              className="text-slate-400 hover:text-white transition-colors text-[10px] flex items-center"
              onClick={() => handleDocClick("Terms of Service")}
            >
              Terms
              <ExternalLink size={8} className="ml-1" />
            </button>
            <button 
              className="text-slate-400 hover:text-white transition-colors text-[10px] flex items-center"
              onClick={() => handleDocClick("Privacy Policy")}
            >
              Privacy
              <ExternalLink size={8} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
