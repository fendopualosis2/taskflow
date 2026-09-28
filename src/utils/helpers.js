import {
  format,
  isToday as isTodayFns,
  isTomorrow as isTomorrowFns,
  isYesterday as isYesterdayFns,
  isPast,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  parseISO,
} from 'date-fns';

// ─── ID generation ───
let counter = 0;
export function generateId() {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Class name utility ───
export function cn(...args) {
  return args.filter(Boolean).join(' ');
}

// ─── Date helpers ───
function toDate(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  return parseISO(d);
}

export function isToday(d) {
  const date = toDate(d);
  return date ? isTodayFns(date) : false;
}

export function isTomorrow(d) {
  const date = toDate(d);
  return date ? isTomorrowFns(date) : false;
}

export function isYesterday(d) {
  const date = toDate(d);
  return date ? isYesterdayFns(date) : false;
}

export function isOverdue(d, completed) {
  if (completed) return false;
  const date = toDate(d);
  if (!date) return false;
  return isBefore(endOfDay(date), new Date());
}

export function isThisWeek(d) {
  const date = toDate(d);
  if (!date) return false;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  return !isBefore(date, weekStart) && !isAfter(date, weekEnd);
}

export function isNextWeek(d) {
  const date = toDate(d);
  if (!date) return false;
  const now = new Date();
  const nextWeekStart = startOfWeek(addDays(now, 7), { weekStartsOn: 1 });
  const nextWeekEnd = endOfWeek(addDays(now, 7), { weekStartsOn: 1 });
  return !isBefore(date, nextWeekStart) && !isAfter(date, nextWeekEnd);
}

export function getDaysUntil(d) {
  const date = toDate(d);
  if (!date) return null;
  return differenceInDays(startOfDay(date), startOfDay(new Date()));
}

export function formatDate(d) {
  const date = toDate(d);
  if (!date) return '';
  return format(date, 'MMM d, yyyy');
}

export function formatShortDate(d) {
  const date = toDate(d);
  if (!date) return '';
  return format(date, 'MMM d');
}

export function formatRelativeDate(d) {
  const date = toDate(d);
  if (!date) return '';
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  const days = getDaysUntil(date);
  if (days !== null && days > 0 && days <= 7) return format(date, 'EEEE');
  if (days !== null && days < 0 && days >= -7) return `${Math.abs(days)} days ago`;
  return format(date, 'MMM d');
}

export function formatFullDate(d) {
  const date = toDate(d);
  if (!date) return '';
  return format(date, 'EEEE, MMMM d');
}

export function formatTime(d) {
  const date = toDate(d);
  if (!date) return '';
  return format(date, 'h:mm a');
}

export function toInputDate(d) {
  const date = toDate(d);
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

// ─── Priority ───
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: 'emerald', textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20', dotClass: 'bg-emerald-400' },
  medium: { label: 'Medium', color: 'blue',    textClass: 'text-blue-400',    bgClass: 'bg-blue-500/10',    borderClass: 'border-blue-500/20',    dotClass: 'bg-blue-400' },
  high:   { label: 'High',   color: 'amber',   textClass: 'text-amber-400',   bgClass: 'bg-amber-500/10',   borderClass: 'border-amber-500/20',   dotClass: 'bg-amber-400' },
  urgent: { label: 'Urgent', color: 'red',     textClass: 'text-red-400',     bgClass: 'bg-red-500/10',     borderClass: 'border-red-500/20',     dotClass: 'bg-red-400' },
};

// ─── Status ───
export const STATUSES = ['todo', 'in-progress', 'done'];

export const STATUS_CONFIG = {
  'todo':        { label: 'To Do',       textClass: 'text-gray-400 dark:text-white/40', bgClass: 'bg-gray-500/10 dark:bg-white/5',   dotClass: 'bg-gray-400 dark:bg-white/40' },
  'in-progress': { label: 'In Progress', textClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-500/10', dotClass: 'bg-blue-500 dark:bg-blue-400' },
  'done':        { label: 'Done',        textClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-500/10', dotClass: 'bg-emerald-500 dark:bg-emerald-400' },
};

// ─── Categories ───
export const CATEGORIES = [
  'Development', 'Design', 'Documentation', 'Research',
  'Meeting', 'Planning', 'Testing', 'Review', 'Other',
];

// ─── Productivity score ───
export function calculateProductivityScore(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const now = new Date();
  const weekAgo = addDays(now, -7);
  const recentTasks = tasks.filter(t => {
    const created = toDate(t.createdAt);
    return created && isAfter(created, weekAgo);
  });
  if (recentTasks.length === 0) {
    const completedRatio = tasks.filter(t => t.completed).length / tasks.length;
    return Math.round(completedRatio * 60);
  }
  const completedRecent = recentTasks.filter(t => t.completed).length;
  const completionRate = recentTasks.length > 0 ? completedRecent / recentTasks.length : 0;
  const overdueTasks = tasks.filter(t => !t.completed && isOverdue(t.dueDate, t.completed));
  const overduePenalty = Math.min(overdueTasks.length * 5, 25);
  const highPriorityDone = tasks.filter(t => t.completed && (t.priority === 'high' || t.priority === 'urgent')).length;
  const highPriorityBonus = Math.min(highPriorityDone * 2, 15);
  const score = Math.round(completionRate * 70 + highPriorityBonus - overduePenalty + 15);
  return Math.max(0, Math.min(100, score));
}

// ─── Group tasks by date ───
export function groupTasksByDate(tasks) {
  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    nextWeek: [],
    later: [],
    noDueDate: [],
  };

  tasks.forEach(task => {
    if (!task.dueDate) {
      groups.noDueDate.push(task);
    } else if (isOverdue(task.dueDate, task.completed)) {
      groups.overdue.push(task);
    } else if (isToday(task.dueDate)) {
      groups.today.push(task);
    } else if (isTomorrow(task.dueDate)) {
      groups.tomorrow.push(task);
    } else if (isThisWeek(task.dueDate)) {
      groups.thisWeek.push(task);
    } else if (isNextWeek(task.dueDate)) {
      groups.nextWeek.push(task);
    } else {
      groups.later.push(task);
    }
  });

  return groups;
}

// ─── Sort tasks ───
export function sortTasks(tasks, sortBy = 'dueDate', sortDir = 'asc') {
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  return [...tasks].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'dueDate': {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        cmp = da - db;
        break;
      }
      case 'priority':
        cmp = (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
        break;
      case 'createdAt': {
        const ca = new Date(a.createdAt).getTime();
        const cb = new Date(b.createdAt).getTime();
        cmp = cb - ca;
        break;
      }
      case 'title':
        cmp = (a.title || '').localeCompare(b.title || '');
        break;
      case 'completed':
        cmp = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
        break;
      default:
        cmp = 0;
    }
    return sortDir === 'desc' ? -cmp : cmp;
  });
}

