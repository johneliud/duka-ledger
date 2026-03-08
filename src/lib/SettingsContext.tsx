import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SettingsContextType {
  lowStockThreshold: number;
  setLowStockThreshold: (value: number) => void;
  profitMargin: number;
  setProfitMargin: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lowStockThreshold, setLowStockThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem('lowStockThreshold');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [profitMargin, setProfitMarginState] = useState<number>(() => {
    const saved = localStorage.getItem('profitMargin');
    return saved ? parseFloat(saved) : 0;
  });

  const setLowStockThreshold = (value: number) => {
    setLowStockThresholdState(value);
    localStorage.setItem('lowStockThreshold', value.toString());
  };

  const setProfitMargin = (value: number) => {
    setProfitMarginState(value);
    localStorage.setItem('profitMargin', value.toString());
  };

  useEffect(() => {
    localStorage.setItem('lowStockThreshold', lowStockThreshold.toString());
  }, [lowStockThreshold]);

  useEffect(() => {
    localStorage.setItem('profitMargin', profitMargin.toString());
  }, [profitMargin]);

  return (
    <SettingsContext.Provider value={{ lowStockThreshold, setLowStockThreshold, profitMargin, setProfitMargin }}>
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
