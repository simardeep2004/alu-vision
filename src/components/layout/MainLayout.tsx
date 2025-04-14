
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {children}
        </motion.main>
        
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} TheAluVision. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-alu-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-alu-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-alu-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
