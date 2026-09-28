import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, FolderKanban, ListTodo, CircleCheck, Clock, AlertTriangle } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import ProgressRing from '../components/ui/ProgressRing';
import TaskList from '../components/tasks/TaskList';
import TaskModal from '../components/tasks/TaskModal';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, getTasksByProject } = useTask();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const project = getProjectById(id);
  const projectTasks = getTasksByProject(id);
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <FolderKanban className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project not found</h2>
        <p className="text-gray-500 dark:text-white/60 mb-6">The project you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  const completedTasks = projectTasks.filter(t => t.status === 'done' || t.completed);
  const pendingTasks = projectTasks.filter(t => t.status !== 'done' && !t.completed);
  const overdueTasks = pendingTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
  
  const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/projects')}
          className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-white/60 dark:hover:bg-white/10 transition-colors"
          aria-label="Back to projects"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color || '#8B5CF6' }} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        </div>
      </div>
      
      {project.description && (
        <p className="text-gray-600 dark:text-white/70 max-w-3xl ml-10">
          {project.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Tasks" 
          value={projectTasks.length} 
          icon={ListTodo} 
          color="violet"
        />
        <StatCard 
          label="Completed" 
          value={completedTasks.length} 
          icon={CircleCheck} 
          color="emerald" 
        />
        <StatCard 
          label="In Progress" 
          value={pendingTasks.length} 
          icon={Clock} 
          color="blue"
        />
        <StatCard 
          label="Overdue" 
          value={overdueTasks.length} 
          icon={AlertTriangle} 
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="w-full flex flex-col items-center p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 w-full text-left">Project Progress</h3>
          <ProgressRing 
            value={progress} 
            size={160} 
            strokeWidth={12} 
            color={project.color || "#8B5CF6"} 
          />
          <div className="mt-6 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{progress}%</div>
            <div className="text-sm text-gray-500 dark:text-white/50 mt-1">
              {completedTasks.length} of {projectTasks.length} tasks completed
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Tasks</h2>
            <Button 
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsTaskModalOpen(true)}
            >
              Add Task
            </Button>
          </div>
          
          <TaskList 
            tasks={projectTasks}
            emptyTitle="No tasks in this project"
            emptyDescription="Add your first task to this project to start tracking your progress."
          />
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        defaultProjectId={project.id} 
      />
    </motion.div>
  );
}
