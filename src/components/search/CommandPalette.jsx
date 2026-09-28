import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Moon, Sun, Plus, LayoutDashboard, 
  CheckSquare, Calendar, Clock, CircleCheck, 
  FolderKanban, Tags, BarChart3, Focus, Settings2
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/helpers';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { tasks = [] } = useTask() || { tasks: [] };
  const { theme, setTheme, isDark } = useTheme() || { theme: 'dark', setTheme: () => {}, isDark: true };

  const navigation = [
    { id: 'nav-dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/dashboard'), section: 'Navigation' },
    { id: 'nav-tasks', label: 'My Tasks', icon: CheckSquare, action: () => navigate('/tasks'), section: 'Navigation' },
    { id: 'nav-today', label: 'Today', icon: Calendar, action: () => navigate('/today'), section: 'Navigation' },
    { id: 'nav-upcoming', label: 'Upcoming', icon: Clock, action: () => navigate('/upcoming'), section: 'Navigation' },
    { id: 'nav-completed', label: 'Completed', icon: CircleCheck, action: () => navigate('/completed'), section: 'Navigation' },
    { id: 'nav-projects', label: 'Projects', icon: FolderKanban, action: () => navigate('/projects'), section: 'Navigation' },
    { id: 'nav-categories', label: 'Categories', icon: Tags, action: () => navigate('/categories'), section: 'Navigation' },
    { id: 'nav-analytics', label: 'Analytics', icon: BarChart3, action: () => navigate('/analytics'), section: 'Navigation' },
    { id: 'nav-focus', label: 'Focus Mode', icon: Focus, action: () => navigate('/focus'), section: 'Navigation' },
    { id: 'nav-settings', label: 'Settings', icon: Settings2, action: () => navigate('/settings'), section: 'Navigation' },
  ];

  const quickActions = [
    { id: 'action-create', label: 'Create new task', icon: Plus, action: () => { /* Add task action */ navigate('/tasks?create=true'); }, section: 'Quick Actions' },
    { id: 'action-theme', label: `Switch to ${isDark ? 'light' : 'dark'} theme`, icon: isDark ? Sun : Moon, action: () => setTheme(isDark ? 'light' : 'dark'), section: 'Quick Actions' },
  ];

  // Search tasks
  const taskResults = query.length > 1 
    ? tasks
        .filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map(t => ({
          id: `task-${t.id}`,
          label: t.title,
          icon: CheckSquare,
          action: () => navigate(`/tasks?id=${t.id}`),
          section: 'Tasks'
        }))
    : [];

  const allItems = [...quickActions, ...navigation];
  
  const filteredItems = query
    ? [
        ...allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
        ...taskResults
      ]
    : allItems;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter' && filteredItems.length > 0) {
        e.preventDefault();
        filteredItems[selectedIndex].action();
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen && typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]",
              "bg-white border border-gray-200",
              "dark:bg-[#0F1629] dark:border-white/[0.06] backdrop-blur-xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-white/[0.06]">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              />
              <div className="flex gap-1 ml-3">
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-white/[0.1] dark:text-gray-400 border border-gray-200 dark:border-white/[0.1]">
                  ESC
                </kbd>
              </div>
            </div>

            <div className="overflow-y-auto py-2 scrollbar-hide flex-1">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="px-2">
                  {Object.entries(
                    filteredItems.reduce((acc, item) => {
                      if (!acc[item.section]) acc[item.section] = [];
                      acc[item.section].push(item);
                      return acc;
                    }, {})
                  ).map(([section, items]) => (
                    <div key={section} className="mb-4 last:mb-0">
                      <div className="px-3 mb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {section}
                      </div>
                      {items.map((item) => {
                        const index = filteredItems.findIndex(i => i.id === item.id);
                        const isSelected = index === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => {
                              item.action();
                              onClose();
                            }}
                            className={cn(
                              "flex items-center px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors",
                              isSelected 
                                ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" 
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                            )}
                          >
                            <Icon className={cn("w-4 h-4 mr-3", isSelected ? "text-violet-600 dark:text-violet-400" : "text-gray-400")} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {isSelected && (
                              <span className="text-xs text-violet-500 dark:text-violet-400 ml-2">Enter ↵</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CommandPalette;
