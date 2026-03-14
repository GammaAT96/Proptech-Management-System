import React, { createContext, useContext, useState } from 'react';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, defaultValue, onValueChange, children }) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');

  const currentValue = value !== undefined ? value : internalValue;

  const setValue = (next: string) => {
    if (onValueChange) onValueChange(next);
    if (value === undefined) setInternalValue(next);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="mb-4 flex gap-2 border-b">{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    return (
      <button className="px-3 py-2 text-sm" type="button">
        {children}
      </button>
    );
  }

  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-2 text-sm ${
        isActive ? 'border-b-2 border-black font-semibold' : 'text-gray-600'
      }`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const ctx = useContext(TabsContext);
  if (!ctx || (value && ctx.value !== value)) return null;
  return <div>{children}</div>;
};

