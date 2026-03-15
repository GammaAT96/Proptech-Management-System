import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
  className?: string;
};

export const Label = ({ children, className = '', ...props }: LabelProps) => {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
};

