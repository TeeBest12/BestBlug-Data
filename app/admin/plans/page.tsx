"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Database,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

const INITIAL_PLANS = [
  {
    id: 1,
    network: "MTN",
    plan: "1GB",
    price: "₦350",
    validity: "1 Day",
    status: "Active",
  },
  {
    id: 2,
    network: "MTN",
    plan: "15GB",
    price: "₦2,500",
    validity: "30 Days",
    status: "Active",
  },
  {
    id: 3,
    network: "Airtel",
    plan: "5GB",
    price: "₦1,500",
    validity: "30 Days",
    status: "Active",
  },
  {
    id: 4,
    network: "Glo",
    plan: "10GB",
    price: "₦2,000",
    validity: "30 Days",
    status: "Disabled",
  },
];

export default function PlansPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("datasub_plans");
    if (saved) {
      try {
        setPlans(JSON.parse(saved));
      } catch (e) {
        setPlans(INITIAL_PLANS);
        localStorage.setItem("datasub_plans", JSON.stringify(INITIAL_PLANS));
      }
    } else {
      setPlans(INITIAL_PLANS);
      localStorage.setItem("datasub_plans", JSON.stringify(INITIAL_PLANS));
    }
  }, []);

  const parsePlanToMB = (planStr: string): number => {
    if (!planStr) return 0;
    const cleaned = planStr.toUpperCase().replace(/\s+/g, "");
    
    // Try matching GB
    const gbMatch = cleaned.match(/^([\d.]+)(GB|G)/);
    if (gbMatch) {
      return parseFloat(gbMatch[1]) * 1024;
    }
    
    // Try matching MB
    const mbMatch = cleaned.match(/^([\d.]+)(MB|M)/);
    if (mbMatch) {
      return parseFloat(mbMatch[1]);
    }

    // Try matching KB
    const kbMatch = cleaned.match(/^([\d.]+)(KB|K)/);
    if (kbMatch) {
      return parseFloat(kbMatch[1]) / 1024;
    }

    // Fallback
    const fallback = parseFloat(cleaned);
    return isNaN(fallback) ? 0 : fallback;
  };

  const sortedPlans = [...plans].sort((a, b) => {
    const sizeA = parsePlanToMB(a.plan);
    const sizeB = parsePlanToMB(b.plan);
    if (sizeA !== sizeB) {
      return sizeA - sizeB;
    }
    // Secondary sort: alphabetical by Network
    const netA = (a.network || "").toLowerCase();
    const netB = (b.network || "").toLowerCase();
    return netA.localeCompare(netB);
  });

  const savePlans = (newPlans: any[]) => {
    setPlans(newPlans);
    localStorage.setItem("datasub_plans", JSON.stringify(newPlans));
  };

  const [form, setForm] = useState({
    network: "MTN",
    plan: "",
    price: "",
    validity: "",
    status: "Active",
  });

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();

    const newPlan = {
      id: Date.now(),
      ...form,
    };

    savePlans([...plans, newPlan]);

    setForm({
      network: "MTN",
      plan: "",
      price: "",
      validity: "",
      status: "Active",
    });

    setShowModal(false);
  };

  const handleEditPlan = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = plans.map((plan) =>
      plan.id === editingPlan.id ? editingPlan : plan
    );
    savePlans(updated);

    setEditingPlan(null);
  };

  const deletePlan = (id: any) => {
    const updated = plans.filter((plan) => plan.id !== id);
    savePlans(updated);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-5 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin"
            className="mb-3 inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold">
            Data Plans Management
          </h1>

          <p className="text-gray-500">
            Create, edit and manage all data plans.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-white"
        >
          <Plus size={18} />
          Add Plan
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Database className="text-purple-600" />

          <div>
            <p className="text-sm text-gray-500">
              Total Plans
            </p>

            <h2 className="text-2xl font-bold">
              {plans.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr className="text-left text-slate-900 font-extrabold">
              <th className="px-6 py-4 font-black">Network</th>
              <th className="px-6 py-4 font-black">Plan</th>
              <th className="px-6 py-4 font-black">Price</th>
              <th className="px-6 py-4 font-black">Validity</th>
              <th className="px-6 py-4 font-black">Status</th>
              <th className="px-6 py-4 font-black">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedPlans.map((plan) => (
              <tr
                key={plan.id}
                className="border-b hover:bg-gray-50 text-slate-950 font-bold"
              >
                <td className="px-6 py-4 font-extrabold text-slate-900">
                  {plan.network}
                </td>

                <td className="px-6 py-4 font-black text-slate-950">
                  {plan.plan}
                </td>

                <td className="px-6 py-4 font-black text-blue-700">
                  {plan.price}
                </td>

                <td className="px-6 py-4 font-extrabold text-slate-700">
                  {plan.validity}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-black ${
                      plan.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {plans.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No data plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Add New Data Plan
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <form
              onSubmit={handleAddPlan}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Network Provider</label>
                <select
                  value={form.network}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      network: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3 bg-white"
                  required
                >
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Glo">Glo</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Data Plan (e.g. 5GB)</label>
                <input
                  type="text"
                  placeholder="Plan"
                  value={form.plan}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      plan: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Price (e.g. ₦1,500)</label>
                <input
                  type="text"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Validity (e.g. 30 Days)</label>
                <input
                  type="text"
                  placeholder="Validity"
                  value={form.validity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      validity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Plan Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3 bg-white"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gray-900 py-3 text-white font-bold"
              >
                Save Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Edit Data Plan
              </h2>

              <button onClick={() => setEditingPlan(null)}>
                <X />
              </button>
            </div>

            <form
              onSubmit={handleEditPlan}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Network Provider</label>
                <select
                  value={editingPlan.network}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      network: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3 bg-white"
                  required
                >
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Glo">Glo</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Data Plan</label>
                <input
                  type="text"
                  value={editingPlan.plan}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      plan: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Price</label>
                <input
                  type="text"
                  value={editingPlan.price}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      price: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Validity</label>
                <input
                  type="text"
                  value={editingPlan.validity}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      validity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Plan Status</label>
                <select
                  value={editingPlan.status || "Active"}
                  onChange={(e) =>
                    setEditingPlan({
                      ...editingPlan,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-3 bg-white"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gray-900 py-3 text-white font-bold"
              >
                Update Plan
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}