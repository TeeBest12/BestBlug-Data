import Link from "next/link";
import { ArrowLeft, Mail, Phone, Shield, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-400 text-2xl font-bold text-white shadow-sm">
              U
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Manage your account information.
              </p>
            </div>
          </div>

          <form action="/dashboard" className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Full Name</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <User size={20} className="text-gray-500 dark:text-slate-400" />
                <input
                  type="text"
                  defaultValue="User Account"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Email Address</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <Mail size={20} className="text-gray-500 dark:text-slate-400" />
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Phone Number</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <Phone size={20} className="text-gray-500 dark:text-slate-400" />
                <input
                  type="tel"
                  defaultValue="08012345678"
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Account Status</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 transition-colors">
                <Shield size={20} className="text-green-600 dark:text-green-500" />
                <span className="font-medium text-green-600 dark:text-green-500">Verified</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 py-3 font-semibold text-white cursor-pointer hover:shadow-md transition-all"
            >
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}