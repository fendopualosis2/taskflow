import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Info, TrendingUp, AlertTriangle, Flame } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import ProgressRing from '../components/ui/ProgressRing';

const PRIORITY_COLORS = {
  low: '#3B82F6',
  medium: '#EAB308',
  high: '#F97316',
  urgent: '#EF4444'
};

export default function Analytics() {
  const { tasks, projects, stats } = useTask();
  const { isDark } = useTheme();

  // Generate chart data
  const { areaData, barData, pieData, projectProgress, streak } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Area data: last 14 days
    const area = [];
    for(let i=13; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tasks.filter(t => (t.completed || t.status === 'done') && t.completedAt && t.completedAt.startsWith(dateStr)).length;
      area.push({ date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count });
    }

    // Bar data: this week
    const bar = [];
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    for(let i=0; i<7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const count = tasks.filter(t => (t.completed || t.status === 'done') && t.completedAt && t.completedAt.startsWith(dateStr)).length;
      bar.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), tasks: count });
    }

    // Pie data: Priority of tasks
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});
    const pie = Object.keys(priorityCounts).map(key => ({ name: key, value: priorityCounts[key] })).filter(d => d.value > 0);

    // Project progress
    const projProgress = projects.map(p => {
      const pTasks = tasks.filter(t => t.projectId === p.id);
      const pComp = pTasks.filter(t => t.completed || t.status === 'done').length;
      const rate = pTasks.length ? Math.round((pComp/pTasks.length)*100) : 0;
      return { ...p, rate, total: pTasks.length };
    }).sort((a,b) => b.rate - a.rate);

    // Streak calculation
    let currentStreak = 0;
    let checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompleted = tasks.some(t => (t.completed || t.status === 'done') && t.completedAt && t.completedAt.startsWith(dateStr));
      if (hasCompleted) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { areaData: area, barData: bar, pieData: pie, projectProgress: projProgress, streak: currentStreak };
  }, [tasks, projects]);

  const completedThisWeek = barData.reduce((acc, curr) => acc + curr.tasks, 0);
  const mostCommonPriority = pieData.sort((a,b) => b.value - a.value)[0]?.name || 'none';

  const chartTextColor = isDark ? '#ffffff40' : '#9ca3af';
  const gridColor = isDark ? '#ffffff10' : '#e5e7eb';
  const areaStroke = isDark ? '#a78bfa' : '#7c3aed';
  const areaFill = isDark ? '#8b5cf633' : '#8b5cf61a';
  const barFill = isDark ? '#8b5cf6' : '#7c3aed';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productivity Analytics</h1>
          <p className="text-gray-500 dark:text-white/60 mt-1">Insights into your work patterns and progress</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-bold">
          <Flame className="w-5 h-5" />
          {streak} Day Streak
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-start gap-4">
          <div className="p-3 bg-violet-100 dark:bg-violet-500/20 rounded-lg text-violet-600 dark:text-violet-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{completedThisWeek}</div>
            <div className="text-sm text-gray-500 dark:text-white/60">Tasks completed this week</div>
          </div>
        </div>
        
        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold capitalize">{mostCommonPriority}</div>
            <div className="text-sm text-gray-500 dark:text-white/60">Most common priority</div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats?.overdue || 0}</div>
            <div className="text-sm text-gray-500 dark:text-white/60">Overdue tasks</div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <div className="text-sm text-gray-500 dark:text-white/60">Overall Completion</div>
          </div>
          <ProgressRing progress={stats?.completionRate || 0} size={60} strokeWidth={6} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Tasks over time */}
        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Tasks Completed (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={areaStroke} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={areaStroke} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="date" stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: isDark ? '#0F1629' : '#fff', border: `1px solid ${gridColor}`, borderRadius: '8px' }}
                itemStyle={{ color: areaStroke }}
              />
              <Area type="monotone" dataKey="count" stroke={areaStroke} strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Weekly Productivity */}
        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="day" stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTextColor} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: isDark ? '#ffffff10' : '#0000000a' }}
                contentStyle={{ backgroundColor: isDark ? '#0F1629' : '#fff', border: `1px solid ${gridColor}`, borderRadius: '8px' }}
              />
              <Bar dataKey="tasks" fill={barFill} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Tasks by Priority */}
        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl h-[400px] flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Tasks by Priority</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#9CA3AF'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#0F1629' : '#fff', border: `1px solid ${gridColor}`, borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map(entry => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[entry.name] || '#9CA3AF' }} />
                <span className="text-sm capitalize">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress */}
        <div className="p-6 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl h-[400px] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
          {projectProgress.length === 0 ? (
            <p className="text-gray-500 dark:text-white/50 text-center mt-10">No projects to display</p>
          ) : (
            <div className="space-y-6">
              {projectProgress.map(proj => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{proj.name}</span>
                    <span className="text-gray-500 dark:text-white/60">{proj.rate}% ({proj.total} tasks)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${proj.rate}%`, backgroundColor: proj.color || '#8B5CF6' }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
