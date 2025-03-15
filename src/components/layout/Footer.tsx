
import { useState, useEffect } from 'react';
import { Copyright } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Update the copyright year when mounted
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-4 px-6 text-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-3">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-200"
              >
                <path 
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 15.75a5.25 5.25 0 0 1-5.25-5.25c0-2.9 2.35-5.25 5.25-5.25s5.25 2.35 5.25 5.25-2.35 5.25-5.25 5.25z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <div className="text-white font-semibold">Anzo Controls</div>
              <div className="text-xs text-slate-400">Industrial Automation Solutions</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Copyright size={14} className="mr-1.5 text-slate-400" />
            <span>Copyright {currentYear} Anzo Controls. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
