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

initializeSync();

// Keep Render server awake to prevent sleeps on free tier after every 10 minutes
if (import.meta.env.VITE_API_URL) {
	setInterval(async () => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/health`);
			console.log('Awake');
		} catch (error) {
			console.error('Sleeping. Error:', error);
		}
	}, 10 * 60 * 1000);
}
