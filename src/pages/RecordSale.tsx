import { useState } from 'react';
import { useProducts, useSales } from '@/hooks/useDatabase';
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
	const [customerPhone, setCustomerPhone] = useState('');
	const [discount, setDiscount] = useState(0);
	const [note, setNote] = useState('');

	const selectedProduct = products.find(p => p.id === selectedProductId);
	const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;
	const total = subtotal - discount;

	const today = new Date().toISOString().split('T')[0];
	const { data: todaySales } = useSales(today);
	const todayTotal = todaySales.reduce((sum, s) => sum + Number(s.total), 0);

	const handleRecordSale = async () => {
		if (!selectedProductId || quantity <= 0) {
			showError('Please select a product and quantity');
			return;
		}

		if (discount < 0 || discount > subtotal) {
			showError('Invalid discount amount');
			return;
		}

		try {
			const shopId = localStorage.getItem('shop_id');
			const userId = localStorage.getItem('user_id');

			if (paymentMethod === 'credit') {
				if (!customerName.trim()) {
					showError('Customer name required for credit sales');
					return;
				}
				
				const debtId = crypto.randomUUID();
				await db.execute(
					`INSERT INTO debts (id, shop_id, created_by, customer_name, phone, amount_owed, amount_paid, status, updated_at)
					VALUES (?, ?, ?, ?, ?, ?, 0, 'pending', datetime('now'))`,
					[debtId, shopId, userId, customerName.trim(), customerPhone.trim() || null, total]
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
			setCustomerPhone('');
			setDiscount(0);
			setNote('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to record sale');
		}
	};

	return (
		<div className="container mx-auto px-4 xl:px-0 py-6">
			<h1 className="text-2xl font-bold text-text mb-6">Record Sale</h1>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Left Panel - Sale Form */}
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
					<>
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
						<div>
							<label className="block text-sm font-medium text-text mb-2">Customer Phone (optional)</label>
							<input
								type="tel"
								value={customerPhone}
								onChange={(e) => setCustomerPhone(e.target.value)}
								placeholder="0712345678"
								className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
							/>
						</div>
					</>
				)}

				<div>
					<label className="block text-sm font-medium text-text mb-2">Discount (KSh)</label>
					<input
						type="number"
						value={discount}
						onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
						placeholder="0"
						min="0"
						max={subtotal}
						className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text mb-2">Note (optional)</label>
					<input
						type="text"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder="Additional details"
						maxLength={80}
						className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
					/>
				</div>

				<div className="pt-4 border-t border-border space-y-3">
					{discount > 0 && (
						<div className="flex justify-between text-sm text-muted">
							<span>Subtotal</span>
							<span>KSh {subtotal.toLocaleString()}</span>
						</div>
					)}
					{discount > 0 && (
						<div className="flex justify-between text-sm text-accent">
							<span>Discount</span>
							<span>- KSh {discount.toLocaleString()}</span>
						</div>
					)}
					<div className="flex justify-between items-center">
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

			{/* Right Panel - Today's Summary */}
			<div className="space-y-4">
				<div className="bg-surface border border-border rounded p-4">
					<h2 className="text-lg font-bold text-text mb-4">Today's Summary</h2>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-muted">Total Sales</span>
							<span className="font-bold text-text">KSh {todayTotal.toLocaleString()}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted">Transactions</span>
							<span className="font-bold text-text">{todaySales.length}</span>
						</div>
					</div>
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<h2 className="text-lg font-bold text-text mb-4">Recent Sales</h2>
					{todaySales.length === 0 ? (
						<p className="text-center text-muted py-4">No sales yet today</p>
					) : (
						<div className="space-y-2">
							{todaySales.slice(0, 5).map(sale => {
								const product = products.find(p => p.id === sale.product_id);
								return (
									<div key={sale.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
										<div>
											<div className="text-sm font-medium text-text">{product?.name || 'Unknown'}</div>
											<div className="text-xs text-muted">
												Qty: {sale.quantity} • {sale.payment_method}
											</div>
										</div>
										<div className="text-sm font-bold text-text">
											KSh {Number(sale.total).toLocaleString()}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{selectedProduct && (
					<div className="bg-surface border border-border rounded p-4">
						<h2 className="text-lg font-bold text-text mb-4">Product Info</h2>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-muted">Name</span>
								<span className="font-medium text-text">{selectedProduct.name}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted">Price</span>
								<span className="font-medium text-text">KSh {selectedProduct.price.toLocaleString()}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted">Stock</span>
								<span className={`font-medium ${selectedProduct.stock_count < 5 ? 'text-accent' : 'text-text'}`}>
									{selectedProduct.stock_count} units
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
		</div>
	);
}
