"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tv, Wallet, AlertTriangle } from "lucide-react";
import { sendBrowserNotification, addNotificationToHistory } from "@/lib/notifications";

const providers = ["DSTV", "GOtv", "Startimes"];

const packages = [
  { name: "DSTV Padi", price: 3600 },
  { name: "DSTV Yanga", price: 5100 },
  { name: "GOtv Jinja", price: 3900 },
  { name: "GOtv Max", price: 8500 },
  { name: "Startimes Basic", price: 2600 },
];

export default function CableTvPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [iucNumber, setIucNumber] = useState("");
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
          Loading cable portal...
        </div>
      </main>
    );
  }

  // Find price of selected package
  const pkgObj = packages.find((p) => p.name === selectedPackage);
  const pkgPrice = pkgObj ? pkgObj.price : 0;
  const isInsufficient = balance < pkgPrice;

  // Filter packages based on provider
  const filteredPackages = selectedProvider
    ? packages.filter((p) => p.name.toLowerCase().startsWith(selectedProvider.toLowerCase()))
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || selectedProvider === "Select provider") {
      setError("Please select a provider.");
      return;
    }
    if (!selectedPackage || selectedPackage === "Select package") {
      setError("Please select a package.");
      return;
    }
    if (!iucNumber) {
      setError("Please enter your Smart Card / IUC number.");
      return;
    }
    if (pkgPrice <= 0) {
      setError("Invalid package price.");
      return;
    }
    if (isInsufficient) {
      setError("Insufficient wallet balance.");
      return;
    }

    setError("");

    // Deduct from balance
    const newBalance = balance - pkgPrice;
    localStorage.setItem("datasub_balance", String(newBalance));

    // Append to transactions list
    const refId = "DSB-" + Math.floor(10000000 + Math.random() * 90000000);
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newTx = {
      id: "#" + Math.floor(10000 + Math.random() * 90000),
      name: `${selectedProvider} ${selectedPackage.replace(selectedProvider + " ", "")}`,
      number: iucNumber,
      amount: `-₦${pkgPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
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

    // Store success details
    const successDetails = {
      title: "TV Subscription Successful",
      description: `Your subscription of ${selectedPackage} for Smart Card/IUC ${iucNumber} was successfully processed via SurePlug Pro.`,
      reference: refId,
      amount: `₦${pkgPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: `${dateStr} - ${timeStr}`,
    };
    localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

    // Trigger push notification and add to local history
    sendBrowserNotification(
      "TV Subscription Successful! 📺",
      `Successfully renewed ${selectedPackage} for Smart Card ${iucNumber}.`
    );
    addNotificationToHistory(
      "TV Subscription Successful",
      `${selectedPackage} package was successfully activated for Smart Card ${iucNumber}.`,
      "success"
    );

    router.push("/dashboard/success");
  };

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Provider</label>
              <select 
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  setSelectedPackage(""); // reset package on provider change
                }}
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors cursor-pointer"
                required
              >
                <option value="">Select provider</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Package</label>
              <select 
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors cursor-pointer disabled:opacity-60"
                disabled={!selectedProvider}
                required
              >
                <option value="">Select package</option>
                {filteredPackages.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ₦{item.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 dark:text-slate-300">Smart Card / IUC Number</label>
              <input
                type="text"
                placeholder="Enter smart card number"
                value={iucNumber}
                onChange={(e) => setIucNumber(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-4 py-3 text-gray-900 dark:text-slate-200 outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-200/50 dark:border-red-900/30">
                {error}
              </p>
            )}

            {isInsufficient && selectedPackage && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/15 p-4 flex gap-3 items-start">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-red-800 dark:text-red-400 uppercase tracking-widest">Insufficient Wallet Balance</h4>
                  <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">
                    Your current balance of <strong>₦{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong> is less than the transaction cost of <strong>₦{pkgPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>.
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
              disabled={isInsufficient || !selectedProvider || !selectedPackage || !iucNumber}
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
