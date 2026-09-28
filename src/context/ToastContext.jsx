import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: 'text-emerald-500' },
  error:   { bg: 'bg-red-500/10 dark:bg-red-500/15', border: 'border-red-500/20', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
  info:    { bg: 'bg-blue-500/10 dark:bg-blue-500/15', border: 'border-blue-500/20', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500' },
  warning: { bg: 'bg-amber-500/10 dark:bg-amber-500/15', border: 'border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', icon: 'text-amber-500' },
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(({ message, type = 'success', duration = 3500 }) => {
    const id = ++idCounter;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    timersRef.current[id] = setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
          <AnimatePresence mode="popLayout">
            {toasts.map(toast => {
              const Icon = ICONS[toast.type] || Info;
              const color = COLORS[toast.type] || COLORS.info;
              return (
                <motion.div
                  key={toast.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg ${color.bg} ${color.border}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${color.icon}`} />
                  <span className={`text-sm font-medium flex-1 ${color.text}`}>{toast.message}</span>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
