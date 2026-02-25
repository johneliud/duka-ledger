import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/lib/SettingsContext";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const { user, shop } = useAuth();
  const { lowStockThreshold, setLowStockThreshold } = useSettings();
  const [copied, setCopied] = useState(false);
  const [threshold, setThreshold] = useState(lowStockThreshold.toString());

  const copyInviteCode = async () => {
    if (shop?.invite_code) {
      await navigator.clipboard.writeText(shop.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setThreshold(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setLowStockThreshold(numValue);
    }
  };

  return (
    <div className="container mx-auto px-4 xl:px-0 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Shop Information */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Shop Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted">Shop Name</label>
              <p className="text-text mt-1">{shop?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted">Invite Code</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-bg px-3 py-2 rounded border border-border text-primary font-mono">
                  {shop?.invite_code}
                </code>
                <button
                  onClick={copyInviteCode}
                  className="p-2 hover:bg-bg rounded transition-colors"
                  title="Copy invite code"
                >
                  {copied ? (
                    <Check size={20} className="text-secondary" />
                  ) : (
                    <Copy size={20} className="text-muted" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted mt-2">
                Share this code with family members to invite them to your shop
              </p>
            </div>
          </div>
        </section>

        {/* Inventory Settings */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Inventory Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="lowStockThreshold" className="text-sm font-medium text-muted block mb-2">
                Low Stock Alert Threshold
              </label>
              <input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={threshold}
                onChange={handleThresholdChange}
                className="w-32 px-3 py-2 border border-border rounded bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded flex gap-2">
                <AlertTriangle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted">
                  <p className="font-medium text-text mb-1">What this does:</p>
                  <p>
                    Products with stock count below <strong className="text-primary">{lowStockThreshold}</strong> will 
                    appear in the "Low Stock Alert" section on your dashboard. This helps you restock items before they run out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Information */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-text mb-4">User Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted">Name</label>
              <p className="text-text mt-1">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted">ID Number</label>
              <p className="text-text mt-1">{user?.id_number}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted">Role</label>
              <p className="text-text mt-1 capitalize">{user?.role || 'member'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
