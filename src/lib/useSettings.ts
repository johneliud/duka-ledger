import { useContext } from 'react';
import { SettingsContext, type SettingsContextType } from './SettingsContext';

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
