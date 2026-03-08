import { createContext } from 'react';

export interface SettingsContextType {
  lowStockThreshold: number;
  setLowStockThreshold: (value: number) => void;
  profitMargin: number;
  setProfitMargin: (value: number) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
