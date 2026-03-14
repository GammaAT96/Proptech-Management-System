import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className, message }) => {
  return (
    <div className={cn('flex items-center justify-center py-8 text-muted-foreground', className)}>
      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {message ?? 'Loading...'}
    </div>
  );
};

