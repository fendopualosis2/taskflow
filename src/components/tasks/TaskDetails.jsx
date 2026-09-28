import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CATEGORIES, PRIORITIES, STATUSES, toInputDate, formatFullDate } from '../../utils/helpers';
import { Calendar, Clock, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

export default function TaskDetails({ task, isOpen, onClose }) {
  const { updateTask, deleteTask, projects, toggleComplete, getTaskById } = useTask();
  const { showToast } = useToast();
  const currentTask = (task?.id && getTaskById(task.id)) || task;
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentTask) {
      setFormData({
        title: currentTask.title || '',
        description: currentTask.description || '',
        priority: currentTask.priority || 'medium',
        status: currentTask.status || 'todo',
        dueDate: currentTask.dueDate ? toInputDate(currentTask.dueDate) : '',
        projectId: currentTask.projectId || '',
        category: currentTask.category || ''
      });
    }
  }, [currentTask]);

  if (!currentTask) return null;

  const handleChange = (field, valueOrEvent) => {
    const value = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent
      ? valueOrEvent.target.value
      : valueOrEvent;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-save logic
    const updateData = { [field]: field === 'dueDate' ? (value ? new Date(value).toISOString() : null) : value };
    updateTask(currentTask.id, updateData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(currentTask.id);
      showToast({ message: 'Task deleted', type: 'info' });
      onClose();
    }
  };

  const handleToggleComplete = () => {
    toggleComplete(currentTask.id);
    showToast({ 
      message: currentTask.completed ? 'Task reopened' : 'Task completed', 
      type: 'success' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="flex flex-col gap-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/10">
          <Button 
            variant={currentTask.completed ? "outline" : "primary"}
            size="sm"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleToggleComplete}
          >
            {currentTask.completed ? "Reopen Task" : "Mark Complete"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            Delete
          </Button>
        </div>

        {/* Edit Form */}
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none min-h-[120px]"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority || 'medium'}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={PRIORITIES.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))}
            />
            <Select
              label="Status"
              value={formData.status || 'todo'}
              onChange={(e) => handleChange('status', e.target.value)}
              options={STATUSES.map(s => ({ value: s, label: s.replace('-', ' ').toUpperCase() }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Due Date"
              value={formData.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
            />
            <Select
              label="Project"
              value={formData.projectId || ''}
              onChange={(e) => handleChange('projectId', e.target.value)}
              options={[
                { value: '', label: 'No Project' },
                ...projects.map(p => ({ value: p.id, label: p.name }))
              ]}
            />
          </div>
          
          <Select
            label="Category"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
          />
        </div>

        {/* Timeline Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Created {formatFullDate(currentTask.createdAt)}</span>
            </div>
            {currentTask.completedAt && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed {formatFullDate(currentTask.completedAt)}</span>
              </div>
            )}
            {currentTask.updatedAt && currentTask.updatedAt !== currentTask.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-4 h-4" />
                <span>Last updated {formatFullDate(currentTask.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
