import { useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { CircleCheck, Clock, RefreshCw, AlertCircle, X } from 'lucide-react';

export function SyncBadge() {
	const { isOnline } = useNetworkStatus();
	const [showDrawer, setShowDrawer] = useState(false);
	const [pendingCount] = useState(0); // TODO: Get from PowerSync ps_crud table
	const [isSyncing] = useState(false); // TODO: Get from PowerSync sync status
	const [lastSyncTime] = useState(new Date());

	const getSyncStatus = () => {
		if (!isOnline) return { icon: AlertCircle, text: 'Offline', color: 'text-primary', bgColor: 'bg-primary/10' };
		if (isSyncing) return { icon: RefreshCw, text: 'Syncing...', color: 'text-accent', bgColor: 'bg-accent/10' };
		if (pendingCount > 0) return { icon: Clock, text: `${pendingCount} pending`, color: 'text-accent', bgColor: 'bg-accent/10' };
		return { icon: CircleCheck, text: 'All synced', color: 'text-secondary', bgColor: 'bg-secondary/10' };
	};

	const status = getSyncStatus();
	const Icon = status.icon;

	return (
		<>
			{/* Badge */}
			<button
				onClick={() => setShowDrawer(true)}
				className={`fixed top-24 right-4 z-30 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg ${status.bgColor} ${status.color} flex items-center gap-2`}
			>
				<Icon size={16} className={isSyncing ? 'animate-spin' : ''} />
				{status.text}
			</button>

			{/* Drawer */}
			{showDrawer && (
				<div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-end p-4">
					<div className="bg-surface border border-border rounded-lg w-full max-w-sm mt-20 shadow-xl animate-slideIn">
						<div className="flex items-center justify-between p-4 border-b border-border">
							<h3 className="font-bold text-text">Sync Status</h3>
							<button
								onClick={() => setShowDrawer(false)}
								className="p-1 text-muted hover:text-text rounded"
							>
								<X size={20} />
							</button>
						</div>
						
						<div className="p-4 space-y-4">
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${status.bgColor}`}>
									<Icon size={24} className={`${status.color} ${isSyncing ? 'animate-spin' : ''}`} />
								</div>
								<div>
									<div className="font-medium text-text">{status.text}</div>
									<div className="text-xs text-muted">
										{isOnline ? 'Connected' : 'No internet connection'}
									</div>
								</div>
							</div>

							<div className="pt-4 border-t border-border space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted">Last synced</span>
									<span className="text-text font-medium">
										{lastSyncTime.toLocaleTimeString()}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted">Pending changes</span>
									<span className="text-text font-medium">{pendingCount}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted">Network status</span>
									<span className={`font-medium ${isOnline ? 'text-secondary' : 'text-primary'}`}>
										{isOnline ? 'Online' : 'Offline'}
									</span>
								</div>
							</div>

							{pendingCount > 0 && (
								<div className="pt-4 border-t border-border">
									<div className="text-xs text-muted mb-2">Pending Records</div>
									<div className="space-y-1 max-h-40 overflow-y-auto">
										{/* TODO: Map through pending records from ps_crud */}
										<div className="text-sm text-text bg-bg p-2 rounded">
											Sample pending record
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
