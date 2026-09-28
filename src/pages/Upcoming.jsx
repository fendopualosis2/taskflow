import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import EmptyState from '../components/ui/EmptyState';
import { useTask } from '../context/TaskContext';
import { groupTasksByDate } from '../utils/helpers';

const GROUP_CONFIG = [
  { key: 'today', label: 'Today', badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' },
  { key: 'tomorrow', label: 'Tomorrow', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
  { key: 'thisWeek', label: 'This Week', badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' },
  { key: 'nextWeek', label: 'Next Week', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  { key: 'later', label: 'Later', badgeClass: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300' },
];

export default function Upcoming() {
  const { tasks } = useTask();

  // Active tasks with due dates in future or today (exclude overdue)
  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate);
  const groupedTasks = groupTasksByDate(upcomingTasks);

  const visibleGroups = GROUP_CONFIG.filter(g => (groupedTasks[g.key] || []).length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
          <CalendarDays className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5">Plan ahead for the coming days and weeks.</p>
        </div>
      </div>

      {visibleGroups.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming tasks"
          description="You don't have any tasks scheduled for the future. Add deadlines to see them organized here."
        />
      ) : (
        <div className="space-y-10">
          {visibleGroups.map(group => {
            const items = groupedTasks[group.key] || [];

            return (
              <section key={group.key} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{group.label}</h2>
                  <div className="h-px bg-gray-200 dark:bg-white/10 flex-1" />
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${group.badgeClass}`}>
                    {items.length} {items.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <TaskList tasks={items} />
              </section>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
