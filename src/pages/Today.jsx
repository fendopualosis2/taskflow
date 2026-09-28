import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useTask } from '../context/TaskContext';
import { filterTasks, sortTasks, isOverdue, isToday } from '../utils/helpers';

export default function Today() {
  const { tasks } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active tasks only
  const activeTasks = tasks.filter(t => !t.completed);
  
  const todaysTasksRaw = filterTasks(activeTasks, { today: true });
  const todaysTasks = sortTasks(todaysTasksRaw, 'priority');
  
  const overdueTasksRaw = activeTasks.filter(t => t.dueDate && isOverdue(t.dueDate, t.completed));
  const overdueTasks = sortTasks(overdueTasksRaw, 'dueDate');

  const highPrioritySoon = activeTasks
    .filter(t => (t.priority === 'high' || t.priority === 'urgent') && t.dueDate && !isToday(t.dueDate) && !isOverdue(t.dueDate, t.completed))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const completedToday = tasks.filter(t => t.completed && t.completedAt && isToday(t.completedAt)).length;
  const totalForToday = todaysTasks.length + completedToday;
  const progressPercent = totalForToday > 0 ? (completedToday / totalForToday) * 100 : 0;

  const isAllClear = todaysTasks.length === 0 && overdueTasks.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-100 dark:bg-violet-500/20 rounded-xl text-violet-600 dark:text-violet-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Focus</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">Make it a great day.</p>
          </div>
        </div>
      </div>

      {totalForToday > 0 && (
        <div className="bg-white dark:bg-[#1E2536] border border-gray-200 dark:border-white/10 p-5 rounded-2xl">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-900 dark:text-white">Daily Progress</span>
            <span className="text-violet-600 dark:text-violet-400">{completedToday} of {totalForToday} completed</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {isAllClear ? (
        <EmptyState
          icon={Sparkles}
          title="Your day is clear!"
          description="You have no tasks due today. Take a break or plan ahead."
          action={<Button variant="primary" onClick={() => setIsModalOpen(true)}>Add a task</Button>}
        />
      ) : (
        <div className="space-y-10">
          {overdueTasks.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Overdue ({overdueTasks.length})
              </h2>
              <TaskList tasks={overdueTasks} />
            </section>
          )}

          {todaysTasks.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Today</h2>
              <TaskList tasks={todaysTasks} />
            </section>
          )}

          {highPrioritySoon.length > 0 && (
            <section className="pt-6 border-t border-gray-200 dark:border-white/10">
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                On the Horizon (High Priority)
              </h2>
              <TaskList tasks={highPrioritySoon} />
            </section>
          )}
        </div>
      )}

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}
