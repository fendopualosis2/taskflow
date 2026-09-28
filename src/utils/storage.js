// Storage keys
export const KEYS = {
  TASKS: 'taskflow_tasks',
  PROJECTS: 'taskflow_projects',
  SETTINGS: 'taskflow_settings',
  THEME: 'taskflow_theme',
  INITIALIZED: 'taskflow_initialized',
};

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // silent
  }
}
