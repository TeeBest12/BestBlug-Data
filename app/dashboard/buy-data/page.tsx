"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Smartphone } from "lucide-react";

const NETWORKS = ["MTN", "Airtel", "Glo", "9mobile"];

const DEFAULT_PLANS = [
  { id: 1, network: "MTN", plan: "1GB", price: "₦350", validity: "1 Day", status: "Active" },
  { id: 2, network: "MTN", plan: "15GB", price: "₦2,500", validity: "30 Days", status: "Active" },
  { id: 3, network: "Airtel", plan: "5GB", price: "₦1,500", validity: "30 Days", status: "Active" },
  { id: 4, network: "Glo", plan: "10GB", price: "₦2,000", validity: "30 Days", status: "Disabled" },
  { id: 5, network: "Glo", plan: "3GB", price: "₦1,000", validity: "14 Days", status: "Active" },
  { id: 6, network: "9mobile", plan: "2GB", price: "₦1,000", validity: "14 Days", status: "Active" },
];

export default function BuyDataPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [filteredPlans, setFilteredPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Load plans from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("datasub_plans");
    if (saved) {
      try {
        setPlans(JSON.parse(saved));
      } catch (e) {
        setPlans(DEFAULT_PLANS);
      }
    } else {
      setPlans(DEFAULT_PLANS);
      localStorage.setItem("datasub_plans", JSON.stringify(DEFAULT_PLANS));
    }
  }, []);

  // Filter plans whenever network or plans change
  useEffect(() => {
    if (selectedNetwork) {
      const filtered = plans.filter(
        (p) =>
          p.network.toLowerCase() === selectedNetwork.toLowerCase() &&
          p.status === "Active"
      );
      setFilteredPlans(filtered);
      setSelectedPlan(""); // Reset plan select on network change
    } else {
      setFilteredPlans([]);
      setSelectedPlan("");
    }
  }, [selectedNetwork, plans]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlanObj = filteredPlans.find(
      (p) => `${p.plan} - ${p.price}` === selectedPlan
    );

    const pendingTx = {
      service: "Data Purchase",
      network: selectedNetwork,
      plan: selectedPlanObj ? selectedPlanObj.plan : selectedPlan.split(" - ")[0],
      price: selectedPlanObj ? selectedPlanObj.price : selectedPlan.split(" - ")[1] || "₦0",
      validity: selectedPlanObj ? selectedPlanObj.validity : "30 Days",
      phone: phoneNumber,
    };

    localStorage.setItem("datasub_pending_tx", JSON.stringify(pendingTx));
    router.push("/dashboard/confirm");
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
              <Smartphone size={20} />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Buy Data</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Select a high-speed network and valid data plan.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Network Provider</label>
              <select 
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                name="network"
                className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                required
              >
                <option value="">Select network</option>
                {NETWORKS.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Data Bundle Plan</label>
              <select 
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                name="plan"
                className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!selectedNetwork}
                required
              >
                {!selectedNetwork ? (
                  <option value="">Please select a network first</option>
                ) : filteredPlans.length === 0 ? (
                  <option value="">No active plans found for {selectedNetwork}</option>
                ) : (
                  <>
                    <option value="">Select data plan</option>
                    {filteredPlans.map((plan) => (
                      <option key={plan.id} value={`${plan.plan} - ${plan.price}`}>
                        {plan.plan} - {plan.price} ({plan.validity})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Recipient Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 08033123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                name="phone"
                className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none placeholder-slate-400 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedNetwork || !selectedPlan || !phoneNumber}
            >
              Continue Purchase
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
