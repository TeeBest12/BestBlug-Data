"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const transactions = [
  {
    id: 1,
    user: "john@example.com",
    service: "MTN 15GB",
    amount: "₦2,500",
    status: "Successful",
    date: "01/07/2026",
  },
  {
    id: 2,
    user: "mary@example.com",
    service: "Wallet Funding",
    amount: "₦10,000",
    status: "Pending",
    date: "01/07/2026",
  },
  {
    id: 3,
    user: "peter@example.com",
    service: "Airtel Airtime",
    amount: "₦1,000",
    status: "Failed",
    date: "30/06/2026",
  },
  {
    id: 4,
    user: "david@example.com",
    service: "Glo 10GB",
    amount: "₦3,000",
    status: "Successful",
    date: "30/06/2026",
  },
];

export default function TransactionsPage() {
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

          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-500">
            View and monitor all platform transactions.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">
                Total Transactions
              </p>
              <h2 className="text-xl font-bold">
                {transactions.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4">{transaction.user}</td>
                <td className="px-6 py-4 font-medium">
                  {transaction.service}
                </td>
                <td className="px-6 py-4">
                  {transaction.amount}
                </td>
                <td className="px-6 py-4">
                  {transaction.date}
                </td>

                <td className="px-6 py-4">
                  {transaction.status === "Successful" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                      <CheckCircle size={14} />
                      Successful
                    </span>
                  )}

                  {transaction.status === "Pending" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-600">
                      <Clock size={14} />
                      Pending
                    </span>
                  )}

                  {transaction.status === "Failed" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                      <XCircle size={14} />
                      Failed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}