import { useState } from "react";
import { useSales } from "@/hooks/useDatabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, FileText } from "lucide-react";
import {
  exportSalesToCSV,
  exportExpensesToCSV,
  exportDebtsToCSV,
  exportSalesToPDF,
  exportExpensesToPDF,
  exportDebtsToPDF,
} from "@/lib/export";
import { useNotification } from "@/hooks/useNotification";

type ViewType = "week" | "month";

export function Analytics() {
  const [view, setView] = useState<ViewType>("week");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { data: allSales } = useSales();
  const { showSuccess, showError } = useNotification();

  const handleExport = async (
    type: "csv" | "pdf",
    entity: "sales" | "expenses" | "debts",
  ) => {
    setShowExportMenu(false);
    try {
      if (type === "csv") {
        if (entity === "sales") await exportSalesToCSV();
        else if (entity === "expenses") await exportExpensesToCSV();
        else await exportDebtsToCSV();
      } else {
        if (entity === "sales") await exportSalesToPDF();
        else if (entity === "expenses") await exportExpensesToPDF();
        else await exportDebtsToPDF();
      }
      showSuccess(`${entity} exported as ${type.toUpperCase()}`);
    } catch {
      showError("Export failed");
    }
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    return days;
  };

  const getLast4Weeks = () => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - i * 7);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      weeks.push({
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
        label: `Week ${4 - i}`,
      });
    }
    return weeks;
  };

  const getWeeklyData = () => {
    const days = getLast7Days();
    return days.map((day) => {
      const daySales = allSales.filter((s) =>
        s.created_at.startsWith(day.date),
      );
      const total = daySales.reduce((sum, s) => sum + s.total, 0);
      return {
        name: day.label,
        total,
        count: daySales.length,
      };
    });
  };

  const getMonthlyData = () => {
    const weeks = getLast4Weeks();
    return weeks.map((week) => {
      const weekSales = allSales.filter((s) => {
        const saleDate = s.created_at.split("T")[0];
        return saleDate >= week.start && saleDate <= week.end;
      });
      const total = weekSales.reduce((sum, s) => sum + s.total, 0);
      return {
        name: week.label,
        total,
        count: weekSales.length,
      };
    });
  };

  const data = view === "week" ? getWeeklyData() : getMonthlyData();

  return (
    <div className="container mx-auto px-4 xl:px-0 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-text">Analytics</h1>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-secondary text-white rounded flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Download size={18} />
              Export
            </button>
            {showExportMenu && (
              <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-1 bg-surface border border-border rounded shadow-lg z-10 min-w-[200px]">
                <button
                  onClick={() => handleExport("csv", "sales")}
                  className="w-full px-4 py-2 text-left hover:bg-bg flex items-center gap-2"
                >
                  <FileText size={16} /> Sales CSV
                </button>
                <button
                  onClick={() => handleExport("pdf", "sales")}
                  className="w-full px-4 py-2 text-left hover:bg-bg flex items-center gap-2"
                >
                  <FileText size={16} /> Sales PDF
                </button>
                <button
                  onClick={() => handleExport("csv", "expenses")}
                  className="w-full px-4 py-2 text-left hover:bg-bg flex items-center gap-2"
                >
                  <FileText size={16} /> Expenses CSV
                </button>
                <button
                  onClick={() => handleExport("pdf", "expenses")}
                  className="w-full px-4 py-2 text-left hover:bg-bg flex items-center gap-2"
                >
                  <FileText size={16} /> Expenses PDF
                </button>
                <button
                  onClick={() => handleExport("csv", "debts")}
                  className="w-full px-4 py-2 text-left hover:bg-bg flex items-center gap-2"
                >
                  <FileText size={16} /> Debts CSV
                </button>
                <button
                  onClick={() => handleExport("pdf", "debts")}
                  className="w-full px-4 py-2 text-left hover:bg-bg flex items-center gap-2"
                >
                  <FileText size={16} /> Debts PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 rounded ${
                view === "week"
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text"
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 rounded ${
                view === "month"
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text"
              }`}
            >
              Last 4 Weeks
            </button>
          </div>

          <div className="bg-surface border border-border rounded p-6">
            <h2 className="text-lg font-bold text-text mb-4">
              {view === "week"
                ? "Daily Sales (Last 7 Days)"
                : "Weekly Sales (Last 4 Weeks)"}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d8c8" />
                <XAxis dataKey="name" stroke="#9e8878" />
                <YAxis stroke="#9e8878" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8d8c8",
                    borderRadius: "4px",
                  }}
                  formatter={(value) => [
                    `KSh ${(value || 0).toLocaleString()}`,
                    "Sales",
                  ]}
                />
                <Bar dataKey="total" fill="#c4622d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-surface border border-border rounded p-4">
            <h3 className="font-medium text-text mb-3">Period Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted">Total Sales</div>
                <div className="text-2xl font-bold text-primary">
                  KSh{" "}
                  {data.reduce((sum, d) => sum + d.total, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Transactions</div>
                <div className="text-2xl font-bold text-text">
                  {data.reduce((sum, d) => sum + d.count, 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted">Average</div>
                <div className="text-2xl font-bold text-text">
                  KSh{" "}
                  {Math.round(
                    data.reduce((sum, d) => sum + d.total, 0) / data.length,
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Breakdown */}
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded p-4">
            <h3 className="font-medium text-text mb-3">Daily Breakdown</h3>
            <div className="space-y-2">
              {data.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted">{item.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-text">
                      KSh {item.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">{item.count} sales</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded p-4">
            <h3 className="font-medium text-text mb-3">Insights</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted">Best Day: </span>
                <span className="font-medium text-text">
                  {
                    data.reduce(
                      (max, d) => (d.total > max.total ? d : max),
                      data[0],
                    ).name
                  }
                </span>
              </div>
              <div>
                <span className="text-muted">Peak Sales: </span>
                <span className="font-medium text-primary">
                  KSh {Math.max(...data.map((d) => d.total)).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted">Lowest Day: </span>
                <span className="font-medium text-text">
                  {
                    data.reduce(
                      (min, d) => (d.total < min.total ? d : min),
                      data[0],
                    ).name
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
