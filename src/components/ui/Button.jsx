import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  className, 
  disabled, 
  loading, 
  ...rest 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
  
  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-transparent',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] dark:text-white border border-gray-200 dark:border-white/[0.06]',
    outline: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-white/[0.05] dark:text-gray-300 border border-gray-300 dark:border-white/20',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-white/[0.05] dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-transparent dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20'
  };
  
  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  const renderIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    const IconComponent = Icon;
    return <IconComponent className={cn(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />;
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant] || variants.primary,
        sizes[size],
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {renderIcon()}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
