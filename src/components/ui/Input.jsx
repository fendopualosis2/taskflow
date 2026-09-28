import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({ label, error, icon: Icon, className, ...rest }, ref) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "block w-full rounded-lg sm:text-sm transition-colors duration-200",
            "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
            "dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white dark:placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            Icon ? "pl-10" : "pl-3",
            "pr-3 py-2 border",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          )}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
