import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function SyncBadge() {
	const { isOnline, wasOffline } = useNetworkStatus();

	return (
		<div
			style={{
				position: 'fixed',
				top: '1rem',
				right: '1rem',
				padding: '0.5rem 1rem',
				borderRadius: '0.5rem',
				backgroundColor: isOnline ? 'var(--secondary)' : 'var(--muted)',
				color: 'var(--bg)',
				fontSize: '0.875rem',
				fontWeight: 'bold',
				transition: 'all 0.3s ease',
				animation: wasOffline ? 'pulse 0.5s ease-in-out 3' : 'none'
			}}
		>
			{isOnline ? '● Online' : '○ Offline'}
		</div>
	);
}
