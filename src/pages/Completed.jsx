import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Search } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useTask } from '../context/TaskContext';

export default function Completed() {
  const { tasks } = useTask();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('completedAt');

  let completedTasks = tasks.filter(t => t.completed);

  if (search) {
    const q = search.toLowerCase();
    completedTasks = completedTasks.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.description && t.description.toLowerCase().includes(q))
    );
  }

  completedTasks.sort((a, b) => {
    if (sortBy === 'completedAt') {
      return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Completed</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">{completedTasks.length} tasks finished</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-[#1E2536] p-3 rounded-xl border border-gray-200 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search completed tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-48 py-2 pl-3 pr-8 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
        >
          <option value="completedAt" className="dark:bg-gray-800">Recently Completed</option>
          <option value="title" className="dark:bg-gray-800">Alphabetical</option>
        </select>
      </div>

      <div className="mt-6">
        <TaskList 
          tasks={completedTasks}
          emptyIcon={CheckSquare}
          emptyTitle="No completed tasks yet"
          emptyDescription="When you finish tasks, they will appear here."
        />
      </div>
    </motion.div>
  );
}
