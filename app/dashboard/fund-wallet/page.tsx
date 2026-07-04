"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Landmark, 
  Smartphone, 
  Lock 
} from "lucide-react";

const amounts = ["₦1,000", "₦2,000", "₦5,000", "₦10,000"];

export default function FundWalletPage() {
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState("");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState("");
  const [gateway, setGateway] = useState("flutterwave"); // "flutterwave" or "paystack"

  // Flutterwave checkout state
  const [showFWModal, setShowFWModal] = useState(false);
  const [fwStep, setFwStep] = useState("method"); // "method", "card-form", "transfer-form", "pin", "otp", "processing"
  const [cardNo, setCardNo] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [cardOtp, setCardOtp] = useState("");
  const [fwError, setFwError] = useState("");

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

  const finalAmount = getAmountNumber();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      alert("Please enter or select a valid funding amount.");
      return;
    }

    if (gateway === "flutterwave") {
      // Launch custom Flutterwave secure inline checkout
      setFwStep("method");
      setCardNo("");
      setCardExpiry("");
      setCardCvv("");
      setCardPin("");
      setCardOtp("");
      setFwError("");
      setShowFWModal(true);
    } else {
      // Direct fast checkout for Paystack
      completeFunding();
    }
  };

  const completeFunding = () => {
    const amountToFund = finalAmount;
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
      description: `Your wallet has been funded with ₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })} successfully via ${gateway.toUpperCase()}.`,
      reference: refId,
      amount: `₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: `${dateStr} - ${timeStr}`,
    };
    localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

    // Redirect to success page
    router.push("/dashboard/success");
  };

  // Card formatting helpers
  const handleCardNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const formatted = rawVal.substring(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNo(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    let formatted = rawVal;
    if (rawVal.length > 2) {
      formatted = rawVal.substring(0, 2) + "/" + rawVal.substring(2, 4);
    }
    setCardExpiry(formatted);
  };

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

          <form onSubmit={handleFormSubmit} className="space-y-5">
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway("flutterwave")}
                  className={`rounded border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    gateway === "flutterwave"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500 shadow-sm font-black"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <CreditCard size={15} className={gateway === "flutterwave" ? "text-amber-500" : ""} />
                  <span>Flutterwave</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGateway("paystack")}
                  className={`rounded border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    gateway === "paystack"
                      ? "bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600 shadow-sm font-black"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <CreditCard size={15} className={gateway === "paystack" ? "text-blue-500" : ""} />
                  <span>Paystack</span>
                </button>
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

      {/* Flutterwave Secure 3D Checkout Modal */}
      {showFWModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 text-slate-800 flex flex-col relative transition-all duration-300">
            {/* Header decor with Flutterwave gold bar */}
            <div className="bg-amber-500 h-1.5 w-full"></div>
            
            {/* Merchant / Payment Summary */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">PAYMENT TO</h3>
                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">BestBlug Pro</h2>
              </div>
              <button 
                type="button"
                onClick={() => setShowFWModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200/50 cursor-pointer"
                title="Cancel Checkout"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
              {/* Flutterwave Gold Logo Accent */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Flutterwave Gateway
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-6">
                ₦{finalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>

              {fwStep === "method" && (
                <div className="w-full space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-left">Choose Payment Option</p>
                  
                  <button
                    type="button"
                    onClick={() => setFwStep("card-form")}
                    className="w-full rounded-2xl border border-slate-200 hover:border-amber-500 p-4 flex items-center gap-4 text-left hover:bg-amber-500/5 transition-all cursor-pointer group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Pay with Debit Card</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Instant secure auth</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFwStep("transfer-form")}
                    className="w-full rounded-2xl border border-slate-200 hover:border-amber-500 p-4 flex items-center gap-4 text-left hover:bg-amber-500/5 transition-all cursor-pointer group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Landmark size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Pay with Bank Transfer</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Receive account details</p>
                    </div>
                  </button>
                </div>
              )}

              {/* CARD FORM */}
              {fwStep === "card-form" && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!cardNo || !cardExpiry || !cardCvv) {
                      setFwError("All card details are required");
                      return;
                    }
                    setFwError("");
                    setFwStep("pin");
                  }}
                  className="w-full text-left space-y-4"
                >
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Card Details</h3>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        value={cardNo}
                        onChange={handleCardNoChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-mono font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-colors"
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-mono font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-colors text-center"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-mono font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-colors text-center"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  {fwError && <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{fwError}</p>}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setFwStep("method")}
                      className="w-1/3 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs uppercase tracking-wider font-extrabold text-slate-600 transition-colors cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white transition-colors cursor-pointer text-center"
                    >
                      Pay ₦{finalAmount.toLocaleString()}
                    </button>
                  </div>
                </form>
              )}

              {/* CARD PIN */}
              {fwStep === "pin" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!cardPin || cardPin.length < 4) {
                      setFwError("Enter a valid 4-digit PIN");
                      return;
                    }
                    setFwError("");
                    setFwStep("processing");
                    setTimeout(() => {
                      setFwStep("otp");
                    }, 2000);
                  }}
                  className="w-full text-left space-y-4"
                >
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 mb-2">
                      <Lock size={18} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Enter Card PIN</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Required for securing the connection</p>
                  </div>

                  <div>
                    <input
                      type="password"
                      placeholder="* * * *"
                      value={cardPin}
                      onChange={(e) => setCardPin(e.target.value.replace(/\D/g, "").substring(0, 4))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-lg font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-colors text-center tracking-[1rem]"
                      maxLength={4}
                      required
                    />
                  </div>

                  {fwError && <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider text-center">{fwError}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white transition-colors cursor-pointer text-center"
                  >
                    Submit PIN
                  </button>
                </form>
              )}

              {/* OTP CODE */}
              {fwStep === "otp" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!cardOtp) {
                      setFwError("Enter the valid code sent to your phone");
                      return;
                    }
                    setFwError("");
                    setFwStep("processing");
                    setTimeout(() => {
                      completeFunding();
                    }, 2500);
                  }}
                  className="w-full text-left space-y-4"
                >
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 mb-2">
                      <Smartphone size={18} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Enter 3D-Secure OTP</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">We sent a verification code to your phone</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="1 2 3 4 5 6"
                      value={cardOtp}
                      onChange={(e) => setCardOtp(e.target.value.replace(/\D/g, "").substring(0, 6))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-lg font-bold text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-colors text-center tracking-[0.5rem]"
                      maxLength={6}
                      required
                    />
                  </div>

                  {fwError && <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider text-center">{fwError}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white transition-colors cursor-pointer text-center"
                  >
                    Verify & Confirm Payment
                  </button>
                </form>
              )}

              {/* BANK TRANSFER FORM */}
              {fwStep === "transfer-form" && (
                <div className="w-full text-left space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Instant Bank Transfer</h3>
                  
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Bank Name</span>
                      <span className="font-black text-slate-800 uppercase">Wema Bank / Flutterwave</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Account Number</span>
                      <span className="font-mono font-black text-slate-900 text-sm">0123456789</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Account Name</span>
                      <span className="font-bold text-slate-800 text-[11px] uppercase">BestBlug Pro Collections</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal font-medium text-center">
                    Transfer exactly <span className="font-black text-slate-800">₦{finalAmount.toLocaleString()}</span> to the account above. Flutterwave will detect your payment automatically.
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFwStep("method")}
                      className="w-1/3 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs uppercase tracking-wider font-extrabold text-slate-600 transition-colors cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFwStep("processing");
                        setTimeout(() => {
                          completeFunding();
                        }, 3000);
                      }}
                      className="w-2/3 rounded-xl bg-amber-500 hover:bg-amber-600 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white transition-colors cursor-pointer text-center"
                    >
                      I have made transfer
                    </button>
                  </div>
                </div>
              )}

              {/* PROCESSING / LOADING */}
              {fwStep === "processing" && (
                <div className="w-full flex flex-col items-center justify-center py-6 space-y-4">
                  <RefreshCw className="text-amber-500 animate-spin" size={40} />
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Processing Payment</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Connecting securely to Flutterwave...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer padlock indicator */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <Lock size={12} className="text-green-600" />
              <span>Secured by Flutterwave 3D-Secure</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
