"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expiredMsg, setExpiredMsg] = useState(false);

  // Forgotten password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [pinSent, setPinSent] = useState(false);
  const [resetPin, setResetPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    // Check if query contains expired=true
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        setExpiredMsg(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please fill in your email address.");
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

    // Check if it's admin login
    if (lowerEmail === "admin@datasub.com" || lowerEmail === "admin") {
      const adminUser = { email: "admin@datasub.com", role: "admin", name: "System Admin" };
      localStorage.setItem("datasub_user", JSON.stringify(adminUser));
      localStorage.setItem("datasub_last_active", Date.now().toString());
      setSuccess("Welcome System Admin! Redirecting...");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
      return;
    }

    // Check if user is registered in localStorage
    const existingUser = registeredUsers.find((u: any) => u.email === lowerEmail);

    if (existingUser) {
      // Check password
      if (existingUser.password !== password) {
        setError("Incorrect password. Please enter the correct password, or use 'Forgot Password?' to reset it.");
        return;
      }

      // Log in existing user
      const standardUser = { email: lowerEmail, role: "user", name: existingUser.name };
      localStorage.setItem("datasub_user", JSON.stringify(standardUser));
      localStorage.setItem("datasub_last_active", Date.now().toString());
      
      // Load user-specific balance or set current active balance
      localStorage.setItem("datasub_balance", String(existingUser.balance || 25000));
      
      setSuccess(`Welcome back, ${existingUser.name}! Logging in...`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      // If user doesn't exist, we can register them automatically on-the-fly 
      // with a default 25,000 NGN balance to keep the frictionless experience!
      const generatedAccountNo = "99" + Math.floor(10000000 + Math.random() * 90000000).toString();
      const onTheFlyUser = {
        name: lowerEmail.split("@")[0].toUpperCase(),
        email: lowerEmail,
        phone: "+234 812 345 6789",
        password: password || "password",
        role: "user",
        balance: 25000,
        accountNumber: generatedAccountNo,
        bankName: "Wema Bank (SurePlug Auto)",
        referredBy: null,
        referralCount: 0,
        earnings: 0,
        createdAt: new Date().toISOString()
      };

      registeredUsers.push(onTheFlyUser);
      localStorage.setItem("datasub_registered_users", JSON.stringify(registeredUsers));

      const standardUser = { email: lowerEmail, role: "user", name: onTheFlyUser.name };
      localStorage.setItem("datasub_user", JSON.stringify(standardUser));
      localStorage.setItem("datasub_last_active", Date.now().toString());
      localStorage.setItem("datasub_balance", "25000");

      setSuccess("Login successful! Welcome to SurePlug Pro.");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  };

  const handleSendResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    const lowerEmail = forgotEmail.toLowerCase().trim();
    let registeredUsers = [];
    const savedUsers = localStorage.getItem("datasub_registered_users");
    if (savedUsers) {
      try {
        registeredUsers = JSON.parse(savedUsers);
      } catch (e) {}
    }

    const userExists = registeredUsers.some((u: any) => u.email === lowerEmail);

    if (!userExists) {
      setError("No registered user account found with this email address.");
      return;
    }

    // Success simulation
    setPinSent(true);
    setSuccess(`A secure reset PIN has been generated for your account! PIN: SURE-8821`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (resetPin !== "SURE-8821") {
      setError("Invalid security reset PIN. Please use SURE-8821.");
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    // Update password in local storage
    const lowerEmail = forgotEmail.toLowerCase().trim();
    let registeredUsers = [];
    const savedUsers = localStorage.getItem("datasub_registered_users");
    if (savedUsers) {
      try {
        registeredUsers = JSON.parse(savedUsers);
      } catch (e) {}
    }

    let updated = false;
    const updatedUsers = registeredUsers.map((u: any) => {
      if (u.email === lowerEmail) {
        updated = true;
        return { ...u, password: newPassword };
      }
      return u;
    });

    if (updated) {
      localStorage.setItem("datasub_registered_users", JSON.stringify(updatedUsers));
      setSuccess("Your password has been reset successfully! You can now log in.");
      setTimeout(() => {
        setShowForgot(false);
        setPinSent(false);
        setForgotEmail("");
        setResetPin("");
        setNewPassword("");
        setConfirmNewPassword("");
        setEmail(lowerEmail);
        setSuccess("");
      }, 2000);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 font-sans text-slate-900">
      <div className="w-full max-w-md rounded-xl bg-white p-6 border border-slate-200 shadow-md">
        
        {/* TOP BRAND HEADER */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {showForgot ? "Forgot Password" : "Login Portal"}
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              {showForgot 
                ? "Retrieve or reset your account access key." 
                : "Log in to manage your high-speed data subscriptions."
              }
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 font-bold text-white text-sm shrink-0">
            SP
          </div>
        </div>

        {/* INACTIVITY EXPIRATION WARNING */}
        {expiredMsg && !showForgot && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 text-[11px] font-bold text-red-600 uppercase tracking-tight flex items-start gap-2.5">
            <AlertCircle className="shrink-0 mt-0.5 text-red-600" size={16} />
            <div>
              <span>Session Expired due to inactivity</span>
              <p className="text-[10px] text-red-500 font-medium lowercase tracking-normal mt-0.5">
                For your account's protection, you were logged out because you were away or idle. Please sign in again.
              </p>
            </div>
          </div>
        )}

        {/* ERROR MESSAGE BAR */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-[11px] font-bold text-red-600 uppercase tracking-tight flex items-center gap-2">
            <AlertCircle className="shrink-0" size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS MESSAGE BAR */}
        {success && (
          <div className="mb-4 rounded-xl bg-green-50 border border-green-200 p-3 text-[11px] font-bold text-green-700 uppercase tracking-tight flex items-start gap-2">
            <CheckCircle className="shrink-0 mt-0.5" size={15} />
            <span>{success}</span>
          </div>
        )}

        {/* STANDARD LOGIN FORM */}
        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
              <Mail className="mr-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              />
            </div>

            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
              <Lock className="mr-3 text-slate-400" size={16} />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
              />
            </div>

            {/* FORGOTTEN PASSWORD TRIGGER LINK */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setError("");
                  setSuccess("");
                }}
                className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              Log In
            </button>
          </form>
        ) : (
          /* FORGOTTEN PASSWORD RECOVERY FORM */
          <div className="space-y-4">
            {!pinSent ? (
              <form onSubmit={handleSendResetPin} className="space-y-4">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                  Enter your email address to receive a secure recovery PIN.
                </p>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
                  <Mail className="mr-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="w-1/3 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs uppercase tracking-wider font-extrabold text-slate-600 transition-colors cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-xl bg-blue-600 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    Get PIN
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-700 font-medium">
                  <KeyRound className="text-blue-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span>Enter PIN <strong className="font-black">SURE-8821</strong> sent to your inbox to reset password.</span>
                  </div>
                </div>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
                  <KeyRound className="mr-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Enter Security PIN (SURE-8821)"
                    value={resetPin}
                    onChange={(e) => setResetPin(e.target.value)}
                    className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent uppercase"
                    required
                  />
                </div>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
                  <Lock className="mr-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
                    required
                  />
                </div>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 shadow-xs focus-within:border-blue-500 transition-colors">
                  <Lock className="mr-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full text-xs text-slate-700 outline-none placeholder-slate-400 font-medium bg-transparent"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPinSent(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="w-1/3 rounded-xl border border-slate-200 hover:bg-slate-50 py-2.5 text-xs uppercase tracking-wider font-extrabold text-slate-600 transition-colors cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-xl bg-blue-600 py-2.5 text-xs uppercase tracking-wider font-extrabold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer text-center"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* BOTTOM OPTION LINKS */}
        <div className="mt-6 flex justify-between text-[11px] font-bold uppercase tracking-wider text-blue-600">
          <Link href="/signup" className="hover:underline">No account yet?</Link>
          <Link href="/signup" className="hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
