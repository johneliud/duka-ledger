import { column, Schema, Table } from "@powersync/web";

const products = new Table(
  {
    shop_id: column.text,
    created_by: column.text,
    name: column.text,
    purchase_price: column.text,
    price: column.text,
    description: column.text,
    stock_count: column.integer,
    updated_at: column.text,
  },
  { indexes: {} },
);

const sales = new Table(
  {
    shop_id: column.text,
    recorded_by: column.text,
    product_id: column.text,
    debt_id: column.text,
    quantity: column.integer,
    total: column.text,
    payment_method: column.text,
    created_at: column.text,
  },
  { indexes: {} },
);

const expenses = new Table(
  {
    shop_id: column.text,
    recorded_by: column.text,
    category: column.text,
    amount: column.text,
    note: column.text,
    created_at: column.text,
  },
  { indexes: {} },
);

const debts = new Table(
  {
    shop_id: column.text,
    created_by: column.text,
    customer_name: column.text,
    phone: column.text,
    amount_owed: column.text,
    amount_paid: column.text,
    status: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

export const AppSchema = new Schema({
  products,
  sales,
  expenses,
  debts,
});

export type Database = (typeof AppSchema)["types"];
