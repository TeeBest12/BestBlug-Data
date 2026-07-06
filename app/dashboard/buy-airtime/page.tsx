"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Wallet, AlertTriangle } from "lucide-react";
import { sendBrowserNotification, addNotificationToHistory } from "@/lib/notifications";

const networks = ["MTN", "Airtel", "Glo", "9mobile"];

export default function BuyAirtimePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [balance, setBalance] = useState(25000);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    // Load balance
    const savedBalance = localStorage.getItem("datasub_balance");
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] flex items-center justify-center font-sans transition-colors duration-200">
        <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
          Loading airtime portal...
        </div>
      </main>
    );
  }

  const airtimeAmount = parseFloat(amount) || 0;
  const isInsufficient = balance < airtimeAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNetwork || selectedNetwork === "Select network") {
      setError("Please select a network provider.");
      return;
    }
    if (airtimeAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (isInsufficient) {
      setError("Insufficient wallet balance.");
      return;
    }

    setError("");

    // Deduct from balance
    const newBalance = balance - airtimeAmount;
    localStorage.setItem("datasub_balance", String(newBalance));

    // Append to transactions list
    const refId = "DSB-" + Math.floor(10000000 + Math.random() * 90000000);
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newTx = {
      id: "#" + Math.floor(10000 + Math.random() * 90000),
      name: `${selectedNetwork} Airtime`,
      number: phoneNumber,
      amount: `-₦${airtimeAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: timeStr,
    };

    const savedTx = localStorage.getItem("datasub_transactions");
    let txs = [];
    if (savedTx) {
      try {
        txs = JSON.parse(savedTx);
      } catch (err) {
        txs = [];
      }
    }
    txs = [newTx, ...txs];
    localStorage.setItem("datasub_transactions", JSON.stringify(txs));

    // Store success notification details
    const successDetails = {
      title: "Airtime Purchase Successful",
      description: `Your recharge of ₦${airtimeAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} Airtime on ${selectedNetwork} was successfully sent to ${phoneNumber}.`,
      reference: refId,
      amount: `₦${airtimeAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: `${dateStr} - ${timeStr}`,
    };
    localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

    // Trigger browser notification and add to local history
    sendBrowserNotification(
      "Airtime Top-Up Successful! 📱",
      `Successfully recharged ₦${airtimeAmount.toLocaleString()} Airtime to ${phoneNumber}.`
    );
    addNotificationToHistory(
      "Airtime Top-Up Successful",
      `₦${airtimeAmount.toLocaleString()} ${selectedNetwork} Airtime was sent to ${phoneNumber}.`,
      "success"
    );

    router.push("/dashboard/success");
  };

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Network</label>
              <select 
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                required
              >
                <option value="">Select network</option>
                {networks.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Amount (₦)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-200/50 dark:border-red-900/30">
                {error}
              </p>
            )}

            {isInsufficient && amount && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/15 p-4 flex gap-3 items-start">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-red-800 dark:text-red-400 uppercase tracking-widest">Insufficient Wallet Balance</h4>
                  <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">
                    Your current balance of <strong>₦{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong> is less than the transaction cost of <strong>₦{airtimeAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>.
                  </p>
                  <Link
                    href="/dashboard/fund-wallet"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-red-800 dark:text-red-400 hover:underline pt-1 cursor-pointer"
                  >
                    <Wallet size={12} />
                    Fund Wallet to Proceed &rarr;
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isInsufficient || !selectedNetwork || !amount || !phoneNumber}
              className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
