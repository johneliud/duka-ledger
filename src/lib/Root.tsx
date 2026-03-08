import { useEffect } from 'react';
import { db } from '../db/powersync';

export function Root({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		db.init().then(() => {
			if (typeof window !== 'undefined') {
				(window as unknown as { db: typeof db }).db = db;
			}
		}).catch((error: Error) => {
			console.error('Failed to initialize database:', error);
		});
	}, []);

	return <>{children}</>;
}
