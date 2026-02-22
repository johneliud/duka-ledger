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

	async fetchCredentials(): Promise<PowerSyncCredentials> {
		// For now, use hardcoded credentials for testing
		// Will be replaced with actual auth in Issue #11
		const response = await fetch(`${API_URL}/api/auth/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				shop_id: this.shopId || 'test-shop',
				user_id: this.userId || 'test-user'
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch credentials');
		}

		const { token } = await response.json();
		
		return {
			endpoint: import.meta.env.VITE_POWERSYNC_URL || '',
			token
		};
	}

	async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
		const batch = await database.getCrudBatch();
		
		if (!batch || batch.crud.length === 0) {
			return;
		}

		const operations = batch.crud.map((entry: CrudEntry) => ({
			type: entry.op,
			table: entry.table,
			data: entry.opData
		}));

		console.log(`Uploading ${operations.length} operations to server`);

		try {
			const response = await fetch(`${API_URL}/api/sync/upload`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ operations })
			});

			if (!response.ok) {
				throw new Error(`Upload failed: ${response.statusText}`);
			}

			await batch.complete();
			console.log('Upload successful');
		} catch (error) {
			console.error('Upload error:', error);
			throw error;
		}
	}

	setCredentials(shopId: string, userId: string) {
		this.shopId = shopId;
		this.userId = userId;
	}
}

export const connector = new DukaConnector();
