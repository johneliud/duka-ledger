// Seed script for local SQLite database via PowerSync
// Run with: npm run seed

import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from '../src/db/schema';

const DEMO_SHOP_ID = 'demo-shop-001';
const DEMO_USER_ID = 'demo-user-001';

const products = [
	{ name: 'Unga wa Sembe 2kg', price: 150, stock: 45 },
	{ name: 'Sugar 1kg', price: 180, stock: 30 },
	{ name: 'Rice 2kg', price: 220, stock: 25 },
	{ name: 'Cooking Oil 1L', price: 350, stock: 15 },
	{ name: 'Soap Bar', price: 50, stock: 60 },
	{ name: 'Matches Box', price: 10, stock: 100 },
	{ name: 'Milk 500ml', price: 70, stock: 20 },
	{ name: 'Airtime KSh 100', price: 100, stock: 50 },
];

async function seed() {
	console.log('🌱 Seeding local database...');

	const db = new PowerSyncDatabase({ schema: AppSchema, database: { dbFilename: 'duka-ledger.db' } });
	await db.init();

	try {
		// Insert products
		console.log('📦 Inserting products...');
		const productIds: string[] = [];
		for (const product of products) {
			const id = crypto.randomUUID();
			await db.execute(
				`INSERT INTO products (id, shop_id, created_by, name, price, stock_count, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
				[id, DEMO_SHOP_ID, DEMO_USER_ID, product.name, product.price, product.stock]
			);
			productIds.push(id);
		}

		// Insert sales (last 7 days)
		console.log('💰 Inserting sales...');
		const now = Date.now();
		for (let i = 0; i < 20; i++) {
			const daysAgo = Math.floor(Math.random() * 7);
			const productIdx = Math.floor(Math.random() * productIds.length);
			const productId = productIds[productIdx];
			const quantity = Math.floor(Math.random() * 5) + 1;
			const price = products[productIdx].price;
			const total = price * quantity;
			const paymentMethod = ['cash', 'mpesa', 'cash', 'cash'][Math.floor(Math.random() * 4)];
			
			const saleDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
			
			await db.execute(
				`INSERT INTO sales (id, shop_id, recorded_by, product_id, quantity, total, payment_method, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[crypto.randomUUID(), DEMO_SHOP_ID, DEMO_USER_ID, productId, quantity, total, paymentMethod, saleDate.toISOString()]
			);
		}

		// Insert expenses
		console.log('📝 Inserting expenses...');
		const expenses = [
			{ category: 'stock', amount: 5000, note: 'Restock from supplier' },
			{ category: 'transport', amount: 500, note: 'Matatu to town' },
			{ category: 'rent', amount: 3000, note: 'Monthly rent' },
			{ category: 'utilities', amount: 800, note: 'Electricity bill' },
			{ category: 'other', amount: 200, note: 'Misc expenses' },
		];

		for (const expense of expenses) {
			const daysAgo = Math.floor(Math.random() * 7);
			const expenseDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
			
			await db.execute(
				`INSERT INTO expenses (id, shop_id, recorded_by, category, amount, note, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[crypto.randomUUID(), DEMO_SHOP_ID, DEMO_USER_ID, expense.category, expense.amount, expense.note, expenseDate.toISOString()]
			);
		}

		// Insert debts
		console.log('📖 Inserting debts...');
		const debts = [
			{ name: 'Mama Njeri', phone: '0712345678', owed: 500, paid: 200, status: 'partial' },
			{ name: 'John Kamau', phone: '0723456789', owed: 300, paid: 0, status: 'pending' },
			{ name: 'Grace Wanjiku', phone: null, owed: 150, paid: 150, status: 'cleared' },
		];

		for (const debt of debts) {
			await db.execute(
				`INSERT INTO debts (id, shop_id, created_by, customer_name, phone, amount_owed, amount_paid, status, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
				[crypto.randomUUID(), DEMO_SHOP_ID, DEMO_USER_ID, debt.name, debt.phone, debt.owed, debt.paid, debt.status]
			);
		}

		console.log('✅ Demo data seeded successfully!');
		console.log(`📊 Summary:`);
		console.log(`   - ${products.length} products`);
		console.log(`   - 20 sales`);
		console.log(`   - ${expenses.length} expenses`);
		console.log(`   - ${debts.length} debts`);
	} catch (err) {
		console.error('❌ Error seeding data:', err);
		throw err;
	} finally {
		await db.close();
	}
}

async function reset() {
	console.log('🗑️  Resetting demo data...');

	const db = new PowerSyncDatabase({ schema: AppSchema, database: { dbFilename: 'duka-ledger.db' } });
	await db.init();

	try {
		await db.execute(`DELETE FROM sales WHERE shop_id = ?`, [DEMO_SHOP_ID]);
		await db.execute(`DELETE FROM expenses WHERE shop_id = ?`, [DEMO_SHOP_ID]);
		await db.execute(`DELETE FROM debts WHERE shop_id = ?`, [DEMO_SHOP_ID]);
		await db.execute(`DELETE FROM products WHERE shop_id = ?`, [DEMO_SHOP_ID]);
		
		console.log('✅ Demo data reset successfully!');
	} catch (err) {
		console.error('❌ Error resetting data:', err);
		throw err;
	} finally {
		await db.close();
	}
}

const command = process.argv[2];

if (command === 'reset') {
	reset();
} else {
	seed();
}
