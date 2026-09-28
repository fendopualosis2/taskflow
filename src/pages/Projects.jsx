import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderPlus } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import ProjectCard from '../components/projects/ProjectCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';

const PRESET_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#64748B', // Slate
];

export default function Projects() {
  const { projects, tasks, addProject } = useTask();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', color: PRESET_COLORS[5] });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    
    addProject({
      name: newProject.name,
      description: newProject.description,
      color: newProject.color
    });
    
    showToast({ message: 'Project created successfully', type: 'success' });
    setIsModalOpen(false);
    setNewProject({ name: '', description: '', color: PRESET_COLORS[5] });
  };

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const completedCount = projectTasks.filter(t => t.status === 'done' || t.completed).length;
    return { taskCount: projectTasks.length, completedCount };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-white/60 mt-1">Manage and track your ongoing projects ({projects.length})</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <FolderPlus className="w-4 h-4" />
          <span>New Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState 
          icon={<FolderPlus className="w-12 h-12 text-violet-500/50" />}
          title="No projects yet"
          description="Create a project to start grouping your tasks."
          action={
            <Button onClick={() => setIsModalOpen(true)}>Create First Project</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const stats = getProjectStats(project.id);
            return (
              <ProjectCard 
                key={project.id}
                project={project}
                taskCount={stats.taskCount}
                completedCount={stats.completedCount}
              />
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-6">
          <Input
            label="Project Name"
            placeholder="e.g., Website Redesign"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            required
            autoFocus
          />
          <Input
            label="Description (Optional)"
            placeholder="What is this project about?"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">
              Color Theme
            </label>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewProject({ ...newProject, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${newProject.color === color ? 'scale-125 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0F1629]' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color, borderColor: newProject.color === color ? color : 'transparent' }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newProject.name.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
