import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { cn } from '../../utils/helpers';

const EmptyState = ({ icon: Icon, title, description, action, className }) => {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    const IconComp = Icon;
    return <IconComp className="w-10 h-10 text-violet-500 dark:text-violet-400" />;
  };

  const renderAction = () => {
    if (!action) return null;
    if (React.isValidElement(action)) return action;
    if (action.label) {
      return (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      {Icon && (
        <motion.div 
          initial={{ y: 5 }}
          animate={{ y: -5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="mb-6 p-5 rounded-full bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]"
        >
          {renderIcon()}
        </motion.div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 mb-8">
        {description}
      </p>
      
      {renderAction()}
    </div>
  );
};

export default EmptyState;
