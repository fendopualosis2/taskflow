import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Calendar, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { cn, formatRelativeDate, isOverdue, PRIORITY_CONFIG } from '../../utils/helpers';

export default function TaskCard({ task, onToggle, onClick, onDelete, compact }) {
  const { getProjectById } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const project = task.projectId ? getProjectById(task.projectId) : null;
  const overdue = task.dueDate ? isOverdue(task.dueDate, task.completed) : false;
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(task.id);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) onDelete(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onClick) onClick(task);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(task)}
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer",
        "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06]",
        "hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:border-gray-300 dark:hover:border-white/[0.1]",
        task.completed && "opacity-75"
      )}
    >
      <div 
        className="mt-0.5 flex-shrink-0 cursor-pointer p-1"
        onClick={handleToggle}
      >
        <div className={cn(
          "h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-300",
          task.completed 
            ? "bg-emerald-500 border-emerald-500" 
            : "border-gray-300 dark:border-gray-600 group-hover:border-violet-500"
        )}>
          <motion.svg
            initial={false}
            animate={{ opacity: task.completed ? 1 : 0, scale: task.completed ? 1 : 0.5 }}
            className="h-3.5 w-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: task.completed ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium text-base truncate transition-all duration-300",
          task.completed ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-white"
        )}>
          {task.title}
        </h3>
        
        {!compact && task.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
            {task.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              overdue ? "text-red-500 font-medium" : "text-gray-500 dark:text-gray-400"
            )}>
              {overdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              <span>{formatRelativeDate(task.dueDate)}</span>
            </div>
          )}
          
          {project && (
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <span 
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color || '#8B5CF6' }} 
              />
              <span className="truncate max-w-[120px]">{project.name}</span>
            </div>
          )}

          {task.category && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
              {task.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
          priorityInfo.bgClass, priorityInfo.textClass
        )}>
          {priorityInfo.label}
        </span>

        <div className="relative mt-auto" ref={menuRef}>
          <button 
            onClick={handleMenuClick}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-36 rounded-lg shadow-lg bg-white dark:bg-[#1E2536] border border-gray-200 dark:border-white/10 overflow-hidden z-10"
              >
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
