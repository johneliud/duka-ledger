import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface StorageWarningProps {
	percentUsed: number;
	isCritical: boolean;
	onExport: () => void;
}

export function StorageWarning({ percentUsed, isCritical, onExport }: StorageWarningProps) {
	const [dismissed, setDismissed] = useState(false);

	if (dismissed) return null;

	return (
		<div className={`fixed top-20 left-0 right-0 z-30 mx-4 lg:mx-auto lg:max-w-4xl ${
			isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
		} border rounded-lg p-4 shadow-lg`}>
			<div className="flex items-start gap-3">
				<AlertTriangle className={isCritical ? 'text-red-600' : 'text-amber-600'} size={20} />
				<div className="flex-1">
					<h3 className={`font-bold ${isCritical ? 'text-red-900' : 'text-amber-900'}`}>
						{isCritical ? 'Storage Critical' : 'Storage Almost Full'}
					</h3>
					<p className={`text-sm ${isCritical ? 'text-red-700' : 'text-amber-700'} mt-1`}>
						{isCritical 
							? `Device storage is ${percentUsed.toFixed(0)}% full. New records may fail to save.`
							: `Device storage is ${percentUsed.toFixed(0)}% full. Consider exporting old records.`
						}
					</p>
					<button
						onClick={onExport}
						className={`mt-2 text-sm font-medium underline ${
							isCritical ? 'text-red-800 hover:text-red-900' : 'text-amber-800 hover:text-amber-900'
						}`}
					>
						Export to CSV
					</button>
				</div>
				<button
					onClick={() => setDismissed(true)}
					className="text-muted hover:text-text"
					aria-label="Dismiss"
				>
					<X size={20} />
				</button>
			</div>
		</div>
	);
}
