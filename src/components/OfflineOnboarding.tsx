import { WifiOff } from 'lucide-react';

export function OfflineOnboarding() {
	return (
		<div className="min-h-screen bg-bg flex items-center justify-center p-4">
			<div className="bg-surface border border-border rounded-lg p-8 max-w-md text-center">
				<WifiOff className="text-muted mx-auto mb-4" size={48} />
				<h1 className="text-2xl font-bold text-text mb-2">You're Offline</h1>
				<p className="text-muted mb-6">
					Duka Ledger works offline, but you need to be online for your first login.
					Please connect to the internet and try again.
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-accent transition-colors"
				>
					Retry
				</button>
			</div>
		</div>
	);
}
