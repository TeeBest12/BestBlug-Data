"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";

const amounts = ["₦1,000", "₦2,000", "₦5,000", "₦10,000"];

export default function FundWalletPage() {
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState("");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState("");

  const handleQuickSelect = (amt: string) => {
    setSelectedQuickAmount(amt);
    setCustomAmount(""); // clear custom input
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setSelectedQuickAmount(""); // clear quick selection
  };

  // Calculate final amount
  const getAmountNumber = () => {
    if (customAmount) return parseFloat(customAmount) || 0;
    if (selectedQuickAmount) {
      return parseFloat(selectedQuickAmount.replace(/[^\d.]/g, "")) || 0;
    }
    return 0;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const amountToFund = getAmountNumber();
    if (amountToFund <= 0) {
      alert("Please enter or select a valid funding amount.");
      return;
    }

    // Get current balance
    const currentBalanceStr = localStorage.getItem("datasub_balance") || "25000";
    const currentBalance = parseFloat(currentBalanceStr);
    const newBalance = currentBalance + amountToFund;

    // Save new balance
    localStorage.setItem("datasub_balance", String(newBalance));

    const refId = "DSB-" + Math.floor(10000000 + Math.random() * 90000000);
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Create a transaction record
    const newTx = {
      id: "#" + Math.floor(10000 + Math.random() * 90000),
      name: "Wallet Funding",
      number: "—",
      amount: `+₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: timeStr,
    };

    // Load and update transactions
    const savedTx = localStorage.getItem("datasub_transactions");
    let txs = [];
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

    if (savedTx) {
      try {
        txs = JSON.parse(savedTx);
      } catch (ex) {
        txs = DEFAULT_TRANSACTIONS;
      }
    } else {
      txs = DEFAULT_TRANSACTIONS;
    }

    // Insert new transaction at top
    txs = [newTx, ...txs];
    localStorage.setItem("datasub_transactions", JSON.stringify(txs));

    // Store success details
    const successDetails = {
      title: "Wallet Funding Successful",
      description: `Your wallet has been funded with ₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })} successfully.`,
      reference: refId,
      amount: `₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: `${dateStr} - ${timeStr}`,
    };
    localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

    // Redirect to success page
    router.push("/dashboard/success");
  };

  const finalAmount = getAmountNumber();

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] px-6 py-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="rounded-xl bg-white dark:bg-[#111827] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
              <Wallet size={20} />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fund Wallet</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Add funds securely to purchase data, airtime, and utility top-ups instantly.
              </p>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Quick Amount Select</label>
              <div className="grid grid-cols-2 gap-3">
                {amounts.map((amount) => {
                  const isSelected = selectedQuickAmount === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleQuickSelect(amount)}
                      className={`rounded border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      {amount}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Custom Amount (₦)</label>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none placeholder-slate-400 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Gateway Payment Method</label>
              <div className="flex items-center gap-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5">
                <CreditCard className="text-slate-500 dark:text-slate-400 shrink-0" size={16} />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Debit Card / Instant Bank Transfer (Paystack)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={finalAmount <= 0}
              className="w-full rounded bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {finalAmount > 0 ? `Authorize & Pay ₦${finalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "Authorize & Pay"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
