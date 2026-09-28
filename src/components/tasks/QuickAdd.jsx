import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/helpers';

export default function QuickAdd({ className }) {
  const [title, setTitle] = useState('');
  const { addTask } = useTask();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      priority: 'medium',
      status: 'todo'
    });

    setTitle('');
    showToast({ message: 'Task added', type: 'success' });
  };

  return (
    <motion.form 
      whileTap={{ scale: 0.99 }}
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center bg-white dark:bg-[#1E2536] border border-gray-200 dark:border-white/10 rounded-xl shadow-sm transition-all focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent",
        className
      )}
    >
      <div className="pl-4 pr-2 text-gray-400">
        <Plus className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full py-3 pr-4 bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-sm"
      />
    </motion.form>
  );
}
