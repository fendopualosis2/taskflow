import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Check, Sparkles } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function Focus() {
  const { tasks, toggleComplete } = useTask();
  const { showToast } = useToast();
  
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [mode, setMode] = useState('idle'); // idle, running, paused
  const [activePreset, setActivePreset] = useState('25'); // '25' | '50' | 'custom'
  const [customMinutes, setCustomMinutes] = useState('15');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  
  const timerRef = useRef(null);
  
  const incompleteTasks = tasks.filter(t => !t.completed && t.status !== 'done');
  const activeTask = tasks.find(t => t.id === selectedTaskId);
  
  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setMode('running');
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setMode('idle');
          showToast({ 
            message: activeTask ? `Focus session completed for "${activeTask.title}"!` : 'Focus session completed! Great job.', 
            type: 'success' 
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setMode('paused');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setMode('idle');
    if (timerRef.current) clearInterval(timerRef.current);
    const mins = activePreset === 'custom' ? (parseInt(customMinutes) || 25) : (parseInt(activePreset) || 25);
    setTimeLeft(mins * 60);
    setTotalTime(mins * 60);
  };

  const completeTaskEarly = () => {
    if (selectedTaskId) {
      toggleComplete(selectedTaskId);
      showToast({ message: 'Task marked as complete!', type: 'success' });
      setSelectedTaskId('');
    } else {
      showToast({ message: 'Focus session completed!', type: 'success' });
    }
    resetTimer();
  };

  const handleSelectPreset = (preset) => {
    setActivePreset(preset);
    let mins = 25;
    if (preset === '25') mins = 25;
    else if (preset === '50') mins = 50;
    else if (preset === 'custom') mins = parseInt(customMinutes) || 15;

    if (mode === 'idle') {
      setTimeLeft(mins * 60);
      setTotalTime(mins * 60);
    }
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomMinutes(val);
    const mins = Math.max(1, Math.min(180, parseInt(val) || 1));
    if (mode === 'idle') {
      setTimeLeft(mins * 60);
      setTotalTime(mins * 60);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 transition-all duration-700 ${mode === 'running' ? 'bg-gradient-to-b from-transparent to-violet-950/20' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto text-center space-y-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Deep Work Session
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Focus Mode</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Eliminate distractions and protect your attention.</p>
        </div>

        {/* Task Selector */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Focus Task</label>
          <select 
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            disabled={mode !== 'idle'}
            className="w-full p-3 rounded-xl bg-white dark:bg-[#0F1629] border border-gray-200 dark:border-white/[0.08] shadow-sm text-gray-900 dark:text-white disabled:opacity-50 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
          >
            <option value="">General Deep Work (No specific task)</option>
            {incompleteTasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
        </div>

        {/* Presets */}
        {mode === 'idle' && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['25', '50'].map(preset => (
              <button
                key={preset}
                onClick={() => handleSelectPreset(preset)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activePreset === preset 
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25' 
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10'
                }`}
              >
                {preset} min
              </button>
            ))}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSelectPreset('custom')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activePreset === 'custom' 
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25' 
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/10'
                }`}
              >
                Custom
              </button>
              {activePreset === 'custom' && (
                <div className="flex items-center gap-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2 py-1.5 rounded-xl">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customMinutes}
                    onChange={handleCustomChange}
                    className="w-12 bg-transparent text-sm font-semibold text-center text-gray-900 dark:text-white outline-none"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">m</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timer Circular Display */}
        <div className="relative flex justify-center items-center py-4">
          {mode === 'running' && (
            <motion.div 
              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-violet-500/25 rounded-full blur-[70px] pointer-events-none" 
            />
          )}
          
          <svg width="320" height="320" className="rotate-[-90deg]">
            <circle
              cx="160"
              cy="160"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-gray-200 dark:text-white/[0.05]"
              strokeWidth="12"
            />
            <motion.circle
              cx="160"
              cy="160"
              r={radius}
              fill="transparent"
              stroke="url(#focusGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
            <defs>
              <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl font-black tracking-tight font-mono text-gray-900 dark:text-white drop-shadow-sm">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-xs font-semibold mt-3 uppercase tracking-widest ${
              mode === 'running' ? 'text-violet-500 animate-pulse' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {mode === 'running' ? 'Focusing' : mode === 'paused' ? 'Paused' : 'Ready'}
            </span>
            {activeTask && (
              <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate mt-1">
                {activeTask.title}
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {mode === 'idle' ? (
            <Button size="lg" onClick={startTimer} className="w-48 rounded-full h-14 text-base font-semibold shadow-lg shadow-violet-500/25">
              <Play className="w-5 h-5 mr-2 fill-current" /> Start Focus
            </Button>
          ) : (
            <>
              {mode === 'running' ? (
                <Button size="lg" variant="secondary" onClick={pauseTimer} className="w-14 h-14 rounded-full p-0 flex items-center justify-center">
                  <Pause className="w-6 h-6 fill-current" />
                </Button>
              ) : (
                <Button size="lg" onClick={startTimer} className="w-14 h-14 rounded-full p-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white">
                  <Play className="w-6 h-6 ml-0.5 fill-current" />
                </Button>
              )}
              
              <Button size="lg" variant="ghost" onClick={resetTimer} className="w-14 h-14 rounded-full p-0 flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10" title="Reset Timer">
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              {selectedTaskId && (
                <Button size="lg" onClick={completeTaskEarly} className="w-14 h-14 rounded-full p-0 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white" title="Mark Task Complete & Stop">
                  <Check className="w-6 h-6" />
                </Button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
