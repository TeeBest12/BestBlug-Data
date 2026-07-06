"use client";

import { useState, useEffect } from "react";
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
  Lock,
  Zap,
  Copy,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { sendBrowserNotification, addNotificationToHistory } from "@/lib/notifications";

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const amounts = ["₦1,000", "₦2,000", "₦5,000", "₦10,000"];

export default function FundWalletPage() {
  const router = useRouter();
  const [customAmount, setCustomAmount] = useState("");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState("");
  const [gateway, setGateway] = useState("flutterwave"); // "flutterwave" or "paystack"

  // User States & Virtual Account Provider Selection
  const [virtualProvider, setVirtualProvider] = useState<"flutterwave" | "paystack">("flutterwave");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userAccountNo, setUserAccountNo] = useState("9904291834");
  const [userBankName, setUserBankName] = useState("Wema Bank (SurePlug Auto)");
  const [userPaystackAccountNo, setUserPaystackAccountNo] = useState("8804291834");
  const [userPaystackBankName, setUserPaystackBankName] = useState("Titan Trust Bank (SurePlug Auto)");

  // Bank Transfer Simulator State
  const [simAmount, setSimAmount] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [simSuccess, setSimSuccess] = useState("");

  // Dynamic Settings
  const [bankName, setBankName] = useState("Wema Bank / Flutterwave");
  const [accountNo, setAccountNo] = useState("0123456789");
  const [accountName, setAccountName] = useState("SurePlug Pro Collections");
  const [minFunding, setMinFunding] = useState(500);

  // Flutterwave checkout state
  const [showFWModal, setShowFWModal] = useState(false);
  const [fwStep, setFwStep] = useState("method"); // "method", "card-form", "transfer-form", "pin", "otp", "processing"
  const [cardNo, setCardNo] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardPin, setCardPin] = useState("");
  const [cardOtp, setCardOtp] = useState("");
  const [fwError, setFwError] = useState("");
  
  // Copy feedback state
  const [copiedAcc, setCopiedAcc] = useState(false);

  // Live Payment SDK states
  const [loadingGateway, setLoadingGateway] = useState(false);
  const [missingKeyModal, setMissingKeyModal] = useState<{
    gateway: string;
    envVar: string;
    exampleValue: string;
  } | null>(null);

  // Load user details and settings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load user
      const userStr = localStorage.getItem("datasub_user");
      let currentEmail = "guest@datasub.com";
      let currentName = "Valued Customer";
      
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u.email) {
            setUserEmail(u.email);
            currentEmail = u.email;
          }
          if (u.name) {
            setUserName(u.name);
            currentName = u.name;
          }
        } catch (e) {}
      }

      // Load registered users details (to get persistent account number and referrals)
      const savedUsers = localStorage.getItem("datasub_registered_users");
      let registeredUsers = [];
      if (savedUsers) {
        try {
          registeredUsers = JSON.parse(savedUsers);
        } catch (e) {}
      }

      const activeUserRecord = registeredUsers.find((u: any) => u.email === currentEmail);
      if (activeUserRecord) {
        if (activeUserRecord.accountNumber) {
          setUserAccountNo(activeUserRecord.accountNumber);
        }
        if (activeUserRecord.bankName) {
          setUserBankName(activeUserRecord.bankName);
        }
        if (activeUserRecord.paystackAccountNumber) {
          setUserPaystackAccountNo(activeUserRecord.paystackAccountNumber);
        } else {
          // Generate on the fly if missing
          const baseNo = activeUserRecord.accountNumber || "99" + Math.floor(10000000 + Math.random() * 90000000).toString();
          const generatedPSNo = "88" + baseNo.substring(2);
          activeUserRecord.paystackAccountNumber = generatedPSNo;
          activeUserRecord.paystackBankName = "Titan Trust Bank (SurePlug Auto)";
          setUserPaystackAccountNo(generatedPSNo);
          localStorage.setItem("datasub_registered_users", JSON.stringify(registeredUsers));
        }
        if (activeUserRecord.paystackBankName) {
          setUserPaystackBankName(activeUserRecord.paystackBankName);
        }
      } else {
        // Generate on the fly and save
        const generatedNo = "99" + Math.floor(10000000 + Math.random() * 90000000).toString();
        const generatedPSNo = "88" + generatedNo.substring(2);
        setUserAccountNo(generatedNo);
        setUserPaystackAccountNo(generatedPSNo);
        
        // Save new user record
        const newUser = {
          name: currentName,
          email: currentEmail,
          password: "password",
          role: "user",
          balance: 25000,
          accountNumber: generatedNo,
          bankName: "Wema Bank (SurePlug Auto)",
          paystackAccountNumber: generatedPSNo,
          paystackBankName: "Titan Trust Bank (SurePlug Auto)",
          referredBy: null,
          referralCount: 0,
          earnings: 0,
          createdAt: new Date().toISOString()
        };
        registeredUsers.push(newUser);
        localStorage.setItem("datasub_registered_users", JSON.stringify(registeredUsers));
      }

      // Load settings
      const savedSettings = localStorage.getItem("datasub_admin_settings");
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.bankName) setBankName(settings.bankName);
          if (settings.accountNo) setAccountNo(settings.accountNo);
          if (settings.accountName) setAccountName(settings.accountName);
          if (settings.minFunding) setMinFunding(Number(settings.minFunding));
        } catch (e) {}
      }
    }
  }, []);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      alert("Please enter or select a valid funding amount.");
      return;
    }

    if (finalAmount < minFunding) {
      alert(`The minimum wallet funding amount allowed is ₦${minFunding.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`);
      return;
    }

    if (gateway === "flutterwave") {
      const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
      if (!publicKey) {
        setMissingKeyModal({
          gateway: "Flutterwave",
          envVar: "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY",
          exampleValue: "FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx-X",
        });
        return;
      }
      await initiateLiveFlutterwave(publicKey);
    } else {
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        setMissingKeyModal({
          gateway: "Paystack",
          envVar: "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
          exampleValue: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        });
        return;
      }
      await initiateLivePaystack(publicKey);
    }
  };

  const initiateLiveFlutterwave = async (publicKey: string) => {
    setLoadingGateway(true);
    const loaded = await loadScript("https://checkout.flutterwave.com/v3.js");
    setLoadingGateway(false);

    if (!loaded) {
      alert("Failed to load Flutterwave SDK. Please check your internet connection.");
      return;
    }

    const txRef = "FW-TX-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);

    try {
      // @ts-ignore
      const flutterwaveHandler = window.FlutterwaveCheckout({
        public_key: publicKey,
        tx_ref: txRef,
        amount: finalAmount,
        currency: "NGN",
        payment_options: "card, banktransfer, ussd, qr",
        customer: {
          email: userEmail || "customer@example.com",
          name: userName || "Customer",
        },
        customizations: {
          title: "SurePlug Pro",
          description: "Wallet Funding",
        },
        callback: function (data: any) {
          completeFunding(finalAmount, "Flutterwave", data.transaction_id || txRef);
          // @ts-ignore
          flutterwaveHandler.close();
        },
        onclose: function () {
          console.log("Flutterwave payment modal closed");
        },
      });
    } catch (e) {
      console.error(e);
      alert("Error initializing Flutterwave payment. Please verify your public key format.");
    }
  };

  const initiateLivePaystack = async (publicKey: string) => {
    setLoadingGateway(true);
    const loaded = await loadScript("https://js.paystack.co/v1/inline.js");
    setLoadingGateway(false);

    if (!loaded) {
      alert("Failed to load Paystack SDK. Please check your internet connection.");
      return;
    }

    const txRef = "PS-TX-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);

    try {
      // @ts-ignore
      const paystackHandler = window.PaystackPop.setup({
        key: publicKey,
        email: userEmail || "customer@example.com",
        amount: finalAmount * 100, // Paystack amount is in kobo
        currency: "NGN",
        ref: txRef,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: userName || "Customer"
            }
          ]
        },
        callback: function (response: any) {
          completeFunding(finalAmount, "Paystack", response.reference || txRef);
        },
        onClose: function () {
          console.log("Paystack payment modal closed");
        },
      });
      // @ts-ignore
      paystackHandler.openIframe();
    } catch (e) {
      console.error(e);
      alert("Error initializing Paystack payment. Please verify your public key format.");
    }
  };

  const handleSimulatedFallback = () => {
    if (!missingKeyModal) return;
    const selectedGate = missingKeyModal.gateway.toLowerCase();
    setMissingKeyModal(null);

    if (selectedGate === "flutterwave") {
      // Launch custom Flutterwave secure simulated inline checkout
      setFwStep("method");
      setCardNo("");
      setCardExpiry("");
      setCardCvv("");
      setCardPin("");
      setCardOtp("");
      setFwError("");
      setShowFWModal(true);
    } else {
      // Fast simulated checkout for Paystack
      completeFunding(finalAmount, "Paystack (Simulated)", "PS-SIM-" + Math.floor(10000000 + Math.random() * 90000000));
    }
  };

  // Immediate Simulated Bank Transfer Funding
  const handleSimulatedTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setSimSuccess("");

    const transferAmt = parseFloat(simAmount);
    if (!transferAmt || transferAmt <= 0) {
      alert("Please enter a valid amount to transfer.");
      return;
    }

    setSimulating(true);

    setTimeout(() => {
      // Get current balance
      const currentBalanceStr = localStorage.getItem("datasub_balance") || "25000";
      const currentBalance = parseFloat(currentBalanceStr);
      const addedAmount = transferAmt;
      const newBalance = currentBalance + addedAmount;

      // Save new balance
      localStorage.setItem("datasub_balance", String(newBalance));

      // Update registered users database so balance persists
      let registeredUsers = [];
      const savedUsers = localStorage.getItem("datasub_registered_users");
      if (savedUsers) {
        try {
          registeredUsers = JSON.parse(savedUsers);
        } catch (e) {}
      }

      // Find current user's record
      const updatedUsers = registeredUsers.map((u: any) => {
        if (u.email === userEmail) {
          return { ...u, balance: (u.balance || 0) + addedAmount };
        }
        return u;
      });

      // Handle Referral Bonus: If this user has a referrer, credit the referrer exactly ₦500 ONCE on this first funding deposit.
      const activeUserRecord = registeredUsers.find((u: any) => u.email === userEmail);
      let referralMsg = "";
      const isFirstDeposit = activeUserRecord ? !activeUserRecord.firstDepositDone : true;

      if (isFirstDeposit) {
        // Mark first deposit done for current user so it only credits once
        for (let i = 0; i < updatedUsers.length; i++) {
          if (updatedUsers[i].email === userEmail) {
            updatedUsers[i].firstDepositDone = true;
          }
        }

        // If referred by someone, credit them ₦500
        if (activeUserRecord && activeUserRecord.referredBy) {
          const referrerEmail = activeUserRecord.referredBy.toLowerCase().trim();
          const commissionAmount = 500; // Fixed ₦500 cash referral credit
          
          for (let i = 0; i < updatedUsers.length; i++) {
            if (updatedUsers[i].email === referrerEmail) {
              updatedUsers[i].balance = (updatedUsers[i].balance || 0) + commissionAmount;
              updatedUsers[i].earnings = (updatedUsers[i].earnings || 0) + commissionAmount;
              referralMsg = `Referrer ${referrerEmail} credited with ₦500 first-deposit referral bonus!`;
              break;
            }
          }
        }
      }

      localStorage.setItem("datasub_registered_users", JSON.stringify(updatedUsers));

      // Append successful transfer transaction
      const refId = "SIM-TRF-" + Math.floor(10000000 + Math.random() * 90000000);
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const newTx = {
        id: "#" + Math.floor(10000 + Math.random() * 90000),
        name: "Bank Transfer Credit",
        number: "Wema Sim Auto",
        amount: `+₦${addedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        status: "Successful",
        date: timeStr,
      };

      const savedTx = localStorage.getItem("datasub_transactions");
      let txs = [];
      if (savedTx) {
        try {
          txs = JSON.parse(savedTx);
        } catch (ex) {
          txs = [];
        }
      }
      txs = [newTx, ...txs];
      localStorage.setItem("datasub_transactions", JSON.stringify(txs));

      // Set last success details
      const successDetails = {
        title: "Bank Transfer Received",
        description: `Automated instant bank transfer of ₦${addedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} credited successfully to your wallet.`,
        reference: refId,
        amount: `₦${addedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        status: "Successful",
        date: `${dateStr} - ${timeStr}`,
      };
      localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

      // Trigger notification
      sendBrowserNotification(
        "Instant Credit Received! 🏦",
        `₦${addedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} was automatically credited from simulated bank transfer.`
      );
      addNotificationToHistory(
        "Wallet Credited Instantly",
        `Your virtual bank account received ₦${addedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}. Balance updated immediately. ${referralMsg}`,
        "success"
      );

      setSimulating(false);
      setSimAmount("");
      setSimSuccess(`Success! ₦${addedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been instantly credited to your wallet.`);
      
      // Auto dismiss success and route or refresh
      setTimeout(() => {
        setSimSuccess("");
        router.push("/dashboard");
      }, 2500);

    }, 1500);
  };

  const completeFunding = (amountOverride?: number, gatewayOverride?: string, refOverride?: string) => {
    const amountToFund = amountOverride !== undefined ? amountOverride : finalAmount;
    const activeGateway = gatewayOverride || gateway;
    // Get current balance
    const currentBalanceStr = localStorage.getItem("datasub_balance") || "25000";
    const currentBalance = parseFloat(currentBalanceStr);
    const newBalance = currentBalance + amountToFund;

    // Save new balance
    localStorage.setItem("datasub_balance", String(newBalance));

    // Update registered users list
    let registeredUsers = [];
    const savedUsers = localStorage.getItem("datasub_registered_users");
    if (savedUsers) {
      try {
        registeredUsers = JSON.parse(savedUsers);
      } catch (e) {}
    }

    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.email === userEmail) {
        return { ...u, balance: (u.balance || 0) + amountToFund };
      }
      return u;
    });

    // Credit referrer: If this user has a referrer, credit them exactly ₦500 ONCE on this first funding deposit.
    const activeUserRecord = registeredUsers.find((u: any) => u.email === userEmail);
    const isFirstDeposit = activeUserRecord ? !activeUserRecord.firstDepositDone : true;

    if (isFirstDeposit) {
      // Mark first deposit done for current user
      for (let i = 0; i < updatedUsers.length; i++) {
        if (updatedUsers[i].email === userEmail) {
          updatedUsers[i].firstDepositDone = true;
        }
      }

      // If referred by someone, credit them ₦500
      if (activeUserRecord && activeUserRecord.referredBy) {
        const referrerEmail = activeUserRecord.referredBy.toLowerCase().trim();
        const commissionAmount = 500; // Fixed ₦500 cash referral credit
        
        for (let i = 0; i < updatedUsers.length; i++) {
          if (updatedUsers[i].email === referrerEmail) {
            updatedUsers[i].balance = (updatedUsers[i].balance || 0) + commissionAmount;
            updatedUsers[i].earnings = (updatedUsers[i].earnings || 0) + commissionAmount;
            break;
          }
        }
      }
    }

    localStorage.setItem("datasub_registered_users", JSON.stringify(updatedUsers));

    const refId = refOverride || ("DSB-" + Math.floor(10000000 + Math.random() * 90000000));
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Create a transaction record
    const newTx = {
      id: "#" + Math.floor(10000 + Math.random() * 90000),
      name: "Wallet Funding",
      number: activeGateway.toUpperCase(),
      amount: `+₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: timeStr,
    };

    // Load and update transactions
    const savedTx = localStorage.getItem("datasub_transactions");
    let txs = [];
    if (savedTx) {
      try {
        txs = JSON.parse(savedTx);
      } catch (ex) {
        txs = [];
      }
    }

    // Insert new transaction at top
    txs = [newTx, ...txs];
    localStorage.setItem("datasub_transactions", JSON.stringify(txs));

    // Store success details
    const successDetails = {
      title: "Wallet Funding Successful",
      description: `Your wallet has been funded with ₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })} successfully via ${activeGateway.toUpperCase()}.`,
      reference: refId,
      amount: `₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: "Successful",
      date: `${dateStr} - ${timeStr}`,
    };
    localStorage.setItem("datasub_last_success", JSON.stringify(successDetails));

    // Trigger native browser notification and add to local notification history
    sendBrowserNotification(
      "Wallet Funding Successful! 🎉",
      `Your SurePlug Pro wallet was funded with ₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })} successfully.`
    );
    addNotificationToHistory(
      "Wallet Funding Successful",
      `Your wallet has been funded with ₦${amountToFund.toLocaleString("en-US", { minimumFractionDigits: 2 })} successfully via ${activeGateway.toUpperCase()}.`,
      "success"
    );

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

  const handleCopyAccount = () => {
    const activeAccNo = virtualProvider === "flutterwave" ? userAccountNo : userPaystackAccountNo;
    navigator.clipboard.writeText(activeAccNo);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] px-6 py-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* BACK HEADER */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* PAGE INTRO */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Wallet size={20} />
          </div>

          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fund Wallet</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Top up your balance instantly using automated bank transfer or secure debit card gateway.
            </p>
          </div>
        </div>

        {/* SECTION 1: INSTANT DEDICATED BANK TRANSFER FUNDING (DURABLE & IMMEDIATE REFLECTION) */}
        <section className="rounded-2xl bg-white dark:bg-[#111827] p-6 border-2 border-blue-500 dark:border-blue-600 shadow-md relative overflow-hidden transition-all duration-200">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
            ⚡ Recommended & Free
          </div>

          <div className="flex items-center gap-2.5 mb-4">
            <Landmark className="text-blue-600 dark:text-blue-400 shrink-0" size={18} />
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
              Dedicated Virtual Bank Account
            </h2>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-normal">
            Make an online bank transfer to your personalized virtual account below, and the funds will credit your SurePlug wallet <strong>instantly & automatically</strong> at any time of day.
          </p>

          {/* PROVIDER TOGGLE TABS */}
          <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setVirtualProvider("flutterwave")}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                virtualProvider === "flutterwave"
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Flutterwave Gen
            </button>
            <button
              type="button"
              onClick={() => setVirtualProvider("paystack")}
              className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                virtualProvider === "paystack"
                  ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Paystack Gen
            </button>
          </div>

          {/* DEDICATED BANK DETAILS VIEW */}
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10 p-4 space-y-3.5 mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">Bank Partner</span>
              <span className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
                {virtualProvider === "flutterwave" ? userBankName : userPaystackBankName}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-y border-slate-100 dark:border-slate-800/40 py-2.5">
              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-lg tracking-wider">
                  {virtualProvider === "flutterwave" ? userAccountNo : userPaystackAccountNo}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAccount}
                  className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                  title="Copy Account Number"
                >
                  {copiedAcc ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">Beneficiary Name</span>
              <span className="font-bold text-slate-800 dark:text-white text-[11px] uppercase tracking-tight">
                SUREPLUG - {userName || "VALUED USER"}
              </span>
            </div>
          </div>

          {/* TRANSFER SIMULATOR (REFLECTS IMMEDIATELY) */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 bg-slate-50/80 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500 animate-pulse" />
              Test Instant Transfer Credit
            </h3>
            
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
              Simulate an incoming direct bank transfer credit of any amount to verify the immediate wallet reflection!
            </p>

            {simSuccess && (
              <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800 flex items-start gap-2 animate-fade-in uppercase tracking-tight">
                <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                <span>{simSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSimulatedTransfer} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">₦</span>
                <input
                  type="number"
                  placeholder="Enter test amount (e.g. 5000)"
                  value={simAmount}
                  onChange={(e) => setSimAmount(e.target.value)}
                  className="w-full rounded-xl pl-7 pr-3 py-2.5 text-xs font-black text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-colors placeholder-slate-400"
                  disabled={simulating}
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                disabled={simulating}
              >
                {simulating ? (
                  <>
                    <RefreshCw className="animate-spin" size={13} />
                    Crediting...
                  </>
                ) : (
                  "Fund Instantly"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* SECTION 2: CARD GATEWAY OPTION */}
        <section className="rounded-2xl bg-white dark:bg-[#111827] p-6 border border-slate-200 dark:border-slate-800/80 shadow-xs transition-all duration-200">
          <div className="flex items-center gap-2.5 mb-4">
            <CreditCard className="text-slate-500 dark:text-slate-400 shrink-0" size={18} />
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
              Pay via Gateway Link
            </h2>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Quick Amount Select
              </label>
              <div className="grid grid-cols-2 gap-3">
                {amounts.map((amount) => {
                  const isSelected = selectedQuickAmount === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleQuickSelect(amount)}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Custom Amount (₦)
              </label>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none placeholder-slate-400 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Gateway Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway("flutterwave")}
                  className={`rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                  className={`rounded-xl border px-4 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
              className="w-full rounded-xl bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">SurePlug Pro</h2>
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

            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center text-slate-800">
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
                <div className="w-full space-y-3 text-slate-800">
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
                  className="w-full text-left space-y-4 text-slate-800"
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
                  className="w-full text-left space-y-4 text-slate-800"
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
                  className="w-full text-left space-y-4 text-slate-800"
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
                <div className="w-full text-left space-y-4 text-slate-800">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Instant Bank Transfer</h3>
                  
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2.5">
                     <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Bank Name</span>
                      <span className="font-black text-slate-800 uppercase">{bankName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Account Number</span>
                      <span className="font-mono font-black text-slate-900 text-sm">{accountNo}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-400 uppercase text-[10px]">Account Name</span>
                      <span className="font-bold text-slate-800 text-[11px] uppercase">{accountName}</span>
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
                <div className="w-full flex flex-col items-center justify-center py-6 space-y-4 text-slate-800">
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

      {/* Loading Gateway script spinner */}
      {loadingGateway && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center z-50 text-white">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-4">
            <RefreshCw className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
            <div className="text-center">
              <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Securing Gateway Connection</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Loading secure checkout SDK...</p>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Missing API Key Configuration Assistant */}
      {missingKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden relative">
            <button
              onClick={() => setMissingKeyModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title="Close Dialog"
            >
              <X size={16} />
            </button>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center flex flex-col items-center gap-2">
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                <Lock className="text-yellow-300 animate-pulse" size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/50 px-2 py-0.5 rounded text-blue-100">
                Integration Guide
              </span>
              <h2 className="text-base font-black uppercase tracking-tight leading-snug">{missingKeyModal.gateway} Credentials Required</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10 p-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                  You are activating the real, live **{missingKeyModal.gateway} checkout flow**! 
                  To complete live or test transactions via your own gateway account, declare your public key in your environment variables:
                </p>
                <div className="mt-3.5 bg-slate-950 text-slate-300 p-3 rounded-xl font-mono text-[10px] space-y-1 select-all border border-slate-800 break-all">
                  <div className="text-slate-500"># Inside .env or Secrets panel</div>
                  <span className="text-emerald-400">{missingKeyModal.envVar}</span>="<span className="text-amber-300">{missingKeyModal.exampleValue}</span>"
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2.5">
                <button
                  onClick={handleSimulatedFallback}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase tracking-wider py-3 rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap size={13} className="text-amber-300" />
                  Run Simulator Sandbox Instead
                </button>
                <button
                  onClick={() => setMissingKeyModal(null)}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider py-3 rounded-xl text-[10px] transition-colors cursor-pointer"
                >
                  Close & Configure Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
