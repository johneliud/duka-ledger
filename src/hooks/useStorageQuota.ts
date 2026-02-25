import { useState, useEffect } from 'react';

interface StorageQuota {
	usage: number;
	quota: number;
	percentUsed: number;
	isWarning: boolean;
	isCritical: boolean;
}

export function useStorageQuota() {
	const [storageInfo, setStorageInfo] = useState<StorageQuota | null>(null);

	useEffect(() => {
		const checkStorage = async () => {
			if (!navigator.storage?.estimate) return;

			try {
				const estimate = await navigator.storage.estimate();
				const usage = estimate.usage || 0;
				const quota = estimate.quota || 0;
				const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

				setStorageInfo({
					usage,
					quota,
					percentUsed,
					isWarning: percentUsed > 80,
					isCritical: percentUsed > 95,
				});
			} catch (error) {
				console.error('[Storage] Failed to check quota:', error);
			}
		};

		checkStorage();
		const interval = setInterval(checkStorage, 24 * 60 * 60 * 1000); // Daily

		return () => clearInterval(interval);
	}, []);

	return storageInfo;
}
