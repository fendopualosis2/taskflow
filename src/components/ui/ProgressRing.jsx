import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const ProgressRing = ({ 
  value = 0,
  progress, 
  size = 120, 
  strokeWidth = 8, 
  className, 
  label, 
  showValue = true,
  color
}) => {
  const actualValue = progress !== undefined ? progress : value;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(actualValue, 0), 100);
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color || "#8b5cf6"} />
            <stop offset="100%" stopColor={color || "#06b6d4"} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-white/[0.05]"
        />
        
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color || `url(#gradient-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
        />
      </svg>
      
      {(showValue || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {showValue && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {Math.round(safeValue)}%
            </span>
          )}
          {label && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
