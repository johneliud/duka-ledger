import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/lib/SettingsContext";
import { Copy, Check, AlertTriangle, RotateCcw, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ShopMember {
  id: string;
  name: string;
  id_number: string;
  role: string;
  joined_at: string;
}

export function Settings() {
  const { user, shop } = useAuth();
  const {
    lowStockThreshold,
    setLowStockThreshold,
    profitMargin,
    setProfitMargin,
  } = useSettings();
  const { t } = useTranslation();
  // const { t, i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [threshold, setThreshold] = useState(lowStockThreshold.toString());
  const [margin, setMargin] = useState(profitMargin.toString());
  const [members, setMembers] = useState<ShopMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!shop?.id) return;

      try {
        const API_URL = import.meta.env.API_URL;
        const session = localStorage.getItem("duka_session");
        const token = session ? JSON.parse(session).token : null;

        if (!token) {
          setLoadingMembers(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/shop/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMembers(data.members || []);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [shop?.id]);

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

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMargin(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setProfitMargin(numValue);
    }
  };

  // const changeLanguage = (lng: string) => {
  //   i18n.changeLanguage(lng);
  //   localStorage.setItem('language', lng);
  // };

  const restartTour = () => {
    if (user) {
      localStorage.removeItem(`tour_completed_${user.id}`);
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 xl:px-0 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">
        {t("settings.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          {/* Shop Information */}
          <section className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text mb-4">
              {t("settings.shopInfo")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted">
                  {t("settings.shopName")}
                </label>
                <p className="text-text mt-1">{shop?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">
                  {t("settings.inviteCode")}
                </label>
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
                  {t("settings.inviteCodeDesc")}
                </p>
              </div>
            </div>
          </section>

          {/* Inventory Settings */}
          <section className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text mb-4">
              {t("settings.inventorySettings")}
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="lowStockThreshold"
                  className="text-sm font-medium text-muted block mb-2"
                >
                  {t("settings.lowStockThreshold")}
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
                  <AlertTriangle
                    size={20}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <div className="text-sm text-muted">
                    <p className="font-medium text-text mb-1">
                      {t("settings.whatThisDoes")}
                    </p>
                    <p>
                      {t("settings.lowStockDesc")}{" "}
                      <strong className="text-primary">
                        {lowStockThreshold}
                      </strong>{" "}
                      {t("settings.lowStockDesc2")}
                    </p>
                  </div>
                </div>
              </div>
						</div>
						<div className="space-y-4 pt-4">
							<div>
                <label htmlFor="profitMargin" className="text-sm font-medium text-muted block mb-2">
                  {t("settings.profitMargin")}
                </label>
                <input
                  id="profitMargin"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={margin}
                  onChange={handleMarginChange}
                  className="w-32 px-3 py-2 border border-border rounded bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="mt-3 p-3 bg-accent/10 border border-accent/20 rounded flex gap-2">
                  <AlertTriangle
                    size={20}
                    className="text-accent shrink-0 mt-0.5"
                  />
                  <div className="text-sm text-muted">
                    <p className="font-medium text-text mb-1">
                      {t("settings.whatThisDoes")}
                    </p>
                    <p>
                      {t("settings.profitMarginDesc")}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shop Members */}
          <section className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-primary" />
              <h2 className="text-xl font-semibold text-text">Shop Members</h2>
            </div>
            {loadingMembers ? (
              <p className="text-muted text-sm">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-muted text-sm">
                No members yet. Share your invite code to add members.
              </p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-text font-medium">{member.name}</p>
                      <p className="text-sm text-muted">{member.id_number}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary capitalize">
                      {member.role === "owner" ? "Owner" : "Member"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* User Information */}
          <section className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text mb-4">
              {t("settings.userInfo")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted">
                  {t("settings.name")}
                </label>
                <p className="text-text mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">
                  {t("settings.idNumber")}
                </label>
                <p className="text-text mt-1">{user?.id_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">
                  {t("settings.role")}
                </label>
                <p className="text-text mt-1 capitalize">
                  {user?.role || "member"}
                </p>
              </div>
            </div>
          </section>

          {/* App Settings */}
          <section className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text mb-4">
              {t("settings.appSettings")}
            </h2>
            <div className="space-y-4">
              {/* <div>
                <label htmlFor="language" className="text-sm font-medium text-muted block mb-2">
                  {t('settings.language')}
                </label>
                <select
                  id="language"
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div> */}
              <div>
                <label className="text-sm font-medium text-muted block mb-2">
                  {t("settings.restartTour")}
                </label>
                <button
                  onClick={restartTour}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  <RotateCcw size={18} />
                  {t("settings.restartTour")}
                </button>
                <p className="text-sm text-muted mt-2">
                  {t("settings.restartTourDesc")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
