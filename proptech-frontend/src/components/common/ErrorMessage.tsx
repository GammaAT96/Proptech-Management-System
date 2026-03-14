import React from 'react';
import { IconAlertCircle } from '@/components/icons/Icons';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string | null;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div className={cn('flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700', className)}>
      <IconAlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

