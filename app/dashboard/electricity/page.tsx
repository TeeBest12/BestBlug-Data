import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

const providers = [
  "IKEDC",
  "EKEDC",
  "AEDC",
  "PHED",
  "IBEDC",
  "KEDCO",
  "JED",
];

const meterTypes = ["Prepaid", "Postpaid"];

export default function ElectricityPage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400">
              <Zap size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Electricity</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Pay electricity bills and buy power tokens.
              </p>
            </div>
          </div>

          <form action="/dashboard/success" className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Electricity Provider</label>
              <select className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-yellow-500 transition-colors">
                <option>Select provider</option>
                {providers.map((provider) => (
                  <option key={provider}>{provider}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Meter Type</label>
              <select className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-yellow-500 transition-colors">
                <option>Select meter type</option>
                {meterTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Meter Number</label>
              <input
                type="text"
                placeholder="Enter meter number"
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-yellow-500 hover:bg-yellow-600 py-3 font-semibold text-white cursor-pointer transition-all"
            >
              Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}