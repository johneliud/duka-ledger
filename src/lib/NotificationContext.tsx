import { createContext } from 'react';

export type NotificationType = 'success' | 'error';

export interface NotificationContextType {
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);
