"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CreditCard,
  Database,
  History,
  MessageCircle,
  Users,
  Wallet,
  Send,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Home,
  Menu,
  X,
  Settings
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "admin" | "system";
  text: string;
  timestamp: string;
  userEmail: string;
}

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Transactions",
    value: "8,430",
    icon: History,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Wallet Funding",
    value: "₦2.4M",
    icon: Wallet,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Data Orders",
    value: "5,921",
    icon: Database,
    color: "bg-purple-100 text-purple-600",
  },
];

const recentOrders = [
  {
    user: "user@example.com",
    service: "MTN 15GB",
    amount: "₦2,500",
    status: "Successful",
  },
  {
    user: "customer@mail.com",
    service: "Airtel Airtime",
    amount: "₦1,000",
    status: "Pending",
  },
  {
    user: "demo@mail.com",
    service: "Wallet Funding",
    amount: "₦10,000",
    status: "Failed",
  },
];

const initialUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    balance: "₦12,500",
    status: "Active",
  },
  {
    name: "Mary James",
    email: "mary@example.com",
    balance: "₦5,000",
    status: "Blocked",
  },
  {
    name: "Peter Smith",
    email: "peter@example.com",
    balance: "₦20,000",
    status: "Active",
  },
];

const DEFAULT_CHATS: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "system",
    text: "Welcome to SurePlug Premium Live Support! 🛡️ Our agents are online and ready to assist you in real-time.",
    timestamp: "10:00 AM",
    userEmail: "all",
  },
  {
    id: "welcome-2",
    sender: "admin",
    text: "Hello! Thank you for contacting SurePlug. If you have any questions regarding pending wallet funding, failed data delivery, or billing, please send us a message here.",
    timestamp: "10:01 AM",
    userEmail: "all",
  }
];

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "support" | "gateways">("overview");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [adminReply, setAdminReply] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Load messages from localStorage
    const savedChats = localStorage.getItem("datasub_live_chats");
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setMessages(parsed);
        
        // Pick the first user that has chatted as the default selected user
        const activeUsers = Array.from(
          new Set(parsed.map((m: ChatMessage) => m.userEmail).filter((email: string) => email && email !== "all"))
        ) as string[];
        if (activeUsers.length > 0) {
          setSelectedUserEmail(activeUsers[0]);
        }
      } catch (e) {
        setMessages(DEFAULT_CHATS);
      }
    } else {
      setMessages(DEFAULT_CHATS);
      localStorage.setItem("datasub_live_chats", JSON.stringify(DEFAULT_CHATS));
    }

    // Load users from localStorage
    const savedUsers = localStorage.getItem("datasub_admin_users");
    if (savedUsers) {
      try {
        setAdminUsers(JSON.parse(savedUsers));
      } catch (e) {
        setAdminUsers([]);
      }
    } else {
      const defaultUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "08012345678", balance: 12500, status: "Active" },
        { id: 2, name: "Mary James", email: "mary@example.com", phone: "08087654321", balance: 5000, status: "Blocked" },
        { id: 3, name: "Peter Smith", email: "peter@example.com", phone: "08123456789", balance: 20000, status: "Active" },
        { id: 4, name: "David Johnson", email: "david@example.com", phone: "09012345678", balance: 7800, status: "Active" },
      ];
      setAdminUsers(defaultUsers);
      localStorage.setItem("datasub_admin_users", JSON.stringify(defaultUsers));
    }
  }, []);

  // Sync messages periodically to capture new customer messages instantly
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const savedChats = localStorage.getItem("datasub_live_chats");
      if (savedChats) {
        try {
          const parsed = JSON.parse(savedChats);
          if (JSON.stringify(parsed) !== JSON.stringify(messages)) {
            setMessages(parsed);

            // If no user was selected yet, select the first active chat
            if (!selectedUserEmail) {
              const activeUsers = Array.from(
                new Set(parsed.map((m: ChatMessage) => m.userEmail).filter((email: string) => email && email !== "all"))
              ) as string[];
              if (activeUsers.length > 0) {
                setSelectedUserEmail(activeUsers[0]);
              }
            }
          }
        } catch (e) {}
      }

      const savedUsers = localStorage.getItem("datasub_admin_users");
      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);
          if (JSON.stringify(parsedUsers) !== JSON.stringify(adminUsers)) {
            setAdminUsers(parsedUsers);
          }
        } catch (e) {}
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, messages, selectedUserEmail, adminUsers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUserEmail, activeTab]);

  // Extract all unique users who have initiated a chat
  const chatUsers = Array.from(
    new Set(messages.map((m) => m.userEmail).filter((email) => email && email !== "all"))
  );

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedUserEmail) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const replyMsg: ChatMessage = {
      id: "admin-msg-" + Date.now(),
      sender: "admin",
      text: adminReply.trim(),
      timestamp: timeStr,
      userEmail: selectedUserEmail,
    };

    const updated = [...messages, replyMsg];
    setMessages(updated);
    localStorage.setItem("datasub_live_chats", JSON.stringify(updated));
    setAdminReply("");
  };

  // Filter messages for the active conversation (include system announcements or user-specific ones)
  const currentChatMessages = messages.filter(
    (m) => m.userEmail === selectedUserEmail || m.userEmail === "all"
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Admin Control Panel...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 w-full">
      
      {/* Mobile Header / Navigation Bar */}
      <header className="lg:hidden bg-[#0F172A] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md w-full">
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
          <button
            onClick={() => { setActiveTab("overview"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Home size={16} />
            Overview Dashboard
          </button>

          <button
            onClick={() => { setActiveTab("support"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "support"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <MessageCircle size={16} />
              Live Chat
            </span>
            <span className="bg-green-500 text-slate-950 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
              Live
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("gateways"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "gateways"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Database size={16} />
              VTU Gateways
            </span>
            <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
              Dual
            </span>
          </button>

          <div className="h-px bg-slate-800/60 my-2" />

          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users size={16} />
            Users & Funding
          </Link>

          <Link
            href="/admin/transactions"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <History size={16} />
            Transactions
          </Link>

          <Link
            href="/admin/plans"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CreditCard size={16} />
            Data Plans
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
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

      {/* Main Content Area */}
      <section className="flex-1 min-h-screen flex flex-col justify-between overflow-x-hidden">
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-xs border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile to draw attention if closed */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">System Admin Control</p>
              <h1 className="text-sm font-black uppercase tracking-tight text-slate-900">
                {activeTab === "overview" ? "Dashboard Overview" : activeTab === "support" ? "Live Chat Management" : "VTU Gateway Configuration"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex bg-slate-100 border border-slate-200 px-3 py-1 rounded text-[10px] font-black text-slate-600 uppercase tracking-tight items-center gap-1.5">
              <ShieldCheck size={13} className="text-green-600 shrink-0" />
              admin@sureplug.com
            </span>

            <Link
              href="/dashboard"
              className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-[10px] font-extrabold text-white uppercase tracking-wider transition-colors"
            >
              Exit Panel
            </Link>
          </div>
        </header>

        <div className="flex-1 px-6 py-6 max-w-6xl w-full mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}
                      >
                        <Icon size={20} />
                      </div>

                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">{item.title}</p>
                      <h2 className="mt-1 text-2xl font-black text-slate-900">{item.value}</h2>
                    </div>
                  );
                })}
              </section>

              {/* Grid 2 Columns */}
              <section className="grid gap-6 lg:grid-cols-3">
                {/* Recent Orders */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-4">Recent Orders Log</h2>

                  <div className="space-y-4">
                    {recentOrders.map((order, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 last:border-b-0 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="text-xs font-extrabold uppercase text-slate-800 tracking-tight">{order.service}</p>
                          <p className="text-[11px] font-mono font-bold text-slate-700">{order.user}</p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs font-black text-slate-900">{order.amount}</p>
                          <p
                            className={`text-[10px] font-black uppercase tracking-wider mt-0.5 ${
                              order.status === "Successful"
                                ? "text-green-600"
                                : order.status === "Pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions & Live Support Status */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-4">Quick Actions</h2>

                    <div className="grid gap-3">
                      <Link
                        href="/admin/funding"
                        className="flex items-center gap-3 rounded-xl border border-slate-150 bg-slate-50/50 p-4 font-bold text-xs uppercase text-slate-700 hover:border-blue-500 transition-colors"
                      >
                        <CreditCard size={18} className="text-blue-600" />
                        Review Deposits
                      </Link>

                      <button
                        onClick={() => setActiveTab("support")}
                        className="w-full flex items-center justify-between rounded-xl border border-slate-150 bg-slate-50/50 p-4 font-bold text-xs uppercase text-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <MessageCircle size={18} className="text-indigo-600" />
                          <span>Customer Chats</span>
                        </div>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[9px] font-black">
                          {chatUsers.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 flex gap-3.5 items-start">
                    <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-800">Support Center</h4>
                      <p className="text-[11px] text-indigo-700 font-medium leading-relaxed mt-1">
                        Respond instantly to incoming live chats from your users. Ensure fast resolutions to maintain excellent user satisfaction.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Users Quick Table */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Users Status Board</h2>
                  <Link
                    href="/admin/users"
                    className="rounded bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider hover:bg-slate-800"
                  >
                    Manage All
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-[11px] font-black uppercase tracking-wider text-slate-800">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Balance</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>

                    <tbody className="text-xs">
                      {adminUsers.map((user) => (
                        <tr key={user.email} className="border-b last:border-0 border-slate-100 transition hover:bg-slate-50/50">
                          <td className="py-3.5 font-black text-slate-950 uppercase tracking-tight text-xs">{user.name}</td>
                          <td className="py-3.5 font-mono font-extrabold text-slate-700">{user.email}</td>
                          <td className="py-3.5 font-black text-emerald-700">
                            ₦{typeof user.balance === "number" ? user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 }) : user.balance}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {adminUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                            No users available in list.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === "support" && (
            <div className="grid gap-6 lg:grid-cols-12 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm h-[600px]">
              {/* Chat Inbox Sidebar (4 cols) */}
              <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-4 border-b border-slate-200 bg-white">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Active Chat Threads</h3>
                  <div className="mt-2.5 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                    <Search className="text-slate-400 mr-2 shrink-0" size={14} />
                    <input
                      type="text"
                      placeholder="Search active users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold outline-none placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {chatUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider px-4">
                      No active customer chat sessions found
                    </div>
                  ) : (
                    chatUsers
                      .filter((email) => email.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((email) => {
                        const isSelected = selectedUserEmail === email;
                        
                        // Find last message for previews
                        const userMessagesOnly = messages.filter(m => m.userEmail === email);
                        const lastMsg = userMessagesOnly.length > 0 ? userMessagesOnly[userMessagesOnly.length - 1] : null;

                        return (
                          <button
                            key={email}
                            onClick={() => setSelectedUserEmail(email)}
                            className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-sm"
                                : "hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                              isSelected ? "bg-white text-blue-600" : "bg-slate-200 text-slate-600"
                            }`}>
                              {email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black truncate">{email}</p>
                              {lastMsg && (
                                <p className={`text-[10px] truncate mt-0.5 ${
                                  isSelected ? "text-blue-100 font-medium" : "text-slate-400 font-medium"
                                }`}>
                                  {lastMsg.sender === "admin" ? "You: " : ""}{lastMsg.text}
                                </p>
                              )}
                            </div>
                            <ArrowRight size={14} className={isSelected ? "text-white" : "text-slate-300"} />
                          </button>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Chat Thread Panel (8 cols) */}
              <div className="lg:col-span-8 flex flex-col h-full bg-white">
                {selectedUserEmail ? (
                  <>
                    {/* Active Conversation Header */}
                    <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Replying to customer</span>
                        <h4 className="text-xs font-black font-mono text-blue-300">{selectedUserEmail}</h4>
                      </div>

                      <span className="bg-green-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-green-300 border border-green-500/30">
                        Live Session
                      </span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-4">
                      {currentChatMessages.map((msg) => {
                        const isUser = msg.sender === "user";
                        const isSystem = msg.sender === "system";

                        if (isSystem) {
                          return (
                            <div key={msg.id} className="flex justify-center my-1 animate-fade-in">
                              <span className="bg-slate-200 text-slate-600 border border-slate-300 rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-center max-w-[85%] shadow-sm">
                                {msg.text}
                              </span>
                            </div>
                          );
                        }

                        const isMe = msg.sender === "admin";

                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 max-w-[80%] animate-fade-in ${
                              isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                              isMe ? "bg-slate-800 text-white" : "bg-blue-600 text-white"
                            }`}>
                              {isMe ? "AD" : selectedUserEmail.charAt(0).toUpperCase()}
                            </div>

                            <div className="space-y-1">
                              <div className={`rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                                isMe
                                  ? "bg-slate-800 text-white rounded-tr-none"
                                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                              }`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                              </div>
                              <p className={`text-[9px] font-black text-slate-400 uppercase tracking-tight ${
                                isMe ? "text-right" : "text-left"
                              }`}>
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Response Form */}
                    <form onSubmit={handleSendAdminReply} className="p-4 border-t border-slate-200 flex gap-2 shrink-0">
                      <input
                        type="text"
                        placeholder={`Write reply to ${selectedUserEmail}...`}
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!adminReply.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl flex items-center justify-center gap-2 shrink-0 font-extrabold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                      >
                        <Send size={14} />
                        <span>Reply</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 text-slate-400">
                    <MessageCircle size={48} className="text-slate-300 mb-3" />
                    <h3 className="text-xs font-black uppercase tracking-wider">No Conversation Selected</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 max-w-sm">
                      Select an active customer chat thread from the left list sidebar to begin responding in real-time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "gateways" && (
            <div className="space-y-6">
              {/* Dual Gateways Connection Board */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Gateway 1: VTpass */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-xs">
                        1
                      </span>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Primary Gateway: VTpass</h3>
                        <p className="text-[10px] text-slate-400 font-bold">Nigeria's Leading VTU & Utilities API</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                      ACTIVE (PRIMARY)
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">VTpass API Public Key</label>
                      <input 
                        type="text" 
                        readOnly
                        placeholder="e.g. PK_LIVE_67c3b28d4..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">VTpass Secret Key</label>
                      <input 
                        type="password" 
                        readOnly
                        placeholder="••••••••••••••••••••••••••••••" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">API Request Endpoints</label>
                      <p className="font-mono text-[10px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                        POST https://api-service.vtpass.com/api/pay
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-orange-50/50 p-3.5 border border-orange-100 text-[11px] text-orange-800 leading-relaxed font-medium">
                    <strong>Account Setup:</strong> Register at <a href="https://vtpass.com" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-orange-950">vtpass.com</a>, request developer access under API settings, generate live tokens, and pre-fund your VTpass balance.
                  </div>
                </div>

                {/* Gateway 2: Clubkonnect */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-bold text-xs">
                        2
                      </span>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Backup Gateway: Clubkonnect</h3>
                        <p className="text-[10px] text-slate-400 font-bold">Reliable SME & Corporate Gifting API</p>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                      STANDBY (FAILOVER)
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Clubkonnect User ID</label>
                      <input 
                        type="text" 
                        readOnly
                        placeholder="e.g. CK1004192" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Clubkonnect API Key</label>
                      <input 
                        type="password" 
                        readOnly
                        placeholder="••••••••••••••••••••••••••••••" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">API Request Endpoints</label>
                      <p className="font-mono text-[10px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                        GET https://www.clubkonnect.com/API/Sub.asp
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100 text-[11px] text-blue-800 leading-relaxed font-medium">
                    <strong>Account Setup:</strong> Register at <a href="https://clubkonnect.com" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-950">clubkonnect.com</a>, copy your API credentials from your profile portal page, and fund your developer wallet.
                  </div>
                </div>

              </div>

              {/* Redundancy explanation banner */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/20 p-5 flex gap-3.5 items-start">
                <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-800">Zero-Interruption Failover Integration</h4>
                  <p className="text-[11px] text-blue-700 leading-relaxed mt-1 font-medium">
                    The backend router is coded to run <strong>Primary First</strong>. If VTpass times out, returns connection errors, or has insufficient API balance, the system will seamlessly hop the transaction to Clubkonnect within <strong>1.5 seconds</strong>. This guarantees your users never experience payment interruption!
                  </p>
                </div>
              </div>

              {/* One-by-One Price & Recommended Connection Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">One-by-One Price Comparison Sheet</h2>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">API Purchase Rates vs User Pricing & recommended connections</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-[9px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Network</th>
                        <th className="pb-3">Plan Bundle</th>
                        <th className="pb-3">VTpass API Rate</th>
                        <th className="pb-3">Clubkonnect Rate</th>
                        <th className="pb-3">Your Selling Price</th>
                        <th className="pb-3">Your Margin</th>
                        <th className="pb-3 text-right">Recommended API Connection</th>
                      </tr>
                    </thead>

                    <tbody className="text-xs">
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">MTN</td>
                        <td className="py-3 font-semibold text-slate-600">1GB SME (30 Days)</td>
                        <td className="py-3 font-bold text-slate-900">₦225.00</td>
                        <td className="py-3 font-bold text-blue-600">₦218.00 ★</td>
                        <td className="py-3 font-bold text-green-600">₦245.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦27.00 (11%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Clubkonnect</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">MTN</td>
                        <td className="py-3 font-semibold text-slate-600">5GB SME (30 Days)</td>
                        <td className="py-3 font-bold text-slate-900">₦1,120.00</td>
                        <td className="py-3 font-bold text-blue-600">₦1,090.00 ★</td>
                        <td className="py-3 font-bold text-green-600">₦1,200.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦110.00 (10%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Clubkonnect</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">Airtel</td>
                        <td className="py-3 font-semibold text-slate-600">1.5GB Gifting</td>
                        <td className="py-3 font-bold text-orange-600">₦450.00 ★</td>
                        <td className="py-3 font-bold text-slate-900">₦465.00</td>
                        <td className="py-3 font-bold text-green-600">₦500.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦50.00 (10%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">VTpass (Primary)</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">Airtel</td>
                        <td className="py-3 font-semibold text-slate-600">5GB Gifting</td>
                        <td className="py-3 font-bold text-orange-600">₦1,380.00 ★</td>
                        <td className="py-3 font-bold text-slate-900">₦1,420.00</td>
                        <td className="py-3 font-bold text-green-600">₦1,500.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦120.00 (8%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">VTpass (Primary)</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">Glo</td>
                        <td className="py-3 font-semibold text-slate-600">2GB Corporate</td>
                        <td className="py-3 font-bold text-slate-900">₦490.00</td>
                        <td className="py-3 font-bold text-blue-600">₦480.00 ★</td>
                        <td className="py-3 font-bold text-green-600">₦550.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦70.00 (13%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Clubkonnect</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">Glo</td>
                        <td className="py-3 font-semibold text-slate-600">5.8GB Corporate</td>
                        <td className="py-3 font-bold text-slate-900">₦1,350.00</td>
                        <td className="py-3 font-bold text-blue-600">₦1,320.00 ★</td>
                        <td className="py-3 font-bold text-green-600">₦1,450.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦130.00 (9%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Clubkonnect</span>
                        </td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 font-extrabold text-slate-800 uppercase">9Mobile</td>
                        <td className="py-3 font-semibold text-slate-600">1.5GB Gifting</td>
                        <td className="py-3 font-bold text-orange-600">₦850.00 ★</td>
                        <td className="py-3 font-bold text-slate-900">₦870.00</td>
                        <td className="py-3 font-bold text-green-600">₦950.00</td>
                        <td className="py-3 text-[10px] font-black uppercase text-green-600">+₦100.00 (10%)</td>
                        <td className="py-3 text-right">
                          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">VTpass (Primary)</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 shrink-0">
          <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between px-6 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <div>Admin Module ID: DS-ADM-NG</div>
            <div>Secure Dashboard Sessions</div>
          </div>
        </footer>
      </section>
    </div>
  );
}