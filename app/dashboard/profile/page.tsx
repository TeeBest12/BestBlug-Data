"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Shield, User, AlertCircle, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [accountStatus, setAccountStatus] = useState("Verified");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Load current active user session
    const userStr = localStorage.getItem("datasub_user");
    let currentEmail = "";
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.email) {
          setEmail(u.email);
          setOriginalEmail(u.email);
          currentEmail = u.email;
        }
        if (u.name) {
          setName(u.name);
        }
      } catch (e) {}
    }

    // Look up additional fields like phone from registered users
    const registeredUsersStr = localStorage.getItem("datasub_registered_users");
    if (registeredUsersStr && currentEmail) {
      try {
        const registeredUsers = JSON.parse(registeredUsersStr);
        const matched = registeredUsers.find(
          (u: any) => u.email.toLowerCase().trim() === currentEmail.toLowerCase().trim()
        );
        if (matched) {
          if (matched.phone) {
            setPhone(matched.phone);
          } else {
            setPhone("08012345678");
          }
          if (matched.role === "admin") {
            setAccountStatus("Admin VIP");
          }
        } else {
          setPhone("08012345678");
        }
      } catch (e) {}
    } else {
      setPhone("08012345678");
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    const registeredUsersStr = localStorage.getItem("datasub_registered_users");
    let registeredUsers = [];
    if (registeredUsersStr) {
      try {
        registeredUsers = JSON.parse(registeredUsersStr);
      } catch (e) {}
    }

    // Check email uniqueness if email has changed
    if (lowerEmail !== originalEmail.toLowerCase().trim()) {
      const emailExists = registeredUsers.some(
        (u: any) => u.email.toLowerCase().trim() === lowerEmail
      );
      if (emailExists) {
        setError("This email address is already taken by another account.");
        return;
      }
    }

    // Update registered user record
    let found = false;
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.email.toLowerCase().trim() === originalEmail.toLowerCase().trim()) {
        found = true;
        return {
          ...u,
          name: name.trim(),
          email: lowerEmail,
          phone: phone.trim(),
        };
      }
      return u;
    });

    // If user record wasn't found (e.g. guest with no pre-existing record), create it
    if (!found) {
      const fallbackNo = "99" + Math.floor(10000000 + Math.random() * 90000000).toString();
      updatedUsers.push({
        name: name.trim(),
        email: lowerEmail,
        phone: phone.trim(),
        password: "password",
        role: "user",
        balance: 25000,
        accountNumber: fallbackNo,
        bankName: "Wema Bank (SurePlug Auto)",
        referredBy: null,
        referralCount: 0,
        earnings: 0,
        createdAt: new Date().toISOString(),
      });
    }

    localStorage.setItem("datasub_registered_users", JSON.stringify(updatedUsers));

    // Update active user session
    const updatedUserSession = {
      email: lowerEmail,
      name: name.trim(),
      role: lowerEmail === "admin@sureplug.com" ? "admin" : "user",
    };
    localStorage.setItem("datasub_user", JSON.stringify(updatedUserSession));

    // Sync originalEmail reference
    setOriginalEmail(lowerEmail);

    setSuccess("Profile changes saved successfully!");
    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-3xl animate-fade-in">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-2xl font-black text-white shadow-md">
              {name ? name.substring(0, 1).toUpperCase() : "U"}
            </div>

            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">User Profile</h1>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Manage your personalized account information.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-4 flex items-center gap-3 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-tight">
              <AlertCircle className="shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 p-4 flex items-center gap-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight animate-bounce">
              <CheckCircle className="shrink-0" size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Full Name</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors focus-within:border-blue-500">
                <User size={20} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200 font-bold"
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors focus-within:border-blue-500">
                <Mail size={20} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200 font-bold"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Phone Number</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors focus-within:border-blue-500">
                <Phone size={20} className="text-slate-400 dark:text-slate-500 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200 font-bold"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Account Status</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 px-4 py-3 select-none">
                <Shield size={20} className="text-green-600 dark:text-green-500 shrink-0" />
                <span className="font-extrabold text-green-600 dark:text-green-500 uppercase text-xs tracking-wider">
                  {accountStatus}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 py-3.5 text-xs uppercase tracking-widest font-black text-white cursor-pointer hover:shadow-md hover:from-blue-700 hover:to-indigo-600 transition-all shadow-sm"
            >
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
