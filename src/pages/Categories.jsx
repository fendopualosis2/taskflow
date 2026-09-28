import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tags, Code2, Palette, FileText, Search, Users, 
  Compass, CheckCircle, Eye, Folder, Plus, ArrowLeft
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { CATEGORIES } from '../utils/helpers';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';

const CATEGORY_ICONS = {
  Development: Code2,
  Design: Palette,
  Documentation: FileText,
  Research: Search,
  Meeting: Users,
  Planning: Compass,
  Testing: CheckCircle,
  Review: Eye,
  Other: Folder,
};

const CATEGORY_COLORS = {
  Development: { bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', bar: '#8B5CF6' },
  Design: { bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20', bar: '#EC4899' },
  Documentation: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', bar: '#3B82F6' },
  Research: { bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', bar: '#06B6D4' },
  Meeting: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', bar: '#F59E0B' },
  Planning: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', bar: '#10B981' },
  Testing: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', bar: '#A855F7' },
  Review: { bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', bar: '#6366F1' },
  Other: { bg: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20', bar: '#6B7280' },
};

export default function Categories() {
  const { tasks } = useTask();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const getCategoryStats = (categoryName) => {
    const catTasks = tasks.filter(t => t.category === categoryName);
    const completed = catTasks.filter(t => t.completed || t.status === 'done').length;
    const progress = catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0;
    return { total: catTasks.length, completed, progress, tasks: catTasks };
  };

  const selectedCategoryStats = selectedCategory ? getCategoryStats(selectedCategory) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/10 transition-colors"
              aria-label="Back to all categories"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="p-3 bg-violet-100 dark:bg-violet-500/20 rounded-xl text-violet-600 dark:text-violet-400">
              <Tags className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedCategory ? `${selectedCategory} Tasks` : 'Categories'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              {selectedCategory
                ? `${selectedCategoryStats.total} tasks in this category`
                : 'Organize your tasks across work functions and categories.'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsTaskModalOpen(true)}
        >
          Add Task
        </Button>
      </div>

      {selectedCategory ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion:</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedCategoryStats.progress}%</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedCategoryStats.completed} of {selectedCategoryStats.total} completed
            </span>
          </div>

          <TaskList
            tasks={selectedCategoryStats.tasks}
            emptyTitle={`No tasks in ${selectedCategory}`}
            emptyDescription="Create a task with this category to organize your work."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(category => {
            const stats = getCategoryStats(category);
            const Icon = CATEGORY_ICONS[category] || Folder;
            const themeStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

            return (
              <motion.div
                key={category}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setSelectedCategory(category)}
                className="p-5 cursor-pointer rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:border-gray-300 dark:hover:border-white/[0.1] transition-all shadow-sm group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${themeStyle.bg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    {stats.total} {stats.total === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {category}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4">
                  {stats.completed} completed
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span>Progress</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.progress}%`, backgroundColor: themeStyle.bar }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </motion.div>
  );
}
