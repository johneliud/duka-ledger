import { db } from "@/db/powersync";
import jsPDF from "jspdf";

interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total: number;
  payment_method: string;
  created_at: string;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
  created_at: string;
}

interface Debt {
  id: string;
  customer_name: string;
  phone: string;
  amount_owed: number;
  amount_paid: number;
  status: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
}

export async function exportSalesToCSV() {
  const sales = await db.getAll<Sale>(
    "SELECT * FROM sales ORDER BY created_at DESC",
  );
  const headers = [
    "ID",
    "Product ID",
    "Quantity",
    "Total",
    "Payment Method",
    "Created At",
  ];
  const rows = sales.map((s) => [
    s.id,
    s.product_id,
    s.quantity,
    s.total,
    s.payment_method,
    s.created_at,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  downloadFile(csv, "sales.csv", "text/csv");
}

export async function exportExpensesToCSV() {
  const expenses = await db.getAll<Expense>(
    "SELECT * FROM expenses ORDER BY created_at DESC",
  );
  const headers = ["ID", "Category", "Amount", "Note", "Created At"];
  const rows = expenses.map((e) => [
    e.id,
    e.category,
    e.amount,
    e.note || "",
    e.created_at,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  downloadFile(csv, "expenses.csv", "text/csv");
}

export async function exportDebtsToCSV() {
  const debts = await db.getAll<Debt>(
    "SELECT * FROM debts ORDER BY updated_at DESC",
  );
  const headers = [
    "ID",
    "Customer Name",
    "Phone",
    "Amount Owed",
    "Amount Paid",
    "Status",
    "Updated At",
  ];
  const rows = debts.map((d) => [
    d.id,
    d.customer_name,
    d.phone || "",
    d.amount_owed,
    d.amount_paid,
    d.status,
    d.updated_at,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  downloadFile(csv, "debts.csv", "text/csv");
}

export async function exportSalesToPDF() {
  const sales = await db.getAll<Sale>(
    "SELECT * FROM sales ORDER BY created_at DESC LIMIT 50",
  );
  const products = await db.getAll<Product>("SELECT id, name FROM products");
  const doc = new jsPDF();
  const shopName = localStorage.getItem("shop_name") || "Duka Ledger";

  // Header with branding
  doc.setFillColor(196, 98, 45);
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Duka Ledger", 14, 15);
  doc.setFontSize(12);
  doc.text(shopName, 14, 23);
  doc.setFontSize(16);
  doc.text("Sales Report", 14, 31);

  doc.setTextColor(44, 26, 14);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
  doc.text(`Total Records: ${sales.length}`, 14, 47);

  // Table header
  let y = 55;
  doc.setFillColor(232, 216, 200);
  doc.rect(14, y - 5, 182, 8, "F");
  doc.setDrawColor(158, 136, 120);
  doc.setLineWidth(0.5);
  doc.line(14, y - 5, 196, y - 5);
  doc.line(14, y + 3, 196, y + 3);

  doc.setFontSize(10);
  doc.text("#", 16, y);
  doc.text("Product", 25, y);
  doc.text("Qty", 85, y);
  doc.text("Total", 105, y);
  doc.text("Payment", 130, y);
  doc.text("Date", 165, y);

  y += 8;
  doc.setFontSize(8);

  const getProductName = (id: string) =>
    products.find((p: Product) => p.id === id)?.name || "Unknown";

  sales.forEach((sale, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.line(14, y - 3, 196, y - 3);
    doc.text(`${i + 1}`, 16, y);
    doc.text(getProductName(sale.product_id).substring(0, 25), 25, y);
    doc.text(`${sale.quantity}`, 85, y);
    doc.text(`${sale.total.toLocaleString()}`, 105, y);
    doc.text(sale.payment_method, 130, y);
    doc.text(new Date(sale.created_at).toLocaleDateString(), 165, y);
    y += 7;
  });

  doc.line(14, y - 3, 196, y - 3);

  // Footer
  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  doc.setFillColor(232, 145, 58);
  doc.rect(0, 285, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(`Total Sales: KSh ${totalSales.toLocaleString()}`, 14, 292);

  doc.save(`${shopName}_sales_${new Date().toISOString().split("T")[0]}.pdf`);
}

export async function exportExpensesToPDF() {
  const expenses = await db.getAll<Expense>(
    "SELECT * FROM expenses ORDER BY created_at DESC LIMIT 50",
  );
  const doc = new jsPDF();
  const shopName = localStorage.getItem("shop_name") || "Duka Ledger";

  // Header with branding
  doc.setFillColor(196, 98, 45);
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Duka Ledger", 14, 15);
  doc.setFontSize(12);
  doc.text(shopName, 14, 23);
  doc.setFontSize(16);
  doc.text("Expenses Report", 14, 31);

  doc.setTextColor(44, 26, 14);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
  doc.text(`Total Records: ${expenses.length}`, 14, 47);

  // Table header
  let y = 55;
  doc.setFillColor(232, 216, 200);
  doc.rect(14, y - 5, 182, 8, "F");
  doc.setDrawColor(158, 136, 120);
  doc.setLineWidth(0.5);
  doc.line(14, y - 5, 196, y - 5);
  doc.line(14, y + 3, 196, y + 3);

  doc.setFontSize(10);
  doc.text("#", 16, y);
  doc.text("Category", 25, y);
  doc.text("Amount", 70, y);
  doc.text("Note", 105, y);
  doc.text("Date", 165, y);

  y += 8;
  doc.setFontSize(8);

  expenses.forEach((expense, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.line(14, y - 3, 196, y - 3);
    doc.text(`${i + 1}`, 16, y);
    doc.text(expense.category, 25, y);
    doc.text(`${expense.amount.toLocaleString()}`, 70, y);
    doc.text(expense.note?.substring(0, 35) || "-", 105, y);
    doc.text(new Date(expense.created_at).toLocaleDateString(), 165, y);
    y += 7;
  });

  doc.line(14, y - 3, 196, y - 3);

  // Footer
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  doc.setFillColor(232, 145, 58);
  doc.rect(0, 285, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(`Total Expenses: KSh ${totalExpenses.toLocaleString()}`, 14, 292);

  doc.save(
    `${shopName}_expenses_${new Date().toISOString().split("T")[0]}.pdf`,
  );
}

export async function exportDebtsToPDF() {
  const debts = await db.getAll<Debt>(
    "SELECT * FROM debts ORDER BY updated_at DESC",
  );
  const doc = new jsPDF();
  const shopName = localStorage.getItem("shop_name") || "Duka Ledger";

  // Header with branding
  doc.setFillColor(196, 98, 45);
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Duka Ledger", 14, 15);
  doc.setFontSize(12);
  doc.text(shopName, 14, 23);
  doc.setFontSize(16);
  doc.text("Debt Book Report", 14, 31);

  doc.setTextColor(44, 26, 14);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);
  doc.text(`Total Records: ${debts.length}`, 14, 47);

  // Table header
  let y = 55;
  doc.setFillColor(232, 216, 200);
  doc.rect(14, y - 5, 182, 8, "F");
  doc.setDrawColor(158, 136, 120);
  doc.setLineWidth(0.5);
  doc.line(14, y - 5, 196, y - 5);
  doc.line(14, y + 3, 196, y + 3);

  doc.setFontSize(10);
  doc.text("#", 16, y);
  doc.text("Customer", 25, y);
  doc.text("Phone", 75, y);
  doc.text("Owed", 110, y);
  doc.text("Paid", 140, y);
  doc.text("Balance", 165, y);

  y += 8;
  doc.setFontSize(8);

  debts.forEach((debt, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.line(14, y - 3, 196, y - 3);
    const balance = debt.amount_owed - debt.amount_paid;
    doc.text(`${i + 1}`, 16, y);
    doc.text(debt.customer_name.substring(0, 20), 25, y);
    doc.text(debt.phone?.substring(0, 12) || "-", 75, y);
    doc.text(`${debt.amount_owed.toLocaleString()}`, 110, y);
    doc.text(`${debt.amount_paid.toLocaleString()}`, 140, y);
    doc.text(`${balance.toLocaleString()}`, 165, y);
    y += 7;
  });

  doc.line(14, y - 3, 196, y - 3);

  // Footer
  const totalOwed = debts.reduce((sum, d) => sum + d.amount_owed, 0);
  const totalPaid = debts.reduce((sum, d) => sum + d.amount_paid, 0);
  const pending = totalOwed - totalPaid;
  doc.setFillColor(232, 145, 58);
  doc.rect(0, 285, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(
    `Total Owed: KSh ${totalOwed.toLocaleString()} | Paid: KSh ${totalPaid.toLocaleString()} | Pending: KSh ${pending.toLocaleString()}`,
    14,
    292,
  );

  doc.save(`${shopName}_debts_${new Date().toISOString().split("T")[0]}.pdf`);
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
