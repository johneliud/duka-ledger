import { useState } from 'react';
import { useSales, useProducts } from '@/hooks/useDatabase';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';
import { CreditCard, Banknote, Smartphone, Trash2 } from 'lucide-react';

type DateFilter = 'today' | 'week' | 'month';

export function SalesHistory() {
	const [filter, setFilter] = useState<DateFilter>('today');
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const { showSuccess, showError } = useNotification();

	const getDateFilter = () => {
		const now = new Date();
		if (filter === 'today') return now.toISOString().split('T')[0];
		return undefined;
	};

	const { data: sales } = useSales(getDateFilter());
	const { data: products } = useProducts();

	const getProductName = (productId: string) => {
		return products.find(p => p.id === productId)?.name || 'Unknown';
	};

	const groupByDate = () => {
		const groups: Record<string, typeof sales> = {};
		sales.forEach(sale => {
			const date = new Date(sale.created_at).toLocaleDateString();
			if (!groups[date]) groups[date] = [];
			groups[date].push(sale);
		});
		return groups;
	};

	const getTotal = () => {
		return sales.reduce((sum, sale) => sum + Number(sale.total), 0);
	};

	const handleDelete = async (id: string) => {
		try {
			await db.execute(
				`UPDATE sales SET quantity = -quantity WHERE id = ?`,
				[id]
			);
			showSuccess('Sale deleted');
			setDeleteId(null);
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to delete');
		}
	};

	const grouped = groupByDate();
	const total = getTotal();

	return (
		<div className="container mx-auto px-4 xl:px-0 py-6">
			<h1 className="text-2xl font-bold text-text mb-6">Sales History</h1>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Left Panel - Filters and List */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex gap-2">
						{(['today', 'week', 'month'] as DateFilter[]).map(f => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={`px-4 py-2 rounded ${
									filter === f
										? 'bg-primary text-white'
										: 'bg-surface border border-border text-text'
								}`}
							>
								{f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'This Month'}
							</button>
						))}
					</div>
					{Object.keys(grouped).length === 0 ? (
						<div className="text-center py-12 text-muted bg-surface border border-border rounded">
							No sales yet today. Tap + to record your first sale.
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(grouped).map(([date, items]) => (
								<div key={date}>
									<h2 className="text-sm font-medium text-muted mb-2">{date}</h2>
									<div className="space-y-2">
										{items.map(sale => (
											<div
												key={sale.id}
												className="bg-surface border border-border rounded p-3 flex items-center justify-between"
											>
												<div className="flex-1">
													<div className="font-medium text-text">
														{getProductName(sale.product_id)}
													</div>
													<div className="text-sm text-muted flex items-center gap-2">
														<span>Qty: {sale.quantity}</span>
														<span>•</span>
														<span className="flex items-center gap-1">
															{sale.payment_method === 'cash' && <Banknote size={14} />}
															{sale.payment_method === 'mpesa' && <Smartphone size={14} />}
															{sale.payment_method === 'credit' && <CreditCard size={14} />}
															{sale.payment_method}
														</span>
														<span>•</span>
														<span>{new Date(sale.created_at).toLocaleTimeString()}</span>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<div className="text-lg font-bold text-text">
														KSh {Number(sale.total).toLocaleString()}
													</div>
													<button
														onClick={() => setDeleteId(sale.id)}
														className="p-2 text-muted hover:text-primary"
													>
														<Trash2 size={18} />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Right Panel - Summary Stats */}
				<div className="space-y-4">
					<div className="bg-surface border border-border rounded p-4">
						<div className="text-sm text-muted mb-1">Total for period</div>
						<div className="text-3xl font-bold text-primary">KSh {total.toLocaleString()}</div>
					</div>

					<div className="bg-surface border border-border rounded p-4">
						<h3 className="font-medium text-text mb-3">Summary</h3>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-sm text-muted">Total Sales</span>
								<span className="font-medium text-text">{sales.length}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted">Cash</span>
								<span className="font-medium text-text">
									{sales.filter(s => s.payment_method === 'cash').length}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted">M-Pesa</span>
								<span className="font-medium text-text">
									{sales.filter(s => s.payment_method === 'mpesa').length}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted">Credit</span>
								<span className="font-medium text-text">
									{sales.filter(s => s.payment_method === 'credit').length}
								</span>
							</div>
						</div>
					</div>

					<div className="bg-surface border border-border rounded p-4">
						<h3 className="font-medium text-text mb-3">Payment Breakdown</h3>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-sm text-muted">Cash</span>
								<span className="font-medium text-text">
									KSh {sales.filter(s => s.payment_method === 'cash').reduce((sum, s) => sum + Number(s.total), 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted">M-Pesa</span>
								<span className="font-medium text-text">
									KSh {sales.filter(s => s.payment_method === 'mpesa').reduce((sum, s) => sum + Number(s.total), 0).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted">Credit</span>
								<span className="font-medium text-text">
									KSh {sales.filter(s => s.payment_method === 'credit').reduce((sum, s) => sum + Number(s.total), 0).toLocaleString()}
								</span>
							</div>
						</div>
					</div>

					<div className="bg-surface border border-border rounded p-4">
						<h3 className="font-medium text-text mb-3">Top Products</h3>
						<div className="space-y-2">
							{Object.entries(
								sales.reduce((acc, sale) => {
									const name = getProductName(sale.product_id);
									acc[name] = (acc[name] || 0) + sale.quantity;
									return acc;
								}, {} as Record<string, number>)
							)
								.sort(([, a], [, b]) => b - a)
								.slice(0, 5)
								.map(([name, qty]) => (
									<div key={name} className="flex justify-between">
										<span className="text-sm text-muted truncate">{name}</span>
										<span className="font-medium text-text">{qty} sold</span>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>

			{deleteId && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-surface rounded p-6 max-w-sm w-full">
						<h3 className="text-lg font-bold text-text mb-2">Delete Sale?</h3>
						<p className="text-muted mb-4">This will reverse the sale and restore stock.</p>
						<div className="flex gap-2">
							<button
								onClick={() => setDeleteId(null)}
								className="flex-1 px-4 py-2 border border-border rounded text-text"
							>
								Cancel
							</button>
							<button
								onClick={() => handleDelete(deleteId)}
								className="flex-1 px-4 py-2 bg-primary text-white rounded"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
