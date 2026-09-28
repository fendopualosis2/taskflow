import React, { useState } from 'react';
import { Moon, Sun, Monitor, Bell, Clock, PieChart, ShieldAlert } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Settings() {
  const { settings, updateSettings } = useTask();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    name: settings?.profile?.name || 'User',
    email: settings?.profile?.email || 'user@example.com'
  });

  const [prefs, setPrefs] = useState({
    defaultPriority: settings?.preferences?.defaultPriority || 'medium',
    defaultView: settings?.preferences?.defaultView || 'dashboard',
    startPage: settings?.preferences?.startPage || 'dashboard'
  });

  const handleSaveProfile = () => {
    updateSettings({ profile: profileData, preferences: prefs });
    showToast({ message: 'Settings saved successfully', type: 'success' });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleNotification = (key) => {
    const current = settings?.notifications || {};
    updateSettings({ notifications: { ...current, [key]: !current[key] } });
  };

  const notifications = settings?.notifications || { taskReminders: true, deadlineNotifications: true, productivitySummaries: true };

  // Simple Toggle Switch Component
  const Switch = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-white/60 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation Sidebar (optional for larger screens, but we'll use a stacked layout for simplicity) */}
        
        <div className="md:col-span-3 space-y-6">
          
          {/* Appearance */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Appearance</h2>
            <div className="flex gap-4">
              {[
                { id: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light' },
                { id: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark' },
                { id: 'system', icon: <Monitor className="w-5 h-5" />, label: 'System' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === t.id ? 'border-violet-600 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-600 dark:text-white/60'}`}
                >
                  {t.icon}
                  <span className="mt-2 font-medium capitalize">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Profile */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Profile Details</h2>
            <div className="space-y-4 max-w-md">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
              />
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={e => setProfileData({...profileData, email: e.target.value})}
              />
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Default Priority</label>
                <select 
                  value={prefs.defaultPriority} 
                  onChange={e => { setPrefs({...prefs, defaultPriority: e.target.value}); handleSaveProfile(); }}
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#0F1629] border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Start Page</label>
                <select 
                  value={prefs.startPage} 
                  onChange={e => { setPrefs({...prefs, startPage: e.target.value}); handleSaveProfile(); }}
                  className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#0F1629] border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-violet-500 outline-none text-gray-900 dark:text-white"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="tasks">Tasks List</option>
                  <option value="today">Today View</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-white/10 pb-2">Notifications</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"><Bell className="w-5 h-5"/></div>
                  <div>
                    <div className="font-medium">Task Reminders</div>
                    <div className="text-sm text-gray-500 dark:text-white/60">Get notified about upcoming tasks</div>
                  </div>
                </div>
                <Switch checked={notifications.taskReminders} onChange={() => toggleNotification('taskReminders')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400"><Clock className="w-5 h-5"/></div>
                  <div>
                    <div className="font-medium">Deadline Alerts</div>
                    <div className="text-sm text-gray-500 dark:text-white/60">Notifications for overdue tasks</div>
                  </div>
                </div>
                <Switch checked={notifications.deadlineNotifications} onChange={() => toggleNotification('deadlineNotifications')} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400"><PieChart className="w-5 h-5"/></div>
                  <div>
                    <div className="font-medium">Productivity Summaries</div>
                    <div className="text-sm text-gray-500 dark:text-white/60">Weekly reports on your progress</div>
                  </div>
                </div>
                <Switch checked={notifications.productivitySummaries} onChange={() => toggleNotification('productivitySummaries')} />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
              Permanently delete all your tasks, projects, and settings. This action cannot be undone.
            </p>
            <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleResetData}>
              Reset All Data
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
