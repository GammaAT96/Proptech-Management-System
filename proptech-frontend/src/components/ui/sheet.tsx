import React, { ReactNode, useEffect, createContext, useContext } from 'react';

interface SheetContextValue {
  onOpenChange?: (open: boolean) => void;
}
const SheetContext = createContext<SheetContextValue>({});

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({ open = false, onOpenChange, children }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <SheetContext.Provider value={{ onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

interface SheetContentProps {
  side?: 'left' | 'right';
  className?: string;
  children: ReactNode;
}

export const SheetContent: React.FC<SheetContentProps> = ({ side = 'left', className = '', children }) => {
  const { onOpenChange } = useContext(SheetContext);

  return (
    <div className="fixed inset-0 z-50" aria-modal role="dialog">
      <div
        className="fixed inset-0 bg-black/30"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full w-64 bg-white shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
