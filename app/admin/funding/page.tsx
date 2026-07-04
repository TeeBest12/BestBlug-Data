"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Wallet } from "lucide-react";

const fundingRequests = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    amount: "₦5,000",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: 2,
    name: "Mary James",
    email: "mary@example.com",
    amount: "₦10,000",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    id: 3,
    name: "Peter Smith",
    email: "peter@example.com",
    amount: "₦2,500",
    method: "Bank Transfer",
    status: "Approved",
  },
];

export default function FundingPage() {
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
            Wallet Funding Requests
          </h1>
          <p className="text-gray-500">
            Approve or reject wallet funding requests.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Wallet className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500">
                Total Requests
              </p>
              <h2 className="text-xl font-bold">
                {fundingRequests.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fundingRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  {request.name}
                </td>
                <td className="px-6 py-4">
                  {request.email}
                </td>
                <td className="px-6 py-4">
                  {request.amount}
                </td>
                <td className="px-6 py-4">
                  {request.method}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      request.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200">
                      <CheckCircle size={18} />
                    </button>

                    <button className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200">
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}