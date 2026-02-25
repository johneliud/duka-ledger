import { useState } from 'react';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';

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

export function SeedData() {
	const [isSeeding, setIsSeeding] = useState(false);
	const { showSuccess, showError } = useNotification();

	const handleSeed = async () => {
		setIsSeeding(true);
		try {
			// Set demo credentials
			localStorage.setItem('shop_id', DEMO_SHOP_ID);
			localStorage.setItem('user_id', DEMO_USER_ID);

			// Insert products
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

			showSuccess('Demo data seeded! Reload the page.');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to seed data');
		} finally {
			setIsSeeding(false);
		}
	};

	const handleReset = async () => {
		setIsSeeding(true);
		try {
			await db.execute(`DELETE FROM sales WHERE shop_id = ?`, [DEMO_SHOP_ID]);
			await db.execute(`DELETE FROM expenses WHERE shop_id = ?`, [DEMO_SHOP_ID]);
			await db.execute(`DELETE FROM debts WHERE shop_id = ?`, [DEMO_SHOP_ID]);
			await db.execute(`DELETE FROM products WHERE shop_id = ?`, [DEMO_SHOP_ID]);
			
			showSuccess('Demo data reset! Reload the page.');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to reset data');
		} finally {
			setIsSeeding(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-8">
			<h1 className="text-2xl font-bold text-text mb-4">Seed Demo Data</h1>
			<p className="text-muted mb-6">
				Populate the local database with demo products, sales, expenses, and debts.
			</p>
			<div className="space-y-3">
				<button
					onClick={handleSeed}
					disabled={isSeeding}
					className="w-full py-3 bg-primary text-white rounded font-medium hover:bg-accent disabled:opacity-50"
				>
					{isSeeding ? 'Seeding...' : 'Seed Demo Data'}
				</button>
				<button
					onClick={handleReset}
					disabled={isSeeding}
					className="w-full py-3 bg-surface border border-border text-text rounded font-medium hover:bg-border disabled:opacity-50"
				>
					{isSeeding ? 'Resetting...' : 'Reset Demo Data'}
				</button>
			</div>
			<div className="mt-6 p-4 bg-surface border border-border rounded">
				<h3 className="font-medium text-text mb-2">Demo Data Includes:</h3>
				<ul className="text-sm text-muted space-y-1">
					<li>• 8 products (Unga, Sugar, Rice, etc.)</li>
					<li>• 20 sales over last 7 days</li>
					<li>• 5 expenses</li>
					<li>• 3 debts (pending, partial, cleared)</li>
				</ul>
			</div>
		</div>
	);
}
