import { useEffect, useState } from 'react';
import { db } from '@/db/powersync';

interface QueryResult<T> {
	data: T[];
	isLoading: boolean;
	error: Error | null;
}

type Product = {
	id: string;
	shop_id: string;
	created_by: string;
	name: string;
	price: number;
	stock_count: number;
	updated_at: string;
};

type Sale = {
	id: string;
	shop_id: string;
	recorded_by: string;
	product_id: string;
	debt_id: string;
	quantity: number;
	total: number;
	payment_method: string;
	created_at: string;
};

type Expense = {
	id: string;
	shop_id: string;
	recorded_by: string;
	category: string;
	amount: number;
	note: string;
	created_at: string;
};

type Debt = {
	id: string;
	shop_id: string;
	created_by: string;
	customer_name: string;
	phone: string;
	amount_owed: number;
	amount_paid: number;
	status: string;
	updated_at: string;
};

export function useProducts(): QueryResult<Product> {
	const [data, setData] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const query = 'SELECT * FROM products ORDER BY name';
		
		const unsubscribe = db.watch(query, [], {
			onResult: (result) => {
				setData(result.rows?._array as Product[] || []);
				setIsLoading(false);
			},
			onError: (err) => {
				setError(err);
				setIsLoading(false);
			}
		});

		return unsubscribe;
	}, []);

	return { data, isLoading, error };
}

export function useSales(dateFilter?: string): QueryResult<Sale> {
	const [data, setData] = useState<Sale[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const query = dateFilter
			? 'SELECT * FROM sales WHERE DATE(created_at) = ? ORDER BY created_at DESC'
			: 'SELECT * FROM sales ORDER BY created_at DESC';
		const params = dateFilter ? [dateFilter] : [];

		const unsubscribe = db.watch(query, params, {
			onResult: (result) => {
				setData(result.rows?._array as Sale[] || []);
				setIsLoading(false);
			},
			onError: (err) => {
				setError(err);
				setIsLoading(false);
			}
		});

		return unsubscribe;
	}, [dateFilter]);

	return { data, isLoading, error };
}

export function useExpenses(dateFilter?: string): QueryResult<Expense> {
	const [data, setData] = useState<Expense[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const query = dateFilter
			? 'SELECT * FROM expenses WHERE DATE(created_at) = ? ORDER BY created_at DESC'
			: 'SELECT * FROM expenses ORDER BY created_at DESC';
		const params = dateFilter ? [dateFilter] : [];

		const unsubscribe = db.watch(query, params, {
			onResult: (result) => {
				setData(result.rows?._array as Expense[] || []);
				setIsLoading(false);
			},
			onError: (err) => {
				setError(err);
				setIsLoading(false);
			}
		});

		return unsubscribe;
	}, [dateFilter]);

	return { data, isLoading, error };
}

export function useDebts(status?: 'pending' | 'partial' | 'cleared'): QueryResult<Debt> {
	const [data, setData] = useState<Debt[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const query = status
			? 'SELECT * FROM debts WHERE status = ? ORDER BY updated_at DESC'
			: 'SELECT * FROM debts ORDER BY updated_at DESC';
		const params = status ? [status] : [];

		const unsubscribe = db.watch(query, params, {
			onResult: (result) => {
				setData(result.rows?._array as Debt[] || []);
				setIsLoading(false);
			},
			onError: (err) => {
				setError(err);
				setIsLoading(false);
			}
		});

		return unsubscribe;
	}, [status]);

	return { data, isLoading, error };
}
