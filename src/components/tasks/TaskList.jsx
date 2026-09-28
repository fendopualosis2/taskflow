import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTask } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import TaskDetails from './TaskDetails';
import EmptyState from '../ui/EmptyState';
import { ClipboardList } from 'lucide-react';

export default function TaskList({ tasks, emptyIcon, emptyTitle, emptyDescription, showProject = true }) {
  const { toggleComplete, deleteTask } = useTask();
  const [selectedTask, setSelectedTask] = useState(null);

  if (!tasks || tasks.length === 0) {
    const Icon = emptyIcon || ClipboardList;
    return (
      <EmptyState
        icon={Icon}
        title={emptyTitle || "No tasks found"}
        description={emptyDescription || "You don't have any tasks matching this criteria."}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <TaskCard
                task={task}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onClick={setSelectedTask}
                compact={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}
