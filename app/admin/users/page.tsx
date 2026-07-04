"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Users,
  Pencil,
  Trash2,
  Ban,
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    balance: "₦12,500",
    status: "Active",
  },
  {
    id: 2,
    name: "Mary James",
    email: "mary@example.com",
    phone: "08087654321",
    balance: "₦5,000",
    status: "Blocked",
  },
  {
    id: 3,
    name: "Peter Smith",
    email: "peter@example.com",
    phone: "08123456789",
    balance: "₦20,000",
    status: "Active",
  },
  {
    id: 4,
    name: "David Johnson",
    email: "david@example.com",
    phone: "09012345678",
    balance: "₦7,800",
    status: "Active",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

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

          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-gray-500">
            Manage all registered users on your platform.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="text-xl font-bold">{users.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border py-3 pl-12 pr-4 outline-none focus:border-gray-900"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b transition hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.balance}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200">
                      <Ban size={18} />
                    </button>

                    <button className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}