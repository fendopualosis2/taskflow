import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CheckSquare, Calendar, Clock, CircleCheck, 
  FolderKanban, Tags, BarChart3, Focus, Settings2, 
  ChevronLeft, ChevronRight, CheckCircle2
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { cn } from '../../utils/helpers';

const Sidebar = ({ isMobile, isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { settings } = useTask() || { settings: { profile: { name: 'User', email: 'user@example.com' } } };

  const navGroups = [
    {
      label: 'WORKSPACE',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
        { icon: CheckSquare, label: 'My Tasks', to: '/tasks' },
        { icon: Calendar, label: 'Today', to: '/today' },
        { icon: Clock, label: 'Upcoming', to: '/upcoming' },
        { icon: CircleCheck, label: 'Completed', to: '/completed' },
      ]
    },
    {
      label: 'ORGANIZE',
      items: [
        { icon: FolderKanban, label: 'Projects', to: '/projects' },
        { icon: Tags, label: 'Categories', to: '/categories' },
      ]
    },
    {
      label: 'PRODUCTIVITY',
      items: [
        { icon: BarChart3, label: 'Analytics', to: '/analytics' },
        { icon: Focus, label: 'Focus Mode', to: '/focus' },
      ]
    },
    {
      label: 'OTHER',
      items: [
        { icon: Settings2, label: 'Settings', to: '/settings' },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0A0F1E]/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/[0.06]">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-white/[0.06]">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && !isMobile ? "w-8" : "w-auto")}>
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className={cn(
            "text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 whitespace-nowrap transition-opacity",
            collapsed && !isMobile ? "opacity-0" : "opacity-100"
          )}>
            TaskFlow
          </span>
        </div>
        
        {!isMobile && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <div className={cn(
              "px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider transition-opacity",
              collapsed && !isMobile ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            )}>
              {group.label}
            </div>
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    onClick={() => isMobile && onClose()}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                      isActive 
                        ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-gray-200",
                      collapsed && !isMobile && "justify-center"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div 
                            layoutId="activeNavIndicator"
                            className="absolute left-0 top-1 bottom-1 w-1 bg-violet-600 dark:bg-violet-500 rounded-r-full"
                          />
                        )}
                        <item.icon className={cn(
                          "w-5 h-5 flex-shrink-0 transition-colors",
                          isActive ? "text-violet-600 dark:text-violet-500" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                        )} />
                        
                        {!collapsed || isMobile ? (
                          <span className="truncate">{item.label}</span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Profile footer */}
      <div className="p-4 border-t border-gray-100 dark:border-white/[0.06]">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && !isMobile ? "justify-center" : ""
        )}>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {settings?.profile?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#0A0F1E] rounded-full"></div>
          </div>
          
          {(!collapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {settings?.profile?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {settings?.profile?.email || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-30"
    >
      {sidebarContent}
    </motion.div>
  );
};

export default Sidebar;
