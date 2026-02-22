import { createContext, useState, useCallback, type ReactNode } from 'react';

type NotificationType = 'success' | 'error';

interface Notification {
	id: number;
	message: string;
	type: NotificationType;
}

interface NotificationContextType {
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = useCallback((message: string, type: NotificationType) => {
		const id = Date.now();
		setNotifications(prev => [...prev, { id, message, type }]);
		
		setTimeout(() => {
			setNotifications(prev => prev.filter(n => n.id !== id));
		}, 5000);
	}, []);

	const showSuccess = useCallback((message: string) => {
		addNotification(message, 'success');
	}, [addNotification]);

	const showError = useCallback((message: string) => {
		addNotification(message, 'error');
	}, [addNotification]);

	return (
		<NotificationContext.Provider value={{ showSuccess, showError }}>
			{children}
			<div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
				{notifications.map(notification => (
					<div
						key={notification.id}
						className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-[slideIn_0.3s_ease-out] ${
							notification.type === 'success'
								? 'bg-secondary text-bg'
								: 'bg-red-600 text-white'
						}`}
					>
						{notification.message}
					</div>
				))}
			</div>
		</NotificationContext.Provider>
	);
}
