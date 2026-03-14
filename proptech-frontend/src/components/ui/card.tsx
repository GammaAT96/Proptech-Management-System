import React from 'react';

export const Card = ({ children, className = '' }: any) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>
);

export const CardHeader = ({ children }: any) => (
  <div className="border-b p-4">{children}</div>
);

export const CardContent = ({ children }: any) => <div className="p-4">{children}</div>;

export const CardTitle = ({ children }: any) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

export const CardDescription = ({ children }: any) => (
  <p className="text-sm text-gray-500">{children}</p>
);

