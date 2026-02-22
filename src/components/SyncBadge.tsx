import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function SyncBadge() {
	const { isOnline, wasOffline } = useNetworkStatus();

	return (
		<div
			className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-bg text-sm font-bold transition-all ${
				isOnline ? 'bg-secondary' : 'bg-muted'
			} ${wasOffline ? 'animate-pulse' : ''}`}
		>
			{isOnline ? '● Online' : '○ Offline'}
		</div>
	);
}
