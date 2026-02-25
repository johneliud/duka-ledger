import { useState } from 'react';
import { useProducts } from '@/hooks/useDatabase';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';
import { Minus, Plus } from 'lucide-react';

export function RecordSale() {
	const { data: products } = useProducts();
	const { showSuccess, showError } = useNotification();
	const [selectedProductId, setSelectedProductId] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'credit'>('cash');
	const [customerName, setCustomerName] = useState('');

	const selectedProduct = products.find(p => p.id === selectedProductId);
	const total = selectedProduct ? selectedProduct.price * quantity : 0;

	const handleRecordSale = async () => {
		if (!selectedProductId || quantity <= 0) {
			showError('Please select a product and quantity');
			return;
		}

		try {
			const shopId = localStorage.getItem('shop_id');
			const userId = localStorage.getItem('user_id');

			if (paymentMethod === 'credit' && customerName.trim()) {
				const debtId = crypto.randomUUID();
				await db.execute(
					`INSERT INTO debts (id, shop_id, created_by, customer_name, amount_owed, amount_paid, status, updated_at)
					VALUES (?, ?, ?, ?, ?, 0, 'pending', datetime('now'))`,
					[debtId, shopId, userId, customerName.trim(), total]
				);

				await db.execute(
					`INSERT INTO sales (id, shop_id, recorded_by, product_id, debt_id, quantity, total, payment_method, created_at)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
					[crypto.randomUUID(), shopId, userId, selectedProductId, debtId, quantity, total, paymentMethod]
				);
			} else {
				await db.execute(
					`INSERT INTO sales (id, shop_id, recorded_by, product_id, quantity, total, payment_method, created_at)
					VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
					[crypto.randomUUID(), shopId, userId, selectedProductId, quantity, total, paymentMethod]
				);
			}

			await db.execute(
				`UPDATE products SET stock_count = stock_count - ?, updated_at = datetime('now') WHERE id = ?`,
				[quantity, selectedProductId]
			);

			showSuccess(`Sale recorded — KSh ${total.toLocaleString()}`);
			setSelectedProductId('');
			setQuantity(1);
			setPaymentMethod('cash');
			setCustomerName('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to record sale');
		}
	};

	return (
		<div className="max-w-md mx-auto p-4">
			<h1 className="text-2xl font-bold text-text mb-6">Record Sale</h1>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-text mb-2">Product</label>
					<select
						value={selectedProductId}
						onChange={(e) => setSelectedProductId(e.target.value)}
						className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
					>
						<option value="">Select product</option>
						{products.map(p => (
							<option key={p.id} value={p.id}>
								{p.name} — KSh {p.price} (Stock: {p.stock_count})
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-text mb-2">Quantity</label>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setQuantity(Math.max(1, quantity - 1))}
							className="p-2 border border-border rounded bg-surface hover:bg-border"
						>
							<Minus size={20} />
						</button>
						<input
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
							className="flex-1 px-3 py-2 border border-border rounded bg-surface text-text text-center"
							min="1"
						/>
						<button
							onClick={() => setQuantity(quantity + 1)}
							className="p-2 border border-border rounded bg-surface hover:bg-border"
						>
							<Plus size={20} />
						</button>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-text mb-2">Payment Method</label>
					<div className="flex gap-2">
						{(['cash', 'mpesa', 'credit'] as const).map(method => (
							<button
								key={method}
								onClick={() => setPaymentMethod(method)}
								className={`flex-1 px-4 py-2 rounded border ${
									paymentMethod === method
										? 'bg-primary text-white border-primary'
										: 'bg-surface text-text border-border'
								}`}
							>
								{method === 'cash' ? 'Cash' : method === 'mpesa' ? 'M-Pesa' : 'Credit'}
							</button>
						))}
					</div>
				</div>

				{paymentMethod === 'credit' && (
					<div>
						<label className="block text-sm font-medium text-text mb-2">Customer Name</label>
						<input
							type="text"
							value={customerName}
							onChange={(e) => setCustomerName(e.target.value)}
							placeholder="Enter customer name"
							className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
						/>
					</div>
				)}

				<div className="pt-4 border-t border-border">
					<div className="flex justify-between items-center mb-4">
						<span className="text-lg font-medium text-text">Total</span>
						<span className="text-2xl font-bold text-primary">
							KSh {total.toLocaleString()}
						</span>
					</div>
					<button
						onClick={handleRecordSale}
						disabled={!selectedProductId || quantity <= 0}
						className="w-full py-3 bg-primary text-white rounded font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Record Sale
					</button>
				</div>
			</div>
		</div>
	);
}
