import React from 'react';

export const ScrollArea = ({ children, className = '' }: any) => (
  <div className={`overflow-y-auto ${className}`}>{children}</div>
);

