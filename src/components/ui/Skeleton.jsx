import React from 'react';
import { cn } from '../../utils/helpers';

const Skeleton = ({ className, variant = 'rectangular', width, height }) => {
  const styles = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : 'auto')
  };
  
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-white/[0.05]",
        variants[variant],
        className
      )}
      style={styles}
    />
  );
};

export default Skeleton;
