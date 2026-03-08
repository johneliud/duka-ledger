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
  console.log("[DB] Disconnected from shop, data preserved");
}

export function clearShopData() {
  if (dbInstance) {
    console.log("[DB] Clearing all shop data");
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
    statusChanged: (status) => {
      console.log("[Sync] Status changed:", {
        connected: status.connected,
        connecting: status.connecting,
        downloading: status.dataFlowStatus.downloading,
        uploading: status.dataFlowStatus.uploading,
        lastSyncedAt: status.lastSyncedAt,
        error: status.dataFlowStatus.downloadError?.message,
      });
    },
    dbError: (error) => {
      console.error("[Sync] Database error:", error);
    },
  });
}

export async function initializeSync(shopId?: string) {
  const database = getDatabase(shopId);

  if (syncStarted && database.currentStatus?.connected) {
    console.log("[Sync] Already connected");
    return;
  }

  if (syncStarted && database.currentStatus?.connecting) {
    console.log("[Sync] Connection already in progress");
    return;
  }

  syncStarted = true;

  try {
    console.log(
      `[Sync] Starting PowerSync connection for shop: ${currentShopId}`,
    );

    setupStatusListener(database);

    await database.connect(connector);
    console.log("[Sync] PowerSync connect() called successfully");

    window.addEventListener("online", () => {
      console.log("[Sync] Network reconnected, triggering sync");
      database.waitForReady().then(() => {
        console.log("[Sync] Ready to sync after reconnection");
      });
    });

    setTimeout(async () => {
      console.log("[Sync] Performing initial sync check...");
      try {
        await database.waitForReady();
        const status = database.currentStatus;
        console.log("[Sync] Status after waitForReady:", {
          connected: status?.connected,
          connecting: status?.connecting,
          downloading: status?.dataFlowStatus.downloading,
          lastSyncedAt: status?.lastSyncedAt,
        });

        const productsCount = await database.get<{ count: number }>(
          "SELECT COUNT(*) as count FROM products",
        );
        const salesCount = await database.get<{ count: number }>(
          "SELECT COUNT(*) as count FROM sales",
        );
        console.log(
          "[Sync] Local data counts - Products:",
          productsCount?.count || 0,
          "Sales:",
          salesCount?.count || 0,
        );

        if (status?.connected && (productsCount?.count || 0) === 0) {
          console.log(
            "[Sync] Connected but no data found. Please check sync rules and JWT permissions.",
          );
        }
      } catch (err) {
        console.error("[Sync] Initial sync check error:", err);
      }
    }, 5000);
  } catch (error) {
    syncStarted = false;
    console.error("[Sync] Failed to initialize:", error);
  }
}
