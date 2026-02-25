import { useState } from 'react';
import { useDebts, useProducts } from '@/hooks/useDatabase';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';
import { Plus, Phone, ArrowLeft } from 'lucide-react';

type DebtStatus = 'pending' | 'partial' | 'cleared';

export function DebtBook() {
	const [filter, setFilter] = useState<DebtStatus | undefined>(undefined);
	const { data: debts } = useDebts(filter);
	const { data: products } = useProducts();
	const { showSuccess, showError } = useNotification();
	const [selectedDebt, setSelectedDebt] = useState<string | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [paymentAmount, setPaymentAmount] = useState('');
	const [customerName, setCustomerName] = useState('');
	const [phone, setPhone] = useState('');
	const [productId, setProductId] = useState('');
	const [quantity, setQuantity] = useState('1');
	const [note, setNote] = useState('');

	const selectedDebtData = debts.find(d => d.id === selectedDebt);
	const selectedProduct = products.find(p => p.id === productId);
	const total = selectedProduct ? selectedProduct.price * parseInt(quantity || '1') : 0;

	const handleRecordPayment = async () => {
		if (!selectedDebt || !paymentAmount || parseFloat(paymentAmount) <= 0) {
			showError('Enter valid payment amount');
			return;
		}

		const payment = parseFloat(paymentAmount);
		const debt = debts.find(d => d.id === selectedDebt);
		if (!debt) return;

		const newPaid = debt.amount_paid + payment;
		const newStatus: DebtStatus = newPaid >= debt.amount_owed ? 'cleared' : newPaid > 0 ? 'partial' : 'pending';

		try {
			await db.execute(
				`UPDATE debts SET amount_paid = amount_paid + ?, status = ?, updated_at = datetime('now') WHERE id = ?`,
				[payment, newStatus, selectedDebt]
			);
			showSuccess('Payment recorded');
			setSelectedDebt(null);
			setPaymentAmount('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to record payment');
		}
	};

	const handleAddDebt = async () => {
		if (!customerName.trim()) {
			showError('Customer name is required');
			return;
		}

		if (!productId || !quantity || parseInt(quantity) <= 0) {
			showError('Select product and quantity');
			return;
		}

		try {
			const shopId = localStorage.getItem('shop_id');
			const userId = localStorage.getItem('user_id');
			const debtId = crypto.randomUUID();

			await db.execute(
				`INSERT INTO debts (id, shop_id, created_by, customer_name, phone, amount_owed, amount_paid, status, updated_at)
				VALUES (?, ?, ?, ?, ?, ?, 0, 'pending', datetime('now'))`,
				[debtId, shopId, userId, customerName.trim(), phone.trim() || null, total]
			);

			await db.execute(
				`INSERT INTO sales (id, shop_id, recorded_by, product_id, debt_id, quantity, total, payment_method, created_at)
				VALUES (?, ?, ?, ?, ?, ?, ?, 'credit', datetime('now'))`,
				[crypto.randomUUID(), shopId, userId, productId, debtId, parseInt(quantity), total]
			);

			await db.execute(
				`UPDATE products SET stock_count = stock_count - ?, updated_at = datetime('now') WHERE id = ?`,
				[parseInt(quantity), productId]
			);

			showSuccess('Debt recorded');
			setShowAddForm(false);
			setCustomerName('');
			setPhone('');
			setProductId('');
			setQuantity('1');
			setNote('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to add debt');
		}
	};

	const getDaysOverdue = (updatedAt: string) => {
		const days = Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
		return days;
	};

	const totalOwed = debts.reduce((sum, d) => sum + (d.amount_owed - d.amount_paid), 0);

	return (
		<div className="max-w-2xl mx-auto p-4">
			{selectedDebt ? (
				<div>
					<button
						onClick={() => setSelectedDebt(null)}
						className="flex items-center gap-2 text-muted hover:text-text mb-4"
					>
						<ArrowLeft size={20} />
						Back
					</button>
					<h1 className="text-2xl font-bold text-text mb-4">{selectedDebtData?.customer_name}</h1>
					
					<div className="bg-surface border border-border rounded p-4 mb-6">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<div className="text-sm text-muted">Total Owed</div>
								<div className="text-xl font-bold text-primary">
									KSh {selectedDebtData?.amount_owed.toLocaleString()}
								</div>
							</div>
							<div>
								<div className="text-sm text-muted">Amount Paid</div>
								<div className="text-xl font-bold text-secondary">
									KSh {selectedDebtData?.amount_paid.toLocaleString()}
								</div>
							</div>
							<div>
								<div className="text-sm text-muted">Remaining</div>
								<div className="text-xl font-bold text-text">
									KSh {((selectedDebtData?.amount_owed || 0) - (selectedDebtData?.amount_paid || 0)).toLocaleString()}
								</div>
							</div>
							<div>
								<div className="text-sm text-muted">Status</div>
								<div className={`text-sm font-medium ${
									selectedDebtData?.status === 'cleared' ? 'text-secondary' :
									selectedDebtData?.status === 'partial' ? 'text-accent' : 'text-primary'
								}`}>
									{selectedDebtData?.status}
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-text mb-2">Payment Amount (KSh)</label>
							<input
								type="number"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
								placeholder="0"
								min="0"
								step="0.01"
								className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
							/>
						</div>
						<button
							onClick={handleRecordPayment}
							disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
							className="w-full py-3 bg-primary text-white rounded font-medium hover:bg-accent disabled:opacity-50"
						>
							Record Payment
						</button>
					</div>
				</div>
			) : (
				<div>
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold text-text">Debt Book</h1>
						<button
							onClick={() => setShowAddForm(true)}
							className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-accent"
						>
							<Plus size={20} />
							Add Debt
						</button>
					</div>

					<div className="bg-surface border border-border rounded p-4 mb-4">
						<div className="text-sm text-muted">Total Pending Debt</div>
						<div className="text-2xl font-bold text-primary">KSh {totalOwed.toLocaleString()}</div>
					</div>

					<div className="flex gap-2 mb-4">
						<button
							onClick={() => setFilter(undefined)}
							className={`px-4 py-2 rounded ${!filter ? 'bg-primary text-white' : 'bg-surface border border-border text-text'}`}
						>
							All
						</button>
						{(['pending', 'partial', 'cleared'] as DebtStatus[]).map(s => (
							<button
								key={s}
								onClick={() => setFilter(s)}
								className={`px-4 py-2 rounded capitalize ${filter === s ? 'bg-primary text-white' : 'bg-surface border border-border text-text'}`}
							>
								{s}
							</button>
						))}
					</div>

					{debts.length === 0 ? (
						<div className="text-center py-12 text-muted">No debts recorded</div>
					) : (
						<div className="space-y-2">
							{debts.map(debt => {
								const remaining = debt.amount_owed - debt.amount_paid;
								const days = getDaysOverdue(debt.updated_at);
								return (
									<button
										key={debt.id}
										onClick={() => setSelectedDebt(debt.id)}
										className="w-full bg-surface border border-border rounded p-4 text-left hover:bg-bg"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="font-medium text-text">{debt.customer_name}</div>
												{debt.phone && (
													<div className="text-sm text-muted flex items-center gap-1 mt-1">
														<Phone size={14} />
														{debt.phone}
													</div>
												)}
												<div className="text-xs text-muted mt-1">
													{days > 0 && `${days} days overdue`}
												</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-bold text-text">
													KSh {remaining.toLocaleString()}
												</div>
												<div className={`text-xs font-medium ${
													debt.status === 'cleared' ? 'text-secondary' :
													debt.status === 'partial' ? 'text-accent' : 'text-primary'
												}`}>
													{debt.status}
												</div>
											</div>
										</div>
									</button>
								);
							})}
						</div>
					)}
				</div>
			)}

			{showAddForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-surface rounded p-6 max-w-md w-full">
						<h2 className="text-xl font-bold text-text mb-4">Add Debt</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-text mb-1">Customer Name</label>
								<input
									type="text"
									value={customerName}
									onChange={(e) => setCustomerName(e.target.value)}
									placeholder="e.g. John wa Kariuki"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Phone (optional)</label>
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="0712345678"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Product</label>
								<select
									value={productId}
									onChange={(e) => setProductId(e.target.value)}
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								>
									<option value="">Select product</option>
									{products.map(p => (
										<option key={p.id} value={p.id}>
											{p.name} — KSh {p.price}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Quantity</label>
								<input
									type="number"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									placeholder="1"
									min="1"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Note (optional)</label>
								<input
									type="text"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="Additional details"
									maxLength={80}
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							{productId && (
								<div className="bg-bg border border-border rounded p-3">
									<div className="text-sm text-muted">Total Amount</div>
									<div className="text-xl font-bold text-primary">
										KSh {total.toLocaleString()}
									</div>
								</div>
							)}
						</div>
						<div className="flex gap-2 mt-6">
							<button
								onClick={() => {
									setShowAddForm(false);
									setCustomerName('');
									setPhone('');
									setProductId('');
									setQuantity('1');
									setNote('');
								}}
								className="flex-1 px-4 py-2 border border-border rounded text-text"
							>
								Cancel
							</button>
							<button
								onClick={handleAddDebt}
								disabled={!customerName.trim() || !productId || !quantity || parseInt(quantity) <= 0}
								className="flex-1 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
