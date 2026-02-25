import { useState } from 'react';
import { useProducts } from '@/hooks/useDatabase';
import { db } from '@/db/powersync';
import { useNotification } from '@/hooks/useNotification';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

export function Products() {
	const { data: products } = useProducts();
	const { showSuccess, showError } = useNotification();
	const [showForm, setShowForm] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');

	const handleSubmit = async () => {
		if (!name.trim() || !price || parseFloat(price) <= 0 || !stock || parseInt(stock) < 0) {
			showError('Please fill all fields correctly');
			return;
		}

		try {
			const shopId = localStorage.getItem('shop_id');
			const userId = localStorage.getItem('user_id');

			if (editId) {
				await db.execute(
					`UPDATE products SET name = ?, price = ?, stock_count = ?, updated_at = datetime('now') WHERE id = ?`,
					[name.trim(), parseFloat(price), parseInt(stock), editId]
				);
				showSuccess('Product updated');
			} else {
				await db.execute(
					`INSERT INTO products (id, shop_id, created_by, name, price, stock_count, updated_at)
					VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
					[crypto.randomUUID(), shopId, userId, name.trim(), parseFloat(price), parseInt(stock)]
				);
				showSuccess('Product added');
			}

			setShowForm(false);
			setEditId(null);
			setName('');
			setPrice('');
			setStock('');
		} catch (err) {
			showError(err instanceof Error ? err.message : 'Failed to save product');
		}
	};

	const handleEdit = (product: typeof products[0]) => {
		setEditId(product.id);
		setName(product.name);
		setPrice(product.price.toString());
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
		setPrice('');
		setStock('');
	};

	return (
		<div className="max-w-2xl mx-auto p-4">
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
				<div className="text-center py-12 text-muted">
					No products yet. Add your first product to start selling.
				</div>
			) : (
				<div className="grid gap-3">
					{products.map(product => (
						<div
							key={product.id}
							className="bg-surface border border-border rounded p-4"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h3 className="font-medium text-text">{product.name}</h3>
									<div className="text-sm text-muted mt-1">
										KSh {product.price.toLocaleString()}
									</div>
									<div className={`text-sm mt-1 ${product.stock_count < 5 ? 'text-accent font-medium' : 'text-muted'}`}>
										{product.stock_count < 5 && <AlertTriangle size={14} className="inline mr-1" />}
										Stock: {product.stock_count}
									</div>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(product)}
										className="p-2 text-muted hover:text-primary"
									>
										<Edit2 size={18} />
									</button>
									<button
										onClick={() => setDeleteId(product.id)}
										className="p-2 text-muted hover:text-primary"
									>
										<Trash2 size={18} />
									</button>
								</div>
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
