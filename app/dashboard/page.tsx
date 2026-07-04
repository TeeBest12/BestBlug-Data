"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Database,
  Headphones,
  History,
  LogOut,
  Phone,
  Plus,
  Settings,
  MoreVertical,
  Tv,
  User,
  Wallet,
  Wifi,
  Zap,
  Copy,
  Check,
  Search,
  AlertTriangle,
  Sparkles,
  X,
  Gift,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const services = [
  {
    title: "MTN Data",
    icon: Database,
    href: "/dashboard/buy-data",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    badge: "SME",
  },
  {
    title: "Airtel Data",
    icon: Phone,
    href: "/dashboard/buy-data",
    color: "bg-red-50 text-red-600 border-red-100",
    badge: "CG",
  },
  {
    title: "Glo Data",
    icon: Tv,
    href: "/dashboard/buy-data",
    color: "bg-green-50 text-green-600 border-green-100",
    badge: "Gifting",
  },
  {
    title: "9Mobile Data",
    icon: Zap,
    href: "/dashboard/buy-data",
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
    badge: "Lite",
  },
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "#88219",
    name: "MTN 2GB SME",
    number: "08033123456",
    amount: "-₦490.00",
    status: "Successful",
    date: "10:45 AM",
  },
  {
    id: "#88214",
    name: "Wallet Funding",
    number: "—",
    amount: "+₦10,000.00",
    status: "Successful",
    date: "09:12 AM",
  },
  {
    id: "#88209",
    name: "Airtel 5GB",
    number: "09012345678",
    amount: "-₦1,450.00",
    status: "Failed",
    date: "Yesterday",
  },
  {
    id: "#88192",
    name: "Ikeja Electric",
    number: "0422199081",
    amount: "-₦5,000.00",
    status: "Successful",
    date: "Yesterday",
  },
  {
    id: "#88188",
    name: "DSTV Compact",
    number: "1022341902",
    amount: "-₦12,500.00",
    status: "Pending",
    date: "Yesterday",
  },
];

