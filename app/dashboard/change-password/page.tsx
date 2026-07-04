import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Settings
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          <form action="/dashboard/success" className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Current Password</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <Lock size={20} className="text-gray-500 dark:text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">New Password</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <Lock size={20} className="text-gray-500 dark:text-slate-400" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Confirm New Password</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <Lock size={20} className="text-gray-500 dark:text-slate-400" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 py-3 font-semibold text-white cursor-pointer hover:shadow-md transition-all"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}