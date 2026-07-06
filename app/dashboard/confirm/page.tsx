"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Smartphone, AlertTriangle, Wallet, Loader2 } from "lucide-react";
import { sendBrowserNotification, addNotificationToHistory } from "@/lib/notifications";

export default function ConfirmPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [balance, setBalance] = useState(25000);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateFailover, setSimulateFailover] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Load pending transaction
    const savedTx = localStorage.getItem("datasub_pending_tx");
    if (savedTx) {
      try {
        setPendingTx(JSON.parse(savedTx));
      } catch (e) {
        setPendingTx(null);
      }
    }

    // Load wallet balance
    const savedBalance = localStorage.getItem("datasub_balance");
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] flex items-center justify-center font-sans transition-colors duration-200">
        <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 animate-pulse">
          Loading checkout details...
        </div>
      </main>
    );
  }

  // Fallback defaults if no pending transaction exists
  const tx = pendingTx || {
    service: "Data Purchase",
    network: "MTN",
    plan: "15GB / 30 Days",
    price: "₦2,500",
    phone: "08012345678",
  };

  // Extract amount as float
  const cleanPriceStr = tx.price || tx.amount || "₦0";
  const planPrice = parseFloat(cleanPriceStr.replace(/[^\d.]/g, "")) || 0;
  const isInsufficient = balance < planPrice;

  const handleConfirmPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInsufficient || isLoading) return;

    setIsLoading(true);
    setApiError("");
    setApiLogs([]);

    try {
      const response = await fetch("/api/vtu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          network: tx.network,
          plan: tx.plan,
          price: tx.price,
          phone: tx.phone,
          service: tx.service,
          simulateFailover: simulateFailover,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setApiLogs(result.log || []);

        // Deduct and save balance
        const newBalance = balance - planPrice;
        localStorage.setItem("datasub_balance", String(newBalance));

        const refId = result.reference || "DSB-" + Math.floor(10000000 + Math.random() * 90000000);
        const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Append transaction log
        const newTxLog = {
          id: "#" + Math.floor(10000 + Math.random() * 90000),
          name: `${tx.network} ${tx.plan}`,
          number: tx.phone,
          amount: `-₦${planPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          status: "Successful",
          date: timeStr,
          gateway: result.gateway,
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
        txs = [newTxLog, ...txs];
        localStorage.setItem("datasub_transactions", JSON.stringify(txs));

        // Store success notification details
        const successDetails = {
          title: "Subscription Successful",
          description: `Your ${tx.network} ${tx.plan} subscription was successfully delivered via ${result.gateway} to ${tx.phone}.`,
          reference: refId,
          amount: `₦${planPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          status: "Successful",
          date: `${dateStr} - ${timeStr}`,
          logs: result.log || [],
          gateway: result.gateway,
        };
        localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

        // Trigger native browser notification and record in history
        sendBrowserNotification(
          "Subscription Successful! 🚀",
          `Your ${tx.network} ${tx.plan} subscription to ${tx.phone} has been processed successfully.`
        );
        addNotificationToHistory(
          "Subscription Successful",
          `Your ${tx.network} ${tx.plan} subscription was successfully delivered to ${tx.phone}.`,
          "success"
        );

        // Clear pending transaction
        localStorage.removeItem("datasub_pending_tx");

        // Route to success page after a small delay to let user review success
        setTimeout(() => {
          router.push("/dashboard/success");
        }, 1500);
      } else {
        setApiLogs(result.log || []);
        setApiError(result.error || "All VTU API gateways failed. Transaction aborted.");
      }
    } catch (err: any) {
      setApiError(err.message || "A network routing error occurred while processing subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard/buy-data"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Buy Data
        </Link>

        <section className="rounded-2xl bg-white dark:bg-[#111827] p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30">
              <Smartphone size={24} />
            </div>

            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Confirm Transaction</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Review subscription purchase credentials and authorization.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/20 p-5 border border-slate-200/60 dark:border-slate-800">
            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service</span>
              <span className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200">{tx.service || "Data Purchase"}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/80 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Network Provider</span>
              <span className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200">{tx.network}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/80 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data Plan</span>
              <span className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200">{tx.plan}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/80 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recipient Phone</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">{tx.phone}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 border-dashed">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Plan Amount</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">₦{planPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Available Wallet Balance</span>
              <span className={`text-xs font-extrabold ${isInsufficient ? "text-red-600 font-black" : "text-slate-500 dark:text-slate-400"}`}>
                ₦{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Insufficient Balance warning message */}
          {isInsufficient && (
            <div className="mt-5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/15 p-4 flex gap-3 items-start animate-fade-in">
              <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-red-800 dark:text-red-400 uppercase tracking-widest">Insufficient Wallet Balance</h4>
                <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">
                  Your current balance of <strong>₦{balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong> is less than the subscription cost of <strong>₦{planPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>.
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

          {/* Failover / Redundancy Demonstration Control */}
          <div className="mt-5 rounded-xl border border-dashed border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">Multi-Gateway Failover Engine</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Active backup auto-routing between <strong>VTpass (Primary)</strong> and <strong>Clubkonnect (Secondary)</strong>.
                </p>
              </div>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-900/50">
                ACTIVE FAILOVER
              </span>
            </div>

            <label className="flex items-center gap-2.5 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:border-blue-500/50 transition-all select-none">
              <input
                type="checkbox"
                checked={simulateFailover}
                onChange={(e) => setSimulateFailover(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              />
              <div>
                <p className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">Simulate Primary Gateway Down</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                  Force VTpass to fail to witness instant automatic Clubkonnect redundancy failover routing!
                </p>
              </div>
            </label>
          </div>

          {/* Active routing logs */}
          {(isLoading || apiLogs.length > 0 || apiError) && (
            <div className="mt-5 rounded-xl bg-slate-900 p-4 border border-slate-800 text-white font-mono text-[10px] space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Live Connection Routing Logs</span>
                {isLoading ? (
                  <span className="text-blue-400 animate-pulse font-bold uppercase">Processing...</span>
                ) : apiError ? (
                  <span className="text-red-500 font-black uppercase">Failed</span>
                ) : (
                  <span className="text-green-400 font-black uppercase font-mono">Success</span>
                )}
              </div>
              
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {apiLogs.map((logLine, index) => (
                  <p key={index} className="text-slate-300 leading-relaxed">
                    {logLine}
                  </p>
                ))}
                {isLoading && apiLogs.length === 0 && (
                  <p className="text-slate-500 italic">Initializing handshakes with server payment gateways...</p>
                )}
                {apiError && (
                  <p className="text-red-500 font-bold bg-red-950/40 p-2 rounded border border-red-900/30">
                    ❌ ERROR: {apiError}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleConfirmPay}
              disabled={isInsufficient || isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle size={15} />
              )}
              {isLoading ? "Processing Handshake..." : "Confirm and Pay"}
            </button>

            <Link
              href="/dashboard/buy-data"
              className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Edit Details
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
