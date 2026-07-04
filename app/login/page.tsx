"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please fill in your email address.");
      return;
    }

    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail === "admin@datasub.com" || lowerEmail === "admin") {
      // Admin Login
      const adminUser = { email: "admin@datasub.com", role: "admin", name: "System Admin" };
      localStorage.setItem("datasub_user", JSON.stringify(adminUser));
      router.push("/admin");
    } else {
      // Standard User Login
      const standardUser = { email: lowerEmail, role: "user", name: lowerEmail.split("@")[0] };
      localStorage.setItem("datasub_user", JSON.stringify(standardUser));
      router.push("/dashboard");
    }
  };

  const handleAdminShortcut = () => {
    setEmail("admin@datasub.com");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 border border-slate-200 shadow-md">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Login Portal</h1>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              Log in to manage your high-speed data subscriptions.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white text-sm shrink-0">
            DS
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 border border-red-200 p-3 text-[11px] font-semibold text-red-600 uppercase tracking-tight">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <Mail className="mr-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <Lock className="mr-3 text-slate-400" size={16} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            Log In
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400">
            <span className="bg-white px-2">Demo Shortcuts</span>
          </div>
        </div>

        {/* Admin Demo Button */}
        <button
          onClick={handleAdminShortcut}
          className="w-full flex items-center justify-center gap-2 rounded border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-indigo-700 transition-all cursor-pointer"
        >
          <ShieldCheck size={14} />
          Pre-fill Admin Credentials
        </button>

        <div className="mt-6 flex justify-between text-[11px] font-bold uppercase tracking-wider text-blue-600">
          <Link href="/signup" className="hover:underline">No account yet?</Link>
          <Link href="/signup" className="hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}