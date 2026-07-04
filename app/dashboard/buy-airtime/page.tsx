import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";

const networks = ["MTN", "Airtel", "Glo", "9mobile"];

export default function BuyAirtimePage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Phone size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buy Airtime</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Select network, amount, and phone number.
              </p>
            </div>
          </div>

          <form action="/dashboard/success" className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Network</label>
              <select className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors">
                <option>Select network</option>
                {networks.map((network) => (
                  <option key={network}>{network}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white cursor-pointer hover:bg-blue-700 transition-all"
            >
              Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}