import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import FilterBar from '../components/tasks/FilterBar';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';
import TaskDetails from '../components/tasks/TaskDetails';
import Button from '../components/ui/Button';
import QuickAdd from '../components/tasks/QuickAdd';
import { useTask } from '../context/TaskContext';
import { filterTasks, sortTasks } from '../utils/helpers';

export default function Tasks() {
  const { tasks, getTaskById } = useTask();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTaskDetails, setActiveTaskDetails] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('dueDate');

  // Handle URL query parameters (e.g. from Command Palette or links)
  useEffect(() => {
    const shouldCreate = searchParams.get('create');
    if (shouldCreate === 'true') {
      setIsModalOpen(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }

    const taskId = searchParams.get('id');
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        setActiveTaskDetails(task);
      }
      searchParams.delete('id');
      setSearchParams(searchParams, { replace: true });
    }

    const searchQ = searchParams.get('search');
    if (searchQ) {
      setFilters(prev => ({ ...prev, search: searchQ }));
    }
  }, [searchParams, getTaskById, setSearchParams]);

  // Apply filters and sorting
  // Include completed tasks if searching or filter specifically requests it
  let activeTasks = tasks.filter(t => !t.completed || filters.search);
  let processedTasks = filterTasks(activeTasks, filters);
  processedTasks = sortTasks(processedTasks, sortBy);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{activeTasks.length} active tasks</p>
        </div>
        <Button 
          variant="primary" 
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Add Task
        </Button>
      </div>

      <QuickAdd />

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="mt-6">
        <TaskList 
          tasks={processedTasks}
          emptyTitle="No tasks found"
          emptyDescription="Try adjusting your filters or add a new task."
        />
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {activeTaskDetails && (
        <TaskDetails
          task={activeTaskDetails}
          isOpen={!!activeTaskDetails}
          onClose={() => setActiveTaskDetails(null)}
        />
      )}
    </motion.div>
  );
}
