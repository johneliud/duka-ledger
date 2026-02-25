import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
  lowStockThreshold: number;
  setLowStockThreshold: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lowStockThreshold, setLowStockThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem('lowStockThreshold');
    return saved ? parseInt(saved, 10) : 5;
  });

  const setLowStockThreshold = (value: number) => {
    setLowStockThresholdState(value);
    localStorage.setItem('lowStockThreshold', value.toString());
  };

  useEffect(() => {
    localStorage.setItem('lowStockThreshold', lowStockThreshold.toString());
  }, [lowStockThreshold]);

  return (
    <SettingsContext.Provider value={{ lowStockThreshold, setLowStockThreshold }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
