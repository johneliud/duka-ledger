import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema';
import { connector } from './connector';

export const db = new PowerSyncDatabase({
	schema: AppSchema,
	database: {
		dbFilename: 'duka-ledger.db'
	}
});

// Initialize sync with retry configuration
let syncInitialized = false;

export async function initializeSync() {
	if (syncInitialized) return;
	
	try {
		await db.connect(connector);
		syncInitialized = true;
		console.log('[Sync] PowerSync connected');
		
		// Trigger sync on reconnect
		window.addEventListener('online', () => {
			console.log('[Sync] Network reconnected, triggering sync');
			db.waitForReady().then(() => {
				console.log('[Sync] Ready to sync');
			});
		});
	} catch (error) {
		console.error('[Sync] Failed to initialize:', error);
	}
}

// Auto-initialize on import (can be called multiple times safely)
initializeSync();
