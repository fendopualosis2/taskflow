import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Select = ({ label, value, onChange, options = [], className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors duration-200",
            "bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500",
            "dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white",
            isOpen ? "border-violet-500 ring-2 ring-violet-500/20" : ""
          )}
        >
          <span className="truncate">{selectedOption?.label || 'Select...'}</span>
          <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-10 w-full mt-1 py-1 rounded-lg border shadow-lg overflow-hidden",
                "bg-white border-gray-200",
                "dark:bg-[#0F1629] dark:border-white/[0.06] backdrop-blur-xl"
              )}
            >
              <ul className="max-h-60 overflow-y-auto outline-none">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      if (onChange) {
                        // Pass an event-like object that satisfies e.target.value, while also having a value property
                        const syntheticEvent = {
                          target: { value: option.value, name: label },
                          currentTarget: { value: option.value },
                          value: option.value
                        };
                        onChange(syntheticEvent, option.value);
                      }
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none",
                      "hover:bg-gray-100 dark:hover:bg-white/[0.05]",
                      value === option.value ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10" : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {value === option.value && <Check className="w-4 h-4" />}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Select;
