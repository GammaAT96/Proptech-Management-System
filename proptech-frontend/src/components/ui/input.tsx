import React from 'react';

export const Input = ({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  );
};

