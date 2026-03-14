import React from 'react';

export const Textarea = ({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  );
};

