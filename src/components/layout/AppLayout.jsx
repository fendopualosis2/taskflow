import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import CommandPalette from '../search/CommandPalette';
import TaskModal from '../tasks/TaskModal';
import { cn } from '../../utils/helpers';

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [globalTaskModalOpen, setGlobalTaskModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an editable field
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      if (!isInput) {
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          setGlobalTaskModalOpen(true);
        } else if (e.key === '/') {
          e.preventDefault();
          setCommandPaletteOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] dark:bg-[#080B14] text-gray-900 dark:text-white transition-colors duration-200">
      <div className="fixed inset-0 pointer-events-none bg-grid-light dark:bg-grid opacity-20" />
      
      <Sidebar 
        isMobile={false} 
      />
      
      <Sidebar 
        isMobile={true} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            TaskFlow
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      <TaskModal
        isOpen={globalTaskModalOpen}
        onClose={() => setGlobalTaskModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
