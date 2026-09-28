import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project, taskCount = 0, completedCount = 0 }) {
  const navigate = useNavigate();
  const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
  const color = project.color || '#8B5CF6'; // Default to violet
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="relative p-5 cursor-pointer rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all duration-200 group overflow-hidden"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80 group-hover:opacity-100 transition-opacity" 
        style={{ backgroundColor: color }} 
      />
      <div className="pl-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-white/60 mb-5 line-clamp-2 min-h-[40px]">
          {project.description || 'No description provided.'}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-white/60">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%`, backgroundColor: color }} 
            />
          </div>
          <div className="pt-2 flex justify-between items-center text-xs text-gray-500 dark:text-white/40 font-medium">
            <span>{completedCount} / {taskCount} tasks completed</span>
          </div>
        </div>
      </div>
      
      {/* Subtle background glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
