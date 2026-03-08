import { useState } from 'react';
import { useProducts } from '@/hooks/useDatabase';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';
import { useSettings } from '@/lib/SettingsContext';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

export function Products() {
	const { data: products } = useProducts();
	const { showSuccess, showError } = useNotification();
	const { profitMargin } = useSettings();
	const [showForm, setShowForm] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [purchasePrice, setPurchasePrice] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [stock, setStock] = useState('');

	const handleSubmit = async () => {
		if (!name.trim() || !purchasePrice || parseFloat(purchasePrice) <= 0 || !price || parseFloat(price) <= 0 || !stock || parseInt(stock) < 0) {
			showError('Please fill all required fields correctly');
			return;
		}

		try {
			const shopId = localStorage.getItem('shop_id');
			const userId = localStorage.getItem('user_id');

			if (editId) {
				await db.execute(
					`UPDATE products SET name = ?, purchase_price = ?, price = ?, description = ?, stock_count = ?, updated_at = datetime('now') WHERE id = ?`,
					[name.trim(), parseFloat(purchasePrice), parseFloat(price), description.trim() || null, parseInt(stock), editId]
				);
				showSuccess('Product updated');
			} else {
				await db.execute(
					`INSERT INTO products (id, shop_id, created_by, name, purchase_price, price, description, stock_count, updated_at)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
					[crypto.randomUUID(), shopId, userId, name.trim(), parseFloat(purchasePrice), parseFloat(price), description.trim() || null, parseInt(stock)]
				);
				showSuccess('Product added');
			}

			setShowForm(false);
			setEditId(null);
			setName('');
			setPurchasePrice('');
			setPrice('');
			setDescription('');
			setStock('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to save product');
		}
	};

	const handleEdit = (product: typeof products[0]) => {
		setEditId(product.id);
		setName(product.name);
		setPurchasePrice(product.purchase_price?.toString() || '');
		setPrice(product.price.toString());
		setDescription(product.description || '');
		setStock(product.stock_count.toString());
		setShowForm(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await db.execute(`DELETE FROM products WHERE id = ?`, [id]);
			showSuccess('Product deleted');
			setDeleteId(null);
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to delete');
		}
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditId(null);
		setName('');
		setPurchasePrice('');
		setPrice('');
		setDescription('');
		setStock('');
	};

	return (
		<div className="container mx-auto px-4 xl:px-0 py-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-text">Products</h1>
				<button
					onClick={() => setShowForm(true)}
					className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-accent"
				>
					<Plus size={20} />
					Add Product
				</button>
			</div>

			{products.length === 0 ? (
				<div className="text-center py-12 text-muted bg-surface border border-border rounded">
					No products yet. Add your first product to start selling.
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{products.map(product => (
						<div
							key={product.id}
							className="bg-surface border border-border rounded p-4 hover:shadow-md transition-shadow"
						>
							<div className="flex items-start justify-between mb-3">
								<h3 className="font-medium text-text flex-1">{product.name}</h3>
								<div className="flex gap-1">
									<button
										onClick={() => handleEdit(product)}
										className="p-1.5 text-muted hover:text-primary hover:bg-bg rounded"
									>
										<Edit2 size={16} />
									</button>
									<button
										onClick={() => setDeleteId(product.id)}
										className="p-1.5 text-muted hover:text-primary hover:bg-bg rounded"
									>
										<Trash2 size={16} />
									</button>
								</div>
							</div>
							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted">Selling Price</span>
									<span className="text-lg font-bold text-primary">
										KSh {product.price.toLocaleString()}
									</span>
								</div>
								{product.purchase_price && (
									<div className="flex justify-between items-center">
										<span className="text-sm text-muted">Profit/Unit</span>
										<span className="text-sm font-medium text-green-600">
											KSh {(product.price - product.purchase_price).toLocaleString()}
										</span>
									</div>
								)}
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted">Stock</span>
									<span className={`font-medium ${product.stock_count < 5 ? 'text-accent' : 'text-text'}`}>
										{product.stock_count < 5 && <AlertTriangle size={14} className="inline mr-1" />}
										{product.stock_count} units
									</span>
								</div>
								{product.description && (
									<p className="text-xs text-muted mt-2 pt-2 border-t border-border">
										{product.description}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{showForm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-surface rounded p-6 max-w-md w-full">
						<h2 className="text-xl font-bold text-text mb-4">
							{editId ? 'Edit Product' : 'Add Product'}
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-text mb-1">Product Name</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g. Unga wa Sembe 2kg"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Purchase Price (KSh)</label>
								<input
									type="number"
									value={purchasePrice}
									onChange={(e) => {
										const pp = e.target.value;
										setPurchasePrice(pp);
										if (profitMargin > 0 && pp && parseFloat(pp) >= 0) {
											const calculated = parseFloat(pp) * (1 + profitMargin / 100);
											setPrice(calculated.toFixed(2));
										}
									}}
									placeholder="0"
									min="0"
									step="0.01"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Selling Price (KSh)</label>
								<input
									type="number"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="0"
									min="0"
									step="0.01"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Description (Optional)</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Additional details about the product"
									rows={2}
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text resize-none"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-text mb-1">Starting Stock Count</label>
								<input
									type="number"
									value={stock}
									onChange={(e) => setStock(e.target.value)}
									placeholder="0"
									min="0"
									className="w-full px-3 py-2 border border-border rounded bg-bg text-text"
								/>
							</div>
						</div>
						<div className="flex gap-2 mt-6">
							<button
								onClick={handleCancel}
								className="flex-1 px-4 py-2 border border-border rounded text-text"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className="flex-1 px-4 py-2 bg-primary text-white rounded"
							>
								{editId ? 'Update' : 'Add'}
							</button>
						</div>
					</div>
				</div>
			)}

			{deleteId && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
					<div className="bg-surface rounded p-6 max-w-sm w-full">
						<h3 className="text-lg font-bold text-text mb-2">Delete Product?</h3>
						<p className="text-muted mb-4">This action cannot be undone.</p>
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
