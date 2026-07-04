import Link from "next/link";
import { Lock, Mail, Phone, User } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 border border-slate-200 shadow-md">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sign Up</h1>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              Create an account to start buying high-speed data subscriptions.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white text-sm shrink-0">
            DS
          </div>
        </div>

        <form action="/dashboard" className="space-y-4">
          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <User className="mr-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <Mail className="mr-3 text-slate-400" size={16} />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <Phone className="mr-3 text-slate-400" size={16} />
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <Lock className="mr-3 text-slate-400" size={16} />
            <input
              type="password"
              placeholder="Create a password"
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center rounded border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-sm focus-within:border-blue-500 transition-colors">
            <Lock className="mr-3 text-slate-400" size={16} />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 flex justify-between text-[11px] font-bold uppercase tracking-wider text-blue-600">
          <Link href="/login" className="hover:underline">Already have an account?</Link>
          <Link href="/login" className="hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}