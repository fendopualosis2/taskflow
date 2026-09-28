import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  color = 'violet', 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "p-5 rounded-2xl border transition-all duration-300",
        "bg-white border-gray-200 hover:border-violet-200 hover:shadow-md",
        "dark:bg-white/[0.03] dark:border-white/[0.06] dark:hover:border-white/[0.1] dark:hover:bg-white/[0.05]"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        
        {Icon && (
          <div className={cn(
            "p-3 rounded-xl",
            `bg-${color}-100 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={cn(
            "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
            trendUp 
              ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10" 
              : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-500/10"
          )}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last week</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
