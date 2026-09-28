import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ListTodo, CircleCheck, Clock, AlertTriangle, Plus } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import ProgressRing from '../components/ui/ProgressRing';
import QuickAdd from '../components/tasks/QuickAdd';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import Button from '../components/ui/Button';
import { useTask } from '../context/TaskContext';
import { formatFullDate, filterTasks } from '../utils/helpers';

export default function Dashboard() {
  const { stats, settings, tasks } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get greeting based on time
  const hour = new Date().getHours();
  let greeting = 'evening';
  if (hour < 12) greeting = 'morning';
  else if (hour < 17) greeting = 'afternoon';

  // Get today's tasks
  const todaysTasks = filterTasks(tasks, { today: true, completed: false });
  
  // Get recent tasks
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Good {greeting}, {settings.profile.name} 👋
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Here's what's happening with your productivity today.
          </p>
          <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mt-1">
            {formatFullDate(new Date())}
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus className="w-5 h-5" />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          icon={<ListTodo className="w-5 h-5" />}
          trend="+3"
          trendUp={true}
          delay={0.1}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={<CircleCheck className="w-5 h-5" />}
          color="emerald"
          trend="+5"
          trendUp={true}
          delay={0.2}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<Clock className="w-5 h-5" />}
          color="violet"
          delay={0.3}
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
          trend="-1"
          trendUp={true}
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <QuickAdd className="mb-6" />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Focus</h2>
              <span className="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {todaysTasks.length} tasks
              </span>
            </div>
            <TaskList 
              tasks={todaysTasks}
              emptyTitle="No tasks due today"
              emptyDescription="Enjoy your free time or get ahead on upcoming tasks."
            />
          </section>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          {/* Productivity Score */}
          <div className="bg-white dark:bg-[#1E2536] border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-6 w-full text-left">Productivity Score</h3>
            <ProgressRing
              value={stats.productivityScore}
              size={160}
              strokeWidth={12}
              showValue={true}
            />
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              {stats.productivityScore >= 80 ? "You're on fire! Keep it up." : 
               stats.productivityScore >= 50 ? "Doing good, steady progress." : 
               "Let's knock out some tasks today!"}
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#1E2536] border border-gray-200 dark:border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recently Added</h3>
            <TaskList 
              tasks={recentTasks}
              showProject={false}
              emptyTitle="No recent tasks"
              emptyDescription="Add some tasks to get started."
            />
          </div>
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}
