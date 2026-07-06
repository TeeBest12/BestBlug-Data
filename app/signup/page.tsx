"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Phone, User, Gift, AlertCircle, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referrer, setReferrer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Get referrer from URL query param
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        setReferrer(ref);
      }
    }
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const lowerEmail = email.toLowerCase().trim();

    // Load registered users from localStorage
    let registeredUsers = [];
    const savedUsers = localStorage.getItem("datasub_registered_users");
    if (savedUsers) {
      try {
        registeredUsers = JSON.parse(savedUsers);
      } catch (e) {
        registeredUsers = [];
      }
    }

    // Check if user already exists
    const userExists = registeredUsers.some((u: any) => u.email === lowerEmail);
    if (userExists) {
      setError("An account with this email already exists.");
      return;
    }

    // Generate a unique 10-digit virtual bank account number for the user
    const generatedAccountNo = "99" + Math.floor(10000000 + Math.random() * 90000000).toString();

    // Create new user object
    const newUser = {
      name: fullName,
      email: lowerEmail,
      phone: phoneNumber,
      password: password,
      role: "user",
      balance: 1000, // Give them ₦1,000 welcome bonus!
      accountNumber: generatedAccountNo,
      bankName: "Wema Bank (SurePlug Auto)",
      referredBy: referrer || null,
      referralCount: 0,
      earnings: 0,
      createdAt: new Date().toISOString()
    };

    // Save user to registered users
    registeredUsers.push(newUser);
    localStorage.setItem("datasub_registered_users", JSON.stringify(registeredUsers));

    // Also update current active session
    const activeUser = {
      email: lowerEmail,
      role: "user",
      name: fullName
    };
    localStorage.setItem("datasub_user", JSON.stringify(activeUser));
    
    // Initialize their wallet balance in localStorage
    localStorage.setItem("datasub_balance", "1000"); // 1000 NGN balance starts

    // Save user specific account number for funding
    localStorage.setItem(`datasub_acc_${lowerEmail}`, generatedAccountNo);

    // Handle Referral Commission (If referred by someone, track it)
    if (referrer) {
      // Find referrer in registered users and increment referral stats
      const referrerEmail = referrer.toLowerCase().trim();
      const updatedUsers = registeredUsers.map((u: any) => {
        if (u.email === referrerEmail) {
          return {
            ...u,
            referralCount: (u.referralCount || 0) + 1,
            // Add a pending ₦200 commission or just increment count
          };
        }
        return u;
      });
      localStorage.setItem("datasub_registered_users", JSON.stringify(updatedUsers));
    }

    setSuccess("Account created successfully! Redirecting to dashboard...");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 border border-slate-200 shadow-md my-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sign Up</h1>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              Create an account to start buying high-speed data subscriptions.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white text-sm shrink-0">
            SP
          </div>
        </div>

        {referrer && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2.5 text-[11px] font-bold text-emerald-800 uppercase tracking-tight">
            <Gift className="text-emerald-600 shrink-0 animate-bounce" size={16} />
            <span>Referred by {referrer}! You will get a ₦1,000 welcome bonus.</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-[11px] font-bold text-red-600 uppercase tracking-tight">
            <AlertCircle className="shrink-0" size={15} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 flex items-center gap-2 text-[11px] font-bold text-green-700 uppercase tracking-tight">
            <CheckCircle className="shrink-0" size={15} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
            <User className="mr-3 text-slate-400 shrink-0" size={16} />
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              required
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
            <Mail className="mr-3 text-slate-400 shrink-0" size={16} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              required
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
            <Phone className="mr-3 text-slate-400 shrink-0" size={16} />
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              required
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
            <Lock className="mr-3 text-slate-400 shrink-0" size={16} />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              required
            />
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
            <Lock className="mr-3 text-slate-400 shrink-0" size={16} />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 flex justify-between text-[11px] font-bold uppercase tracking-wider text-blue-600">
          <Link href="/login" className="hover:underline">Already have an account?</Link>
          <Link href="/login" className="hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
