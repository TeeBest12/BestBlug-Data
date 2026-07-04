"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Lock, Moon, Shield, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoStep, setTwoStep] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Determine initial theme state
    const currentTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const hasDarkClass = document.documentElement.classList.contains("dark");

    if (currentTheme === "dark" || (!currentTheme && systemPrefersDark) || hasDarkClass) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeToggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center font-sans">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading preferences...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] px-6 py-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="rounded-2xl bg-white dark:bg-[#111827] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
          <div className="mb-8 flex items-start justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Settings Portal</h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                Manage your personalized preferences, wallet alerts, and security interfaces.
              </p>
            </div>
            <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">
              v1.1 Active
            </span>
          </div>

          <div className="space-y-4">
            {/* Notifications preference */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tight text-slate-800 dark:text-slate-200">Wallet Alerts</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Receive text-based transaction logs and wallet credit alerts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Two-step security */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tight text-slate-800 dark:text-slate-200">Two-Step Pin Authentication</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Enforce secondary transaction pin confirmation for data plans.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoStep(!twoStep)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  twoStep ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    twoStep ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 bg-blue-50/20 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/20 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 shrink-0">
                  <Moon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-tight text-slate-800 dark:text-slate-200">Comprehensive Dark Mode</p>
                    <Sparkles size={12} className="text-amber-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Apply a highly readable, premium dark aesthetic throughout all dashboard views.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleThemeToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isDark ? "bg-amber-500" : "bg-slate-200 dark:bg-slate-700"
                }`}
                aria-label="Toggle comprehensive dark mode"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isDark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Change Password Route Link */}
            <Link
              href="change-password"
              className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shrink-0">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-tight text-slate-800 dark:text-slate-200">Change Account Password</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Securely update or reset your login access credentials.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 hover:underline">Configure &rarr;</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}