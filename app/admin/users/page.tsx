"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  Pencil,
  Trash2,
  Ban,
  UserPlus,
  X,
  Plus,
  Check,
  RotateCcw,
  Menu,
  LayoutDashboard,
  Settings
} from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number; // Stored as number for simple arithmetic and input binding
  status: "Active" | "Blocked";
}

const DEFAULT_USERS: UserItem[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    balance: 12500,
    status: "Active",
  },
  {
    id: 2,
    name: "Mary James",
    email: "mary@example.com",
    phone: "08087654321",
    balance: 5000,
    status: "Blocked",
  },
  {
    id: 3,
    name: "Peter Smith",
    email: "peter@example.com",
    phone: "08123456789",
    balance: 20000,
    status: "Active",
  },
  {
    id: 4,
    name: "David Johnson",
    email: "david@example.com",
    phone: "09012345678",
    balance: 7800,
    status: "Active",
  },
];

export default function UsersPage() {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Edit Modal States
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [editStatus, setEditStatus] = useState<"Active" | "Blocked">("Active");

  // Add Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addBalance, setAddBalance] = useState("");
  const [addStatus, setAddStatus] = useState<"Active" | "Blocked">("Active");

  // Load and initialize users from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("datasub_admin_users");
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse users", e);
        setUsers(DEFAULT_USERS);
        localStorage.setItem("datasub_admin_users", JSON.stringify(DEFAULT_USERS));
      }
    } else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem("datasub_admin_users", JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  // Save changes helper
  const saveUsersList = (updatedList: UserItem[]) => {
    setUsers(updatedList);
    localStorage.setItem("datasub_admin_users", JSON.stringify(updatedList));
  };

  // Toggle user active status
  const handleToggleStatus = (id: number) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        const newStatus: "Active" | "Blocked" = u.status === "Active" ? "Blocked" : "Active";
        return { ...u, status: newStatus };
      }
      return u;
    });
    saveUsersList(updated);
  };

  // Delete user
  const handleDeleteUser = (id: number, name: string) => {
    if (confirm(`Are you absolutely sure you want to delete user "${name}"? This action cannot be undone.`)) {
      const updated = users.filter((u) => u.id !== id);
      saveUsersList(updated);
    }
  };

  // Open Edit Dialog
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditBalance(String(user.balance));
    setEditStatus(user.status);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editName.trim() || !editEmail.trim() || !editPhone.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const updated = users.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          balance: parseFloat(editBalance) || 0,
          status: editStatus,
        };
      }
      return u;
    });

    saveUsersList(updated);
    setEditingUser(null);
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim() || !addPhone.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const newUser: UserItem = {
      id: Date.now(),
      name: addName.trim(),
      email: addEmail.trim(),
      phone: addPhone.trim(),
      balance: parseFloat(addBalance) || 0,
      status: addStatus,
    };

    const updated = [newUser, ...users];
    saveUsersList(updated);

    // Reset fields & close
    setAddName("");
    setAddEmail("");
    setAddPhone("");
    setAddBalance("");
    setAddStatus("Active");
    setShowAddModal(false);
  };

  // Reset users to defaults
  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to restore the default users list? All current custom edits will be reset.")) {
      saveUsersList(DEFAULT_USERS);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-100 p-5 lg:p-8 flex items-center justify-center">
        <div className="text-sm font-black uppercase tracking-wider text-slate-400 animate-pulse">
          Loading Users Management Portal...
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 text-white transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Users size={16} />
            Users & Funding
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

      {/* Main Content Pane */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl w-full mx-auto">
        {/* Header Panel */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Link href="/admin" className="hover:text-slate-900 transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-slate-600">Users</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              Users Management
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Edit details, fund balances, toggle access status, and view active customers.
            </p>
          </div>

          {/* Top metrics and Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-white px-4 py-3 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="h-8 w-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <Users size={16} className="stroke-[2.5px]" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Total Users</p>
                <h2 className="text-sm font-black text-slate-900">{users.length}</h2>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-4.5 py-3 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus size={15} className="stroke-[2.5px]" />
              Add User
            </button>

            <button
              onClick={handleResetToDefaults}
              title="Reset Users list to original state"
              className="inline-flex items-center justify-center p-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl transition-colors cursor-pointer"
            >
              <RotateCcw size={15} className="stroke-[2.5px]" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-6 rounded-3xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2.5px]"
            />

            <input
              type="text"
              placeholder="Search users by name, email, or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 py-3 pl-11 pr-4 text-xs font-bold text-slate-950 bg-slate-50/30 outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Desktop View: Users Table */}
        <div className="hidden md:block overflow-x-auto rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700">User Identity</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700">Phone Number</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700">Wallet Balance</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700">Access Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-700 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50/50"
                >
                  {/* User Identity Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-sm border border-slate-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                          {user.name}
                        </h3>
                        <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone Column */}
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 text-sm">
                    {user.phone}
                  </td>

                  {/* Balance Column */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-emerald-700">
                      ₦{user.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Access Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-red-100 text-red-800 border-red-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        title="Edit User Profile"
                        className="rounded-xl bg-blue-50 border border-blue-200/50 p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Pencil size={16} className="stroke-[2.5px]" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        title={user.status === "Active" ? "Suspend/Block User" : "Activate User"}
                        className={`rounded-xl border p-2.5 transition-all cursor-pointer ${
                          user.status === "Active"
                            ? "bg-amber-50 border-amber-200/50 text-amber-600 hover:bg-amber-600 hover:text-white"
                            : "bg-emerald-50 border-emerald-200/50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        <Ban size={16} className="stroke-[2.5px]" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        title="Delete User"
                        className="rounded-xl bg-red-50 border border-red-200/50 p-2.5 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 size={16} className="stroke-[2.5px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-16 text-center text-slate-500 font-extrabold uppercase tracking-wider text-xs bg-slate-50/20"
                  >
                    No registered users matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Users Cards List */}
        <div className="block md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-sm border border-slate-200 shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-slate-900 tracking-tight uppercase truncate">
                      {user.name}
                    </h3>
                    <p className="text-[10px] font-mono font-bold text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border shrink-0 ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100/80">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Phone</p>
                  <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">{user.phone}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Wallet Balance</p>
                  <p className="text-xs font-black text-emerald-700 mt-0.5">
                    ₦{user.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200/50 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                >
                  <Pencil size={13} className="stroke-[2.5px]" />
                  Edit
                </button>

                <button
                  onClick={() => handleToggleStatus(user.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    user.status === "Active"
                      ? "bg-amber-50 border-amber-200/50 text-amber-600 hover:bg-amber-600 hover:text-white"
                      : "bg-emerald-50 border-emerald-200/50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                  }`}
                >
                  <Ban size={13} className="stroke-[2.5px]" />
                  {user.status === "Active" ? "Suspend" : "Activate"}
                </button>

                <button
                  onClick={() => handleDeleteUser(user.id, user.name)}
                  className="rounded-xl bg-red-50 border border-red-200/50 p-2.5 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer text-center flex items-center justify-center"
                >
                  <Trash2 size={13} className="stroke-[2.5px]" />
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center text-slate-500 font-extrabold uppercase tracking-wider text-xs">
              No registered users matched your search criteria.
            </div>
          )}
        </div>
      </main>

      {/* EDIT USER DIALOG MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[28px] border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-blue-600">Modify Account</span>
                <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                  Edit User Details
                </h2>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X size={20} className="stroke-[2.5px]" />
              </button>
            </header>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                  placeholder="Enter user's name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="08012345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Wallet Balance (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editBalance}
                    onChange={(e) => setEditBalance(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as "Active" | "Blocked")}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 bg-white outline-none focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="Active">Active / Unrestricted</option>
                    <option value="Blocked">Blocked / Suspended</option>
                  </select>
                </div>
              </div>

              <footer className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Check size={14} className="stroke-[3px]" />
                  Save Changes
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW USER DIALOG MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[28px] border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase text-blue-600 font-sans">New Registration</span>
                <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                  Register User
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              >
                <X size={20} className="stroke-[2.5px]" />
              </button>
            </header>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="e.g. 08012345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Opening Wallet Balance (₦)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={addBalance}
                    onChange={(e) => setAddBalance(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-1.5">
                    Account Access Status
                  </label>
                  <select
                    value={addStatus}
                    onChange={(e) => setAddStatus(e.target.value as "Active" | "Blocked")}
                    className="w-full rounded-xl border border-slate-200/80 px-4 py-3 text-sm font-bold text-slate-900 bg-white outline-none focus:border-blue-600 transition-all cursor-pointer"
                  >
                    <option value="Active">Active / Unrestricted</option>
                    <option value="Blocked">Blocked / Suspended</option>
                  </select>
                </div>
              </div>

              <footer className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Plus size={14} className="stroke-[3px]" />
                  Add User Account
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}