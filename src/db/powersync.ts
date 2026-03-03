import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema';
import { connector } from './connector';

let dbInstance: PowerSyncDatabase | null = null;
let currentShopId: string | null = null;

export function getDatabase(shopId?: string): PowerSyncDatabase {
	const targetShopId = shopId || localStorage.getItem('shop_id') || 'default';
	
	// If database exists and is for the same shop, return it
	if (dbInstance && currentShopId === targetShopId) {
		return dbInstance;
	}
	
	// Close existing database if switching shops
	if (dbInstance) {
		console.log(`[DB] Switching from shop ${currentShopId} to ${targetShopId}`);
		dbInstance.disconnectAndClear();
	}
	
	// Create new database for this shop
	currentShopId = targetShopId;
	dbInstance = new PowerSyncDatabase({
		schema: AppSchema,
		database: {
			dbFilename: `duka-${targetShopId}.db`
		}
	});
	
	console.log(`[DB] Using database: duka-${targetShopId}.db`);
	return dbInstance;
}

// Export db getter
export const db = new Proxy({} as PowerSyncDatabase, {
	get(_target, prop) {
		const database = getDatabase();
		return (database as any)[prop];
	}
});

// Initialize sync with retry configuration
let syncInitialized = false;

export async function initializeSync(shopId?: string) {
	const database = getDatabase(shopId);
	
	if (syncInitialized) {
		syncInitialized = false; // Reset for new shop
	}
	
	try {
		await database.connect(connector);
		syncInitialized = true;
		console.log('[Sync] PowerSync connected');
		
		// Trigger sync on reconnect
		window.addEventListener('online', () => {
			console.log('[Sync] Network reconnected, triggering sync');
			database.waitForReady().then(() => {
				console.log('[Sync] Ready to sync');
			});
		});
	} catch (error) {
		console.error('[Sync] Failed to initialize:', error);
	}
}

// Keep Render server awake to prevent sleeps on free tier after every 10 minutes
if (import.meta.env.VITE_API_URL) {
	setInterval(async () => {
		try {
			await fetch(`${import.meta.env.VITE_API_URL}/health`);
			console.log('[KeepAlive] Server pinged');
		} catch (error) {
			console.log('[KeepAlive] Ping failed:', error);
		}
	}, 10 * 60 * 1000);
}
