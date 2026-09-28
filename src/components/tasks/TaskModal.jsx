import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { CATEGORIES, toInputDate, PRIORITIES, STATUSES } from '../../utils/helpers';

export default function TaskModal({ isOpen, onClose, editTask, defaultProjectId }) {
  const { addTask, updateTask, projects } = useTask();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    projectId: defaultProjectId || '',
    category: CATEGORIES[0] || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTask && isOpen) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'medium',
        status: editTask.status || 'todo',
        dueDate: editTask.dueDate ? toInputDate(editTask.dueDate) : '',
        projectId: editTask.projectId || defaultProjectId || '',
        category: editTask.category || CATEGORIES[0] || ''
      });
      setError('');
    } else if (isOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        projectId: defaultProjectId || '',
        category: CATEGORIES[0] || ''
      });
      setError('');
    }
  }, [editTask, isOpen, defaultProjectId]);

  const handleChange = (field, valueOrEvent) => {
    const value = valueOrEvent && typeof valueOrEvent === 'object' && 'target' in valueOrEvent
      ? valueOrEvent.target.value
      : valueOrEvent;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'title' && error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    if (editTask) {
      updateTask(editTask.id, taskData);
      showToast({ message: 'Task updated successfully', type: 'success' });
    } else {
      addTask(taskData);
      showToast({ message: 'Task created successfully', type: 'success' });
    }
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTask ? "Edit Task" : "Create Task"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={error}
          placeholder="What needs to be done?"
          autoFocus
        />
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none min-h-[100px]"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            options={PRIORITIES.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={STATUSES.map(s => ({ value: s, label: s.replace('-', ' ').toUpperCase() }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
          <Select
            label="Project"
            value={formData.projectId}
            onChange={(e) => handleChange('projectId', e.target.value)}
            options={[
              { value: '', label: 'No Project' },
              ...projects.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
        </div>
        
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={CATEGORIES.map(c => ({ value: c, label: c }))}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10 mt-6">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {editTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
