import {
	AbstractPowerSyncDatabase,
	CrudEntry,
	type PowerSyncBackendConnector,
	type PowerSyncCredentials
} from '@powersync/web';

const API_URL = import.meta.env.VITE_API_URL;

export class DukaConnector implements PowerSyncBackendConnector {
	private shopId: string | null = null;
	private userId: string | null = null;
	private retryDelays = [1000, 2000, 4000, 8000, 16000, 60000]; // Capped at 60s
	private currentRetry = 0;

	async fetchCredentials(): Promise<PowerSyncCredentials> {
		try {
			const response = await fetch(`${API_URL}/api/auth/token`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					shop_id: this.shopId || localStorage.getItem('shop_id'),
					user_id: this.userId || localStorage.getItem('user_id')
				})
			});

			if (!response.ok) {
				console.error('[Sync] Failed to fetch credentials:', response.status, response.statusText);
				throw new Error(`Failed to fetch credentials: ${response.statusText}`);
			}

			const { token } = await response.json();
			console.log('[Sync] Credentials fetched successfully');
			
			return {
				endpoint: import.meta.env.VITE_POWERSYNC_URL || '',
				token
			};
		} catch (error) {
			console.error('[Sync] Error fetching credentials:', error);
			throw error;
		}
	}

	async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
		const batch = await database.getCrudBatch();
		
		if (!batch || batch.crud.length === 0) {
			return;
		}

		const operations = batch.crud.map((entry: CrudEntry) => ({
			type: entry.op === 'PUT' ? 'INSERT' : entry.op === 'PATCH' ? 'UPDATE' : 'DELETE',
			table: entry.table,
			data: entry.opData
		}));

		console.log(`[Sync] Uploading ${operations.length} operations:`, operations.slice(0, 3));

		try {
			const response = await fetch(`${API_URL}/api/sync/upload`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ operations })
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('[Sync] Upload failed:', response.status, errorText);
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			await batch.complete();
			this.currentRetry = 0;
			console.log('[Sync] Upload complete');
		} catch (error) {
			const delay = this.retryDelays[Math.min(this.currentRetry, this.retryDelays.length - 1)];
			this.currentRetry++;
			
			console.error(`[Sync] Upload error, will retry in ${delay / 1000}s:`, error);
			throw error;
		}
	}

	setCredentials(shopId: string, userId: string) {
		this.shopId = shopId;
		this.userId = userId;
	}
}

export const connector = new DukaConnector();
