"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Home, History } from "lucide-react";

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [successInfo, setSuccessInfo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Retrieve last successful payment receipt information
    const savedInfo = localStorage.getItem("datasub_last_success");
    if (savedInfo) {
      try {
        setSuccessInfo(JSON.parse(savedInfo));
      } catch (e) {
        setSuccessInfo(null);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F1F5F9] dark:bg-[#0B0F19] px-5 py-6 font-sans transition-colors duration-200">
        <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
          Confirming payment execution...
        </div>
      </main>
    );
  }

  // Fallback credentials if no record is found in cache
  const info = successInfo || {
    title: "Transaction Successful",
    description: "Your transaction request has been received and processed successfully.",
    reference: "DSB-" + Math.floor(10000000 + Math.random() * 90000000),
    amount: "₦2,500.00",
    status: "Successful",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + 
          " - " + 
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1F5F9] dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <section className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] p-8 text-center border border-slate-200 dark:border-slate-800/80 shadow-sm animate-fade-in transition-colors duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-500 mb-6">
          <CheckCircle size={42} />
        </div>

        <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">{info.title}</h1>

        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {info.description}
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800/20 p-4 text-left border border-slate-200/50 dark:border-slate-800 space-y-3 text-xs transition-colors">
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-2.5">
            <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Reference ID</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">{info.reference}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 py-2.5">
            <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Transaction Status</span>
            <span className="font-extrabold text-green-600 dark:text-green-500 uppercase">
              {info.status}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 py-2.5">
            <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Amount Charged</span>
            <span className="font-black text-slate-900 dark:text-white">{info.amount}</span>
          </div>

          {info.gateway && (
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 py-2.5">
              <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Processed Via</span>
              <span className="font-black text-blue-600 dark:text-blue-400 uppercase">{info.gateway}</span>
            </div>
          )}

          <div className="flex justify-between pt-2.5">
            <span className="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Execution Date</span>
            <span className="font-bold text-slate-800 dark:text-slate-300">{info.date}</span>
          </div>
        </div>



        <div className="mt-6 grid gap-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 dark:hover:bg-slate-750 py-3 text-xs font-black uppercase tracking-wider text-white transition-all shadow-sm"
          >
            <Home size={15} />
            Back to Dashboard
          </Link>

          <Link
            href="/dashboard/transactions"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 py-3 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors"
          >
            <History size={15} />
            View Transactions
          </Link>
        </div>
      </section>
    </main>
  );
}
