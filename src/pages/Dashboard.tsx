import { useSales, useExpenses, useDebts, useProducts } from '@/hooks/useDatabase';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Plus } from 'lucide-react';

export function Dashboard() {
	const today = new Date().toISOString().split('T')[0];
	const { data: sales } = useSales(today);
	const { data: expenses } = useExpenses(today);
	const { data: debts } = useDebts();
	const { data: products } = useProducts();

	const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
	const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
	const netProfit = totalSales - totalExpenses;
	const pendingDebt = debts
		.filter(d => d.status !== 'cleared')
		.reduce((sum, d) => sum + (d.amount_owed - d.amount_paid), 0);

	const recentSales = sales.slice(0, 5);
	const lowStock = products.filter(p => p.stock_count < 5);

	const getProductName = (productId: string) => {
		return products.find(p => p.id === productId)?.name || 'Unknown';
	};

	return (
		<div className="container mx-auto px-4 lg:px-0 py-6 space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-text mb-1">Dashboard</h1>
				<p className="text-sm text-muted">Today's Summary</p>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-surface border border-border rounded p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted">Total Sales</span>
						<TrendingUp size={18} className="text-secondary" />
					</div>
					<div className="text-2xl font-bold text-text">
						KSh {totalSales.toLocaleString()}
					</div>
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted">Total Expenses</span>
						<TrendingDown size={18} className="text-primary" />
					</div>
					<div className="text-2xl font-bold text-text">
						KSh {totalExpenses.toLocaleString()}
					</div>
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted">Net Profit</span>
						<DollarSign size={18} className={netProfit >= 0 ? 'text-secondary' : 'text-primary'} />
					</div>
					<div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-secondary' : 'text-primary'}`}>
						KSh {netProfit.toLocaleString()}
					</div>
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-muted">Pending Debt</span>
						<AlertTriangle size={18} className="text-accent" />
					</div>
					<div className="text-2xl font-bold text-text">
						KSh {pendingDebt.toLocaleString()}
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<div className="bg-surface border border-border rounded p-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-text">Recent Sales</h2>
						<Link to="/sales-history" className="text-sm text-primary hover:underline">
							View All
						</Link>
					</div>
					{recentSales.length === 0 ? (
						<div className="text-center py-8 text-muted">
							<p className="mb-2">No sales yet today</p>
							<Link
								to="/record-sale"
								className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded text-sm hover:bg-accent"
							>
								<Plus size={16} />
								Record Sale
							</Link>
						</div>
					) : (
						<div className="space-y-2">
							{recentSales.map(sale => (
								<div key={sale.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
									<div>
										<div className="font-medium text-text">{getProductName(sale.product_id)}</div>
										<div className="text-xs text-muted">
											Qty: {sale.quantity} • {sale.payment_method}
										</div>
									</div>
									<div className="font-bold text-text">
										KSh {sale.total.toLocaleString()}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold text-text">Low Stock Alert</h2>
						<Link to="/products" className="text-sm text-primary hover:underline">
							Manage
						</Link>
					</div>
					{lowStock.length === 0 ? (
						<div className="text-center py-8 text-muted">
							All products are well stocked
						</div>
					) : (
						<div className="space-y-2">
							{lowStock.map(product => (
								<div key={product.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
									<div>
										<div className="font-medium text-text">{product.name}</div>
										<div className="text-xs text-muted">
											KSh {product.price.toLocaleString()}
										</div>
									</div>
									<div className="flex items-center gap-2">
										<AlertTriangle size={16} className="text-accent" />
										<span className="font-bold text-accent">
											{product.stock_count} left
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
