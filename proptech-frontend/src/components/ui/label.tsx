import React from 'react';

export const Label = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
};

