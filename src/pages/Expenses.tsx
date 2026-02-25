import { useState } from 'react';
import { useExpenses } from '@/hooks/useDatabase';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';
import { Package, Truck, Home, Zap, FileText } from 'lucide-react';

type Category = 'stock' | 'transport' | 'rent' | 'utilities' | 'other';

const categories: { value: Category; label: string; icon: typeof Package }[] = [
	{ value: 'stock', label: 'Stock', icon: Package },
	{ value: 'transport', label: 'Transport', icon: Truck },
	{ value: 'rent', label: 'Rent', icon: Home },
	{ value: 'utilities', label: 'Utilities', icon: Zap },
	{ value: 'other', label: 'Other', icon: FileText },
];

export function Expenses() {
	const today = new Date().toISOString().split('T')[0];
	const { data: expenses } = useExpenses(today);
	const { showSuccess, showError } = useNotification();
	const [category, setCategory] = useState<Category>('stock');
	const [amount, setAmount] = useState('');
	const [note, setNote] = useState('');

	const handleSubmit = async () => {
		if (!amount || parseFloat(amount) <= 0) {
			showError('Please enter a valid amount');
			return;
		}

		if (note.length > 80) {
			showError('Note must be 80 characters or less');
			return;
		}

		try {
			const shopId = localStorage.getItem('shop_id');
			const userId = localStorage.getItem('user_id');

			await db.execute(
				`INSERT INTO expenses (id, shop_id, recorded_by, category, amount, note, created_at)
				VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
				[crypto.randomUUID(), shopId, userId, category, parseFloat(amount), note.trim() || null]
			);

			showSuccess('Expense recorded');
			setAmount('');
			setNote('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to record expense');
		}
	};

	const todayTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

	return (
		<div className="container mx-auto px-4 xl:px-0 py-6">
			<h1 className="text-2xl font-bold text-text mb-6">Record Expense</h1>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Left Panel - Expense Form */}
				<div className="lg:col-span-2 space-y-4">
				<div>
					<label className="block text-sm font-medium text-text mb-2">Category</label>
					<div className="grid grid-cols-3 gap-2">
						{categories.map(cat => {
							const Icon = cat.icon;
							return (
								<button
									key={cat.value}
									onClick={() => setCategory(cat.value)}
									className={`flex flex-col items-center gap-2 p-3 rounded border ${
										category === cat.value
											? 'bg-primary text-white border-primary'
											: 'bg-surface text-text border-border'
									}`}
								>
									<Icon size={24} />
									<span className="text-sm">{cat.label}</span>
								</button>
							);
						})}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-text mb-2">Amount (KSh)</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="0"
						min="0"
						step="0.01"
						className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text mb-2">
						Note (optional, max 80 chars)
					</label>
					<input
						type="text"
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder="Brief description"
						maxLength={80}
						className="w-full px-3 py-2 border border-border rounded bg-surface text-text"
					/>
					<div className="text-xs text-muted mt-1 text-right">{note.length}/80</div>
				</div>

				<button
					onClick={handleSubmit}
					disabled={!amount || parseFloat(amount) <= 0}
					className="w-full py-3 bg-primary text-white rounded font-medium hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Record Expense
				</button>
			</div>

			{/* Right Panel - Today's Expenses & Summary */}
			<div className="space-y-4">
				<div className="bg-surface border border-border rounded p-4">
					<h2 className="text-lg font-bold text-text mb-4">Today's Total</h2>
					<div className="text-3xl font-bold text-primary">
						KSh {todayTotal.toLocaleString()}
					</div>
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<h2 className="text-lg font-bold text-text mb-4">By Category</h2>
					<div className="space-y-2">
						{categories.map(cat => {
							const catTotal = expenses
								.filter(e => e.category === cat.value)
								.reduce((sum, e) => sum + e.amount, 0);
							const Icon = cat.icon;
							return (
								<div key={cat.value} className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<Icon size={16} className="text-primary" />
										<span className="text-sm text-muted">{cat.label}</span>
									</div>
									<span className="font-medium text-text">
										KSh {catTotal.toLocaleString()}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				<div className="bg-surface border border-border rounded p-4">
					<h2 className="text-lg font-bold text-text mb-4">Today's Expenses</h2>
					{expenses.length === 0 ? (
						<p className="text-center text-muted py-4">No expenses recorded today</p>
					) : (
						<div className="space-y-2">
							{expenses.map(exp => {
								const cat = categories.find(c => c.value === exp.category);
								const Icon = cat?.icon || FileText;
								return (
									<div
										key={exp.id}
										className="flex items-center justify-between py-2 border-b border-border last:border-0"
									>
										<div className="flex items-center gap-3 flex-1">
											<div className="p-2 bg-bg rounded">
												<Icon size={18} className="text-primary" />
											</div>
											<div className="flex-1">
												<div className="text-sm font-medium text-text capitalize">{exp.category}</div>
												{exp.note && <div className="text-xs text-muted truncate">{exp.note}</div>}
												<div className="text-xs text-muted">
													{new Date(exp.created_at).toLocaleTimeString()}
												</div>
											</div>
										</div>
										<div className="text-sm font-bold text-text">
											KSh {exp.amount.toLocaleString()}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
		</div>
	);
}
