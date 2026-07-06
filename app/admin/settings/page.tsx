"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Save,
  Check,
  RotateCcw,
  Landmark,
  MessageSquare,
  Shield,
  HelpCircle,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Activity,
  Percent,
  Sliders,
  Bell
} from "lucide-react";

interface AdminSettings {
  bankName: string;
  accountNo: string;
  accountName: string;
  minFunding: number;
  vtuDiscount: number;
  supportGreeting: string;
  isSystemOffline: boolean;
  alertThreshold: number;
  announcementTitle: string;
  announcementMessage: string;
  announcementActive: boolean;
  announcementId: string;
}

const DEFAULT_SETTINGS: AdminSettings = {
  bankName: "Wema Bank / Flutterwave",
  accountNo: "0123456789",
  accountName: "SurePlug Pro Collections",
  minFunding: 500,
  vtuDiscount: 2.5,
  supportGreeting: "Hello! Thank you for contacting SurePlug. If you have any questions regarding pending wallet funding, failed data delivery, or billing, please send us a message here.",
  isSystemOffline: false,
  alertThreshold: 1000,
  announcementTitle: "Welcome to SurePlug Pro! 🚀",
  announcementMessage: "We have upgraded our network nodes for 5x faster VTU data deliveries. Enjoy automated instant funding on all wallets. Please contact support if you have any questions.",
  announcementActive: true,
  announcementId: "welcome-init",
};

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load settings
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("datasub_admin_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        setSettings(DEFAULT_SETTINGS);
      }
    } else {
      localStorage.setItem("datasub_admin_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
  }, []);

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      ...settings,
      announcementId: `announcement-${Date.now()}`
    };
    localStorage.setItem("datasub_admin_settings", JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Reset to default
  const handleReset = () => {
    if (confirm("Are you sure you want to reset all configurations to site default values?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem("datasub_admin_settings", JSON.stringify(DEFAULT_SETTINGS));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Settings Panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900">
      
      {/* Mobile Header / Navigation Bar */}
      <header className="lg:hidden bg-[#0F172A] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-black text-xs">SP</div>
          <span className="font-extrabold text-sm tracking-tight">SurePlug Admin</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-300"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation - Shared across Admin Portal */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 z-50 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:static`}>
        <div className="p-6 border-b border-slate-700/40 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-sm">SP</div>
            <span className="font-black text-white tracking-tight text-base">SurePlug Pro</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white cursor-pointer p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
          Admin Operations
        </div>

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard size={16} />
            Overview Dashboard
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users size={16} />
            Users & Funding
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings size={16} />
            Portal Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-extrabold uppercase tracking-widest py-3 transition-colors text-center"
          >
            User Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Settings Page Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Link href="/admin" className="hover:text-slate-900 transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-slate-600">Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight flex items-center gap-2.5">
              <Sliders className="text-blue-600" size={24} />
              Portal Control Center
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Customize payment credentials, transaction constraints, discounts, and automated responses.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <RotateCcw size={13} className="stroke-[2.5px]" />
              Defaults
            </button>
          </div>
        </header>

        {isSaved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in shadow-xs">
            <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Check size={14} className="stroke-[3px]" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider">
              System Settings Updated Successfully! Changes are now active across the site.
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Wallet Funding & Settlement Bank */}
          <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <header className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="h-8 w-8 bg-amber-50 border border-amber-200/40 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <Landmark size={16} className="stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Payment Configuration</h3>
                <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Default Settlement Bank</h2>
              </div>
            </header>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-1">
                Enter details for the automatic peer bank transfer options. Customers will see these coordinates when they choose to fund their SurePlug wallet.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Settlement Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.bankName}
                    onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Merchant Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.accountNo}
                    onChange={(e) => setSettings({ ...settings, accountNo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-mono font-black text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Receiver Account Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.accountName}
                    onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-900 uppercase bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Financial Limits & Airtime Constraints */}
          <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <header className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-50 border border-blue-200/40 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Percent size={16} className="stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Transaction Constraints</h3>
                <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Limits & Service Incentives</h2>
              </div>
            </header>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Minimum Funding Allowed (₦)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="1"
                    required
                    value={settings.minFunding}
                    onChange={(e) => setSettings({ ...settings, minFunding: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    System-wide VTU Data Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    required
                    value={settings.vtuDiscount}
                    onChange={(e) => setSettings({ ...settings, vtuDiscount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                    Low Balance Alert Threshold (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={settings.alertThreshold}
                    onChange={(e) => setSettings({ ...settings, alertThreshold: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Automatic Support Greeting & Platform Status */}
          <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <header className="px-6 py-5 border-b border-slate-100 bg-[#FAF9F6] flex items-center gap-3">
              <div className="h-8 w-8 bg-[#FAF0E6] border border-orange-200/40 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                <MessageSquare size={16} className="stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Customer Outreach</h3>
                <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">Auto-Responses & System Alerts</h2>
              </div>
            </header>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
                  Support Chat Greeting Welcome Response
                </label>
                <textarea
                  required
                  rows={3}
                  value={settings.supportGreeting}
                  onChange={(e) => setSettings({ ...settings, supportGreeting: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase">Platform Status Override</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Toggle site into maintenance mode during upgrades.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, isSystemOffline: !settings.isSystemOffline })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.isSystemOffline ? "bg-red-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.isSystemOffline ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {settings.isSystemOffline ? "Platform Suspended" : "Platform Active"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: User Announcement Pop-up Settings */}
          <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden animate-fade-in">
            <header className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-50 border border-blue-200/40 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Bell size={16} className="stroke-[2.5px]" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">User Notifications</h3>
                <h2 className="text-sm font-black uppercase text-slate-800 tracking-tight">System-Wide Announcement Popup</h2>
              </div>
            </header>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-400 font-medium leading-relaxed mb-1">
                Configure a pop-up modal that appears automatically on the dashboard for all logged-in users when they access their portal.
              </p>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-sans">
                  Announcement Header / Title
                </label>
                <input
                  type="text"
                  required
                  value={settings.announcementTitle}
                  onChange={(e) => setSettings({ ...settings, announcementTitle: e.target.value })}
                  placeholder="e.g., Important Security Upgrade!"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 font-sans">
                  Detailed Notification Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={settings.announcementMessage}
                  onChange={(e) => setSettings({ ...settings, announcementMessage: e.target.value })}
                  placeholder="Type the message to display inside the user modal pop-up..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-900 bg-slate-50/30 outline-none focus:border-blue-600 focus:bg-white transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Bell size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase">Popup Visibility Status</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Toggle whether the announcement pop-up should show up for users.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, announcementActive: !settings.announcementActive })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.announcementActive ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.announcementActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {settings.announcementActive ? "Popup Display Enabled" : "Popup Display Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Form Action Controls */}
          <footer className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-black uppercase tracking-wider text-slate-600 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Save size={14} className="stroke-[3px]" />
              Commit Settings
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