// ─── Filter tasks ───
export function filterTasks(tasks, filters) {
  return tasks.filter(task => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchCat = task.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'overdue') {
        if (!isOverdue(task.dueDate, task.completed)) return false;
      } else if (task.status !== filters.status) return false;
    }
    if (filters.priority && filters.priority !== 'all') {
      if (task.priority !== filters.priority) return false;
    }
    if (filters.projectId && filters.projectId !== 'all') {
      if (task.projectId !== filters.projectId) return false;
    }
    if (filters.completed !== undefined) {
      if (task.completed !== filters.completed) return false;
    }
    if (filters.today) {
      if (!isToday(task.dueDate)) return false;
    }
    if (filters.upcoming) {
      if (!task.dueDate || isPast(endOfDay(toDate(task.dueDate)))) return false;
    }
    return true;
  });
}

// ─── Get stats ───
export function getStats(tasks) {
  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProgress = tasks.filter(t => t.status === 'in-progress' && !t.completed).length;
  const overdue = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;
  const completedToday = tasks.filter(t => {
    if (!t.completed || !t.completedAt) return false;
    return isTodayFns(toDate(t.completedAt));
  }).length;
  const dueToday = tasks.filter(t => !t.completed && isToday(t.dueDate)).length;
  const todo = tasks.filter(t => t.status === 'todo' && !t.completed).length;

  return {
    total,
    completed,
    inProgress,
    overdue,
    completedToday,
    dueToday,
    todo,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    productivityScore: calculateProductivityScore(tasks),
  };
}

// ─── Timer formatting ───
export function formatTimerDisplay(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
