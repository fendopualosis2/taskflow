import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { getItem, setItem, KEYS } from '../utils/storage';
import { seedTasks, seedProjects, defaultSettings } from '../data/seedData';
import { generateId, getStats, isOverdue } from '../utils/helpers';

const TaskContext = createContext(null);

function loadInitialData() {
  const initialized = getItem(KEYS.INITIALIZED);
  if (initialized) {
    return {
      tasks: getItem(KEYS.TASKS) || [],
      projects: getItem(KEYS.PROJECTS) || [],
      settings: { ...defaultSettings, ...(getItem(KEYS.SETTINGS) || {}) },
    };
  }
  // First visit — seed data
  setItem(KEYS.INITIALIZED, true);
  setItem(KEYS.TASKS, seedTasks);
  setItem(KEYS.PROJECTS, seedProjects);
  setItem(KEYS.SETTINGS, defaultSettings);
  return {
    tasks: seedTasks,
    projects: seedProjects,
    settings: defaultSettings,
  };
}

export function TaskProvider({ children }) {
  const [data, setData] = useState(loadInitialData);

  // Persist on change
  useEffect(() => {
    setItem(KEYS.TASKS, data.tasks);
  }, [data.tasks]);
  useEffect(() => {
    setItem(KEYS.PROJECTS, data.projects);
  }, [data.projects]);
  useEffect(() => {
    setItem(KEYS.SETTINGS, data.settings);
  }, [data.settings]);

  // ─── Task CRUD ───
  const addTask = useCallback((taskData) => {
    const now = new Date().toISOString();
    const newTask = {
      id: generateId(),
      title: taskData.title || '',
      description: taskData.description || '',
      completed: false,
      status: taskData.status || 'todo',
      priority: taskData.priority || data.settings.preferences?.defaultPriority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      projectId: taskData.projectId || null,
      category: taskData.category || null,
    };
    setData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    return newTask;
  }, [data.settings]);

  const updateTask = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
        // Handle completion state changes
        if (updates.completed === true && !t.completed) {
          updated.completedAt = new Date().toISOString();
          updated.status = 'done';
        }
        if (updates.completed === false && t.completed) {
          updated.completedAt = null;
          if (updated.status === 'done') updated.status = 'todo';
        }
        return updated;
      }),
    }));
  }, []);

  const deleteTask = useCallback((id) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const toggleComplete = useCallback((id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id !== id) return t;
        const completed = !t.completed;
        return {
          ...t,
          completed,
          status: completed ? 'done' : 'todo',
          completedAt: completed ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  // ─── Project CRUD ───
  const addProject = useCallback((projectData) => {
    const newProject = {
      id: generateId(),
      name: projectData.name || '',
      description: projectData.description || '',
      color: projectData.color || '#8B5CF6',
      icon: projectData.icon || 'folder',
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
    return newProject;
  }, []);

  const updateProject = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const deleteProject = useCallback((id) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.map(t => t.projectId === id ? { ...t, projectId: null } : t),
    }));
  }, []);

  // ─── Helpers ───
  const getTasksByProject = useCallback((projectId) => {
    return data.tasks.filter(t => t.projectId === projectId);
  }, [data.tasks]);

  const getProjectById = useCallback((id) => {
    return data.projects.find(p => p.id === id) || null;
  }, [data.projects]);

  const getTaskById = useCallback((id) => {
    return data.tasks.find(t => t.id === id) || null;
  }, [data.tasks]);

  // ─── Settings ───
  const updateSettings = useCallback((updates) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // ─── Computed stats ───
  const stats = useMemo(() => getStats(data.tasks), [data.tasks]);

  const value = useMemo(() => ({
    tasks: data.tasks,
    projects: data.projects,
    settings: data.settings,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    addProject,
    updateProject,
    deleteProject,
    getTasksByProject,
    getProjectById,
    getTaskById,
    updateSettings,
  }), [data, stats, addTask, updateTask, deleteTask, toggleComplete, addProject, updateProject, deleteProject, getTasksByProject, getProjectById, getTaskById, updateSettings]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTask must be inside TaskProvider');
  return ctx;
}
