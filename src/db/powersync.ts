import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema';
// import { connector } from './connector';

export const db = new PowerSyncDatabase({
	schema: AppSchema,
	database: {
		dbFilename: 'duka-ledger.db'
	}
});

// db.connect(connector);
