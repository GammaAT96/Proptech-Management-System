import React, { ReactNode, useEffect, createContext, useContext } from 'react';

interface DialogContextValue {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}
const DialogContext = createContext<DialogContextValue>({ open: false });

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open = false, onOpenChange, children }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ className = '', children }) => {
  const { open, onOpenChange } = useContext(DialogContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" aria-modal role="dialog">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={`relative z-10 rounded bg-white p-6 shadow-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

export const DialogDescription = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

export const DialogFooter = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 flex justify-end gap-2">{children}</div>
);

interface DialogTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ asChild, children }) => {
  const { onOpenChange } = useContext(DialogContext);
  const openDialog = () => onOpenChange?.(true);
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props?.onClick?.(e);
        openDialog();
      },
    });
  }
  return <div onClick={openDialog} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openDialog()}>{children}</div>;
};
