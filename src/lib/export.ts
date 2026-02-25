import { db } from '@/db/powersync';
import jsPDF from 'jspdf';

export async function exportSalesToCSV() {
	const sales = await db.getAll('SELECT * FROM sales ORDER BY created_at DESC');
	const headers = ['ID', 'Product ID', 'Quantity', 'Total', 'Payment Method', 'Created At'];
	const rows = sales.map(s => [s.id, s.product_id, s.quantity, s.total, s.payment_method, s.created_at]);
	
	const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
	downloadFile(csv, 'sales.csv', 'text/csv');
}

export async function exportExpensesToCSV() {
	const expenses = await db.getAll('SELECT * FROM expenses ORDER BY created_at DESC');
	const headers = ['ID', 'Category', 'Amount', 'Note', 'Created At'];
	const rows = expenses.map(e => [e.id, e.category, e.amount, e.note || '', e.created_at]);
	
	const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
	downloadFile(csv, 'expenses.csv', 'text/csv');
}

export async function exportDebtsToCSV() {
	const debts = await db.getAll('SELECT * FROM debts ORDER BY updated_at DESC');
	const headers = ['ID', 'Customer Name', 'Phone', 'Amount Owed', 'Amount Paid', 'Status', 'Updated At'];
	const rows = debts.map(d => [d.id, d.customer_name, d.phone || '', d.amount_owed, d.amount_paid, d.status, d.updated_at]);
	
	const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
	downloadFile(csv, 'debts.csv', 'text/csv');
}

export async function exportSalesToPDF() {
	const sales = await db.getAll('SELECT * FROM sales ORDER BY created_at DESC LIMIT 50');
	const doc = new jsPDF();
	
	doc.setFontSize(16);
	doc.text('Sales Report', 14, 15);
	doc.setFontSize(10);
	doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
	
	let y = 30;
	sales.forEach((sale, i) => {
		if (y > 270) {
			doc.addPage();
			y = 20;
		}
		doc.text(`${i + 1}. Qty: ${sale.quantity} | Total: KSh ${sale.total} | ${sale.payment_method}`, 14, y);
		y += 7;
	});
	
	doc.save('sales.pdf');
}

export async function exportExpensesToPDF() {
	const expenses = await db.getAll('SELECT * FROM expenses ORDER BY created_at DESC LIMIT 50');
	const doc = new jsPDF();
	
	doc.setFontSize(16);
	doc.text('Expenses Report', 14, 15);
	doc.setFontSize(10);
	doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
	
	let y = 30;
	expenses.forEach((expense, i) => {
		if (y > 270) {
			doc.addPage();
			y = 20;
		}
		doc.text(`${i + 1}. ${expense.category} | KSh ${expense.amount} | ${expense.note || ''}`, 14, y);
		y += 7;
	});
	
	doc.save('expenses.pdf');
}

export async function exportDebtsToPDF() {
	const debts = await db.getAll('SELECT * FROM debts ORDER BY updated_at DESC');
	const doc = new jsPDF();
	
	doc.setFontSize(16);
	doc.text('Debts Report', 14, 15);
	doc.setFontSize(10);
	doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
	
	let y = 30;
	debts.forEach((debt, i) => {
		if (y > 270) {
			doc.addPage();
			y = 20;
		}
		doc.text(`${i + 1}. ${debt.customer_name} | Owed: KSh ${debt.amount_owed} | Paid: KSh ${debt.amount_paid}`, 14, y);
		y += 7;
	});
	
	doc.save('debts.pdf');
}

function downloadFile(content: string, filename: string, type: string) {
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
