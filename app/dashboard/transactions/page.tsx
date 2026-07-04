"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, History, XCircle } from "lucide-react";

const DEFAULT_TRANSACTIONS = [
  {
    id: "#88219",
    name: "MTN 2GB SME",
    number: "08033123456",
    amount: "-₦490.00",
    status: "Successful",
    date: "10:45 AM",
  },
  {
    id: "#88214",
    name: "Wallet Funding",
    number: "—",
    amount: "+₦10,000.00",
    status: "Successful",
    date: "09:12 AM",
  },
  {
    id: "#88209",
    name: "Airtel 5GB",
    number: "09012345678",
    amount: "-₦1,450.00",
    status: "Failed",
    date: "Yesterday",
  },
  {
    id: "#88192",
    name: "Ikeja Electric",
    number: "0422199081",
    amount: "-₦5,000.00",
    status: "Successful",
    date: "Yesterday",
  },
  {
    id: "#88188",
    name: "DSTV Compact",
    number: "1022341902",
    amount: "-₦12,500.00",
    status: "Pending",
    date: "Yesterday",
  },
];

function getStatusStyle(status: string) {
  if (status === "Successful") {
    return {
      icon: CheckCircle,
      className: "bg-green-100 text-green-700 border-green-200",
    };
  }

  if (status === "Pending") {
    return {
      icon: Clock,
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
  }

  return {
    icon: XCircle,
    className: "bg-red-100 text-red-700 border-red-200",
  };
}

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false);
  const [txList, setTxList] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    const savedTx = localStorage.getItem("datasub_transactions");
    if (savedTx) {
      try {
        setTxList(JSON.parse(savedTx));
      } catch (e) {
        setTxList(DEFAULT_TRANSACTIONS);
      }
    } else {
      setTxList(DEFAULT_TRANSACTIONS);
      localStorage.setItem("datasub_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
    }
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] flex items-center justify-center font-sans transition-colors duration-200">
        <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
          Retrieving activity logs...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="rounded-2xl bg-white dark:bg-[#111827] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
              <History size={24} />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Transactions Log</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                View your recent wallet credits, plan subscription debits, and bill payment activity.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {txList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No transactions recorded yet
              </div>
            ) : (
              txList.map((t, idx) => {
                const statusStyle = getStatusStyle(t.status);
                const StatusIcon = statusStyle.icon;

                // Derive type and description dynamically from saved transaction schema
                let displayType = "Data Purchase";
                if (t.name === "Wallet Funding") {
                  displayType = "Wallet Funding";
                } else if (t.name.toLowerCase().includes("electric")) {
                  displayType = "Electricity Bill";
                } else if (t.name.toLowerCase().includes("dstv") || t.name.toLowerCase().includes("gotv") || t.name.toLowerCase().includes("cable")) {
                  displayType = "Cable TV";
                } else if (t.name.toLowerCase().includes("airtime")) {
                  displayType = "Airtime Purchase";
                }

                const displayDescription = t.number && t.number !== "—" 
                  ? `${t.name} delivered to ${t.number}`
                  : t.name === "Wallet Funding" 
                    ? "Wallet credited with instant deposit"
                    : t.name;

                return (
                  <div
                    key={t.id || idx}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-4 sm:flex-row sm:items-center hover:shadow-sm hover:border-slate-300 transition-all bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded tracking-wider">
                          {t.id || `#${Math.floor(10000 + Math.random() * 90000)}`}
                        </span>
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-tight">{displayType}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {displayDescription}
                      </p>
                      <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                        {t.date}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className={`font-black text-sm ${t.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                        {t.amount}
                      </p>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusStyle.className}`}
                      >
                        <StatusIcon size={12} />
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
