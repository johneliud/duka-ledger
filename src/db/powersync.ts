import { PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "./schema";
import { connector } from "./connector";

let dbInstance: PowerSyncDatabase | null = null;
let currentShopId: string | null = null;

export function getDatabase(shopId?: string): PowerSyncDatabase {
  const targetShopId = shopId || localStorage.getItem("shop_id") || "default";

  if (dbInstance && currentShopId === targetShopId) {
    return dbInstance;
  }

  if (dbInstance) {
    console.log(`[DB] Switching from shop ${currentShopId} to ${targetShopId}`);
    dbInstance.disconnectAndClear();
  }

  currentShopId = targetShopId;
  dbInstance = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
      dbFilename: `duka-${targetShopId}.db`,
    },
  });

  console.log(`[DB] Using database: duka-${targetShopId}.db`);
  return dbInstance;
}

export function disconnectFromShop() {
  dbInstance?.disconnect();
  dbInstance = null;
  currentShopId = null;
}

export function clearShopData() {
  if (dbInstance) {
    dbInstance.disconnectAndClear();
  }
  dbInstance = null;
  currentShopId = null;
}

export const db = new Proxy({} as PowerSyncDatabase, {
  get(_target, prop) {
    const database = getDatabase();
    return (database as any)[prop];
  },
});

let syncStarted = false;

function setupStatusListener(database: PowerSyncDatabase) {
  database.registerListener({
    dbError: (error) => {
      console.error("[Sync] Database error:", error);
    },
  });
}

export async function initializeSync(shopId?: string) {
  const database = getDatabase(shopId);

  if (syncStarted && database.currentStatus?.connected) {
    return;
  }

  if (syncStarted && database.currentStatus?.connecting) {
    return;
  }

  syncStarted = true;

  try {
    setupStatusListener(database);

    await database.connect(connector);

    window.addEventListener("online", () => {
      database.waitForReady().then(() => {});
    });

    setTimeout(async () => {
      try {
        await database.waitForReady();
        const status = database.currentStatus;
        console.log("[Sync] Status after waitForReady:", {
          connected: status?.connected,
          connecting: status?.connecting,
          downloading: status?.dataFlowStatus.downloading,
          lastSyncedAt: status?.lastSyncedAt,
        });
      } catch (err) {
        console.error("[Sync] Initial sync check error:", err);
      }
    }, 5000);
  } catch (error) {
    syncStarted = false;
    console.error("[Sync] Failed to initialize:", error);
  }
}
