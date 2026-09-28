import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { cn } from '../../utils/helpers';

export default function FilterBar({ filters, onFiltersChange, sortBy, onSortChange, showSearch = true }) {
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'high-priority', label: 'High Priority' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'overdue', label: 'Overdue' }
  ];

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created' },
    { value: 'title', label: 'Alphabetical' }
  ];

  const handleFilterClick = (filterId) => {
    // Build new filters matching filterTasks() API
    let newFilters = {};
    // Preserve search if any
    if (filters.search) newFilters.search = filters.search;
    
    if (filterId === 'today') {
      newFilters.today = true;
    } else if (filterId === 'upcoming') {
      newFilters.upcoming = true;
    } else if (filterId === 'high-priority') {
      newFilters.priority = 'high';
    } else if (filterId === 'in-progress') {
      newFilters.status = 'in-progress';
    } else if (filterId === 'overdue') {
      newFilters.status = 'overdue';
    }
    
    newFilters._activeQuickFilter = filterId;
    onFiltersChange(newFilters);
  };

  const activeQuickFilter = filters._activeQuickFilter || 'all';

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1E2536] p-3 rounded-xl border border-gray-200 dark:border-white/10">
      
      <div className="flex-1 w-full overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 md:pb-0">
        <Filter className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
        {filterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => handleFilterClick(option.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeQuickFilter === option.id
                ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {showSearch && (
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="py-1.5 pl-2 pr-8 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none appearance-none"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="dark:bg-gray-800">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
