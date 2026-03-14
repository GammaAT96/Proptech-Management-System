import React from 'react';

export const Avatar = ({ children, className = '' }: any) => (
  <div
    className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm ${className}`}
  >
    {children}
  </div>
);

export const AvatarFallback = ({ children }: any) => <span>{children}</span>;

export const AvatarImage = ({ src, alt }: { src?: string; alt?: string }) =>
  src ? <img src={src} alt={alt} className="h-full w-full rounded-full object-cover" /> : null;

