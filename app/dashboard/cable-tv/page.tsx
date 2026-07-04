import Link from "next/link";
import { ArrowLeft, Tv } from "lucide-react";

const providers = ["DSTV", "GOtv", "Startimes"];

const packages = [
  "DSTV Padi - ₦3,600",
  "DSTV Yanga - ₦5,100",
  "GOtv Jinja - ₦3,900",
  "GOtv Max - ₦8,500",
  "Startimes Basic - ₦2,600",
];

export default function CableTvPage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Tv size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cable TV</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Pay for your cable TV subscription.
              </p>
            </div>
          </div>

          <form action="/dashboard/success" className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Provider</label>
              <select className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors">
                <option>Select provider</option>
                {providers.map((provider) => (
                  <option key={provider}>{provider}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Package</label>
              <select className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors">
                <option>Select package</option>
                {packages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Smart Card / IUC Number</label>
              <input
                type="text"
                placeholder="Enter smart card number"
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-purple-600 py-3 font-semibold text-white cursor-pointer hover:bg-purple-700 transition-all"
            >
              Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}