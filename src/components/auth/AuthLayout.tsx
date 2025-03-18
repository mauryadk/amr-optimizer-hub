
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img 
            src="https://www.anzocontrols.com/wp-content/uploads/2022/11/Client_logo_anzo-removebg-preview-2.png" 
            alt="Anzo Controls"
            className="h-16"
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-8 border border-gray-200">
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Anzo Controls. All rights reserved.</p>
          <p className="mt-1">Intelligent Fleet Management System</p>
        </div>
      </motion.div>
    </div>
  );
}