const monthlyData = [
  { month: "Jan", Data: 12400, Airtime: 4200, Cable: 8500, Electricity: 6000 },
  { month: "Feb", Data: 14500, Airtime: 3800, Cable: 8500, Electricity: 7500 },
  { month: "Mar", Data: 18200, Airtime: 5100, Cable: 12500, Electricity: 9000 },
  { month: "Apr", Data: 16000, Airtime: 4600, Cable: 12500, Electricity: 8000 },
  { month: "May", Data: 21000, Airtime: 6000, Cable: 12500, Electricity: 10500 },
  { month: "Jun", Data: 25000, Airtime: 7500, Cable: 12500, Electricity: 12000 },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [balance, setBalance] = useState(25000);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
    const seen = localStorage.getItem("datasub_seen_update_v1_1");
    if (!seen) {
      setShowUpdatePopup(true);
    }

    // Load balance from localStorage or set default
    const savedBalance = localStorage.getItem("datasub_balance");
    if (savedBalance) {
      setBalance(Number(savedBalance));
    } else {
      localStorage.setItem("datasub_balance", "25000");
    }

    // Load transactions from localStorage or set default
    const savedTx = localStorage.getItem("datasub_transactions");
    if (savedTx) {
      try {
        setTransactions(JSON.parse(savedTx));
      } catch (e) {
        setTransactions(DEFAULT_TRANSACTIONS);
      }
    } else {
      setTransactions(DEFAULT_TRANSACTIONS);
      localStorage.setItem("datasub_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
    }
  }, []);

  const dismissUpdatePopup = () => {
    setShowUpdatePopup(false);
    localStorage.setItem("datasub_seen_update_v1_1", "true");
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.number.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] font-sans text-slate-900 dark:text-slate-100 overflow-hidden w-full transition-colors duration-200">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 hidden lg:flex border-r border-slate-800">
        <div className="p-6 border-b border-slate-700/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">BB</div>
            <span className="font-bold text-white tracking-tight text-base">BestBlug Pro</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 bg-blue-600 text-white rounded-md text-xs uppercase tracking-wider font-bold"
          >
            <Wallet size={16} />
            Dashboard
          </Link>
          <Link
            href="/dashboard/buy-data"
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md text-xs uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-all"
          >
            <Database size={16} />
            Buy Data
          </Link>
          <Link
            href="/dashboard/fund-wallet"
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md text-xs uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-all"
          >
            <CreditCard size={16} />
            Fund Wallet
          </Link>
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md text-xs uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-all"
          >
            <History size={16} />
            Transactions
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md text-xs uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-all"
          >
            <User size={16} />
            Profile
          </Link>
          <Link
            href="/dashboard/support"
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md text-xs uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-all"
          >
            <Headphones size={16} />
            Support
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-md text-xs uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-all"
          >
            <Settings size={16} />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-[10px] uppercase tracking-widest text-slate-500 font-extrabold flex flex-col gap-3">
          <span>Support: +234 812 345 6789</span>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded bg-slate-800 py-2 font-bold text-white hover:bg-slate-700 transition-all text-center uppercase text-[9px]"
          >
            <LogOut size={12} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold uppercase">Welcome back,</span>
            <span className="font-extrabold text-slate-800 dark:text-white uppercase">TeeBest12</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Balance</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 leading-none">
                ₦{(balance + 280.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Link
              href="/dashboard/fund-wallet"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs uppercase tracking-wider font-extrabold shadow-sm transition-all flex items-center gap-1"
            >
              <Plus size={14} />
              Fund Wallet
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Top Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[110px]">
              <div>
                <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Wallet Balance</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₦{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-2">
                <span className="text-green-600 text-[9px] font-bold">Active</span>
                <button
                  onClick={() => {
                    const newBal = balance > 500 ? 350 : 25000;
                    setBalance(newBal);
                    localStorage.setItem("datasub_balance", String(newBal));
                  }}
                  className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  title="Toggle wallet balance to trigger critical low alerts"
                >
                  {balance > 500 ? "Simulate Low" : "Restore"}
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Data Consumed</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">15.0 GB</div>
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold">Current billing cycle</div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Current Plan</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white truncate">Standard Data</div>
              <div className="text-blue-600 dark:text-blue-400 text-[10px] font-bold">Best commercial rate</div>
            </div>
            <div className="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Site Status</div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">Operational</div>
              </div>
              <div className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-1">All systems functional</div>
            </div>
          </div>

          {/* Low Balance Alert Banner */}
          {balance < 500 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest">Critical Balance Alert</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                    Your current wallet balance is <span className="font-bold text-amber-900 dark:text-amber-200">₦{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>, which is below the safe threshold of ₦500.00. Please fund your wallet to avoid failed automated payments.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dashboard/fund-wallet"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-extrabold transition-colors shadow-sm"
                >
                  Fund Wallet
                </Link>
                <button
                  onClick={() => setBalance(25000)}
                  className="text-amber-600 hover:text-amber-800 text-[10px] uppercase tracking-wider font-extrabold px-2 py-1.5 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Spending Trends Chart */}
          <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Spending Analysis</h3>
                <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight mt-0.5">Monthly Category Trends</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500 shrink-0"></span> Data</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 shrink-0"></span> Airtime</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-green-500 shrink-0"></span> Cable TV</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0"></span> Electricity</span>
              </div>
            </div>
            <div className="h-64 w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAirtime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCable" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1f2937" : "#E2E8F0"} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} stroke={isDark ? "#475569" : "#94A3B8"} fontSize={11} fontWeight="bold" />
                    <YAxis tickLine={false} axisLine={false} stroke={isDark ? "#475569" : "#94A3B8"} fontSize={11} fontWeight="bold" tickFormatter={(v) => `₦${v}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: isDark ? "#1e293b" : "#0F172A", borderRadius: "8px", border: "none", color: "#FFF" }} 
                      labelStyle={{ fontWeight: "bold", marginBottom: "4px", fontSize: "11px", color: isDark ? "#94a3b8" : "#94A3B8" }}
                      itemStyle={{ fontSize: "11px", fontWeight: "bold", padding: "1px 0" }}
                      formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="Data" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorData)" />
                    <Area type="monotone" dataKey="Airtime" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorAirtime)" />
                    <Area type="monotone" dataKey="Cable" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCable)" />
                    <Area type="monotone" dataKey="Electricity" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorElectricity)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-lg">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">Loading Chart Engine...</span>
                </div>
              )}
            </div>
          </div>

          {/* Core Layout Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Quick Actions (5 Cols on Large) */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white dark:bg-[#111827] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
                <h3 className="text-xs font-bold border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 uppercase tracking-widest text-slate-500 dark:text-slate-400">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 group dark:bg-slate-800/40 dark:border-slate-800 ${service.color}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-2 shadow-sm text-slate-800 dark:text-slate-200 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Database size={16} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-tight">{service.title}</span>
                      <span className="text-[9px] opacity-70 uppercase tracking-wider">{service.badge}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors duration-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase">Featured Offer: MTN 1GB SME</span>
                    <span className="font-black text-blue-600 dark:text-blue-400">₦245.00</span>
                  </div>
                </div>
              </div>

              {/* Developer News Slate Card */}
              <div className="bg-[#1E293B] p-5 rounded-xl text-white shadow-sm border border-slate-800">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Developer News</h3>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  New API documentation for automated cable, electricity, and airtime top-ups is now live. Complete client access tokens can be configured in your system settings.
                </p>
              </div>
            </div>

            {/* Transactions Log Table (7 Cols on Large) */}
            <div className="xl:col-span-7 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col transition-colors duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Recent Transactions</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight mt-0.5">
                    {filteredTransactions.length} of {transactions.length} records found
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={12} />
                    <input
                      type="text"
                      placeholder="Search receipts, ID, provider..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded text-[11px] font-semibold uppercase tracking-tight outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-[#111827] dark:text-white transition-all"
                    />
                  </div>
                  <Link href="/dashboard/transactions" className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase hover:underline shrink-0">
                    View All
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-extrabold uppercase tracking-wider text-[10px]">ID</th>
                      <th className="px-4 py-3 font-extrabold uppercase tracking-wider text-[10px]">Service</th>
                      <th className="px-4 py-3 font-extrabold uppercase tracking-wider text-[10px]">Recipient</th>
                      <th className="px-4 py-3 font-extrabold uppercase tracking-wider text-[10px]">Amount</th>
                      <th className="px-4 py-3 font-extrabold uppercase tracking-wider text-[10px]">Status</th>
                      <th className="px-4 py-3 font-extrabold uppercase tracking-wider text-[10px]">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400 font-bold uppercase tracking-wider">
                          No matching transactions found
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <span>{t.id}</span>
                              <button
                                onClick={() => handleCopy(t.id, t.id)}
                                className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Copy ID"
                              >
                                {copiedId === t.id ? (
                                  <Check className="text-green-500" size={10} />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{t.name}</td>
                          <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span>{t.number}</span>
                              {t.number !== "—" && (
                                <button
                                  onClick={() => handleCopy(t.id + "-num", t.number)}
                                  className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                                  title="Copy Number"
                                >
                                  {copiedId === t.id + "-num" ? (
                                    <Check className="text-green-500" size={10} />
                                  ) : (
                                    <Copy size={10} />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className={`px-4 py-3 font-bold ${t.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>{t.amount}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              t.status === 'Successful' ? 'bg-green-100 text-green-700' :
                              t.status === 'Failed' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-medium">{t.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="h-10 bg-slate-200 dark:bg-[#111827] border-t border-slate-300 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
            Site ID: DS-004192-NG
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">Terms of Service</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">Privacy Policy</span>
          </div>
        </footer>
      </main>

      {/* Product Update Popup Notification */}
      {showUpdatePopup && (
        <div id="product-update-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative transition-colors duration-200">
            {/* Top Close Button */}
            <button
              onClick={dismissUpdatePopup}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title="Close update notice"
            >
              <X size={18} />
            </button>

            {/* Banner Decor */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center flex flex-col items-center gap-2">
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm animate-bounce">
                <Sparkles className="text-yellow-300" size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/50 px-2 py-0.5 rounded text-blue-100">
                System Version 1.1
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight">Product Upgrades Live!</h2>
              <p className="text-xs text-blue-100 font-medium">
                We've enhanced your dashboard experience based on your feedback.
              </p>
            </div>

            {/* Updates Changelog Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-3.5">
                {/* Search */}
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                    <Search size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Transaction Search Engine</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Instantly filter transaction histories. Search by receipts, ID, phone number, network, or transaction status.
                    </p>
                  </div>
                </div>

                {/* Copy */}
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 mt-0.5">
                    <Copy size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">One-Tap Copy to Clipboard</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Fast transaction receipt code and phone number replication! Just click the copy icon to transfer directly.
                    </p>
                  </div>
                </div>

                {/* Low Balance */}
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                    <AlertTriangle size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">₦500.00 Balance Alert Limit</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      We've optimized the safety banner trigger to ₦500.00. Get alerts at the absolute precise threshold.
                    </p>
                  </div>
                </div>

                {/* Admin Sub Sync */}
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                    <Database size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Admin Sync Data Bundles</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Plans configured in the portal now sync instantly to the client checkout page via unified localStorage state.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={dismissUpdatePopup}
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold uppercase tracking-wider py-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
              >
                Got it, Thank you!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}