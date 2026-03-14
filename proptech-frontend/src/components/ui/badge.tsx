import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-input bg-background',
  destructive: 'bg-destructive text-destructive-foreground',
};

export const Badge = ({
  children,
  className = '',
  variant = 'default',
}: { children: React.ReactNode; className?: string; variant?: BadgeVariant }) => (
  <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', variantClasses[variant], className)}>
    {children}
  </span>
);

