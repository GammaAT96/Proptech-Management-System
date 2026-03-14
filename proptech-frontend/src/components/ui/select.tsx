import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  selectedLabel: string;
  onValueChange: (value: string, label?: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
}
const SelectContext = createContext<SelectContextValue | null>(null);

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value = '',
  onValueChange,
  disabled = false,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const handleChange = (v: string, label?: string) => {
    onValueChange(v);
    setSelectedLabel(label ?? v);
    setOpen(false);
  };
  return (
    <SelectContext.Provider
      value={{
        value,
        selectedLabel,
        onValueChange: handleChange,
        open,
        setOpen,
        disabled,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  id,
  className = '',
  children,
}) => {
  const ctx = useContext(SelectContext);
  if (!ctx) return <div className={cn('rounded border px-3 py-2', className)}>{children}</div>;
  const { open, setOpen, disabled } = ctx;
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-between rounded border border-input bg-background px-3 py-2 text-left text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => !disabled && setOpen(!open)}
    >
      {children}
    </button>
  );
};

interface SelectValueProps {
  placeholder?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = 'Select...' }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) return <span>{placeholder}</span>;
  const { value, selectedLabel } = ctx;
  const display = selectedLabel || value || placeholder;
  return <span className={value ? '' : 'text-muted-foreground'}>{display}</span>;
};

interface SelectContentProps {
  className?: string;
  children: ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({ className = '', children }) => {
  const ctx = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx?.open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx.setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ctx?.open, ctx]);

  if (!ctx?.open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

interface SelectItemProps {
  value: string;
  children: ReactNode;
}

function getItemLabel(children: ReactNode, fallback: string): string {
  if (typeof children === 'string') return children;
  if (React.isValidElement(children) && children.props?.children != null) {
    return getItemLabel(children.props.children, fallback);
  }
  return fallback;
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    return (
      <div className="cursor-pointer px-3 py-2 hover:bg-gray-100">
        {children}
      </div>
    );
  }
  const { value: selectedValue, onValueChange } = ctx;
  const label = getItemLabel(children, value);
  return (
    <div
      role="option"
      aria-selected={selectedValue === value}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
      onClick={() => onValueChange(value, label)}
    >
      {children}
    </div>
  );
};
