import { column, Schema, Table } from '@powersync/web';

const products = new Table({
	shop_id: column.text,
	created_by: column.text,
	name: column.text,
	price: column.real,
	stock_count: column.integer,
	updated_at: column.text,
});

const sales = new Table({
	shop_id: column.text,
	recorded_by: column.text,
	product_id: column.text,
	debt_id: column.text,
	quantity: column.integer,
	total: column.real,
	payment_method: column.text,
	created_at: column.text,
});

const expenses = new Table({
	shop_id: column.text,
	recorded_by: column.text,
	category: column.text,
	amount: column.real,
	note: column.text,
	created_at: column.text,
});

const debts = new Table({
	shop_id: column.text,
	created_by: column.text,
	customer_name: column.text,
	phone: column.text,
	amount_owed: column.real,
	amount_paid: column.real,
	status: column.text,
	updated_at: column.text,
});

export const AppSchema = new Schema({ products, sales, expenses, debts });
