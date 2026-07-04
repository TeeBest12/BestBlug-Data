import Link from "next/link";
import { ArrowLeft, Bell, CheckCircle, CreditCard, Database } from "lucide-react";

const notifications = [
  {
    title: "Data purchase successful",
    message: "Your MTN 15GB data bundle has been activated.",
    time: "5 minutes ago",
    icon: Database,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Wallet funded",
    message: "₦10,000 has been added to your wallet balance.",
    time: "Yesterday",
    icon: CreditCard,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Account verified",
    message: "Your account profile has been verified successfully.",
    time: "2 days ago",
    icon: CheckCircle,
    color: "bg-blue-100 text-blue-600",
  },
];

export default function NotificationsPage() {
  const colorMap: Record<string, string> = {
    "bg-orange-100 text-orange-600": "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
    "bg-green-100 text-green-600": "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400",
    "bg-blue-100 text-blue-600": "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Bell size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Recent account and transaction updates.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              const finalColor = colorMap[notification.color] || notification.color;

              return (
                <div
                  key={notification.title}
                  className="flex gap-4 rounded-2xl border border-gray-150 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/10"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${finalColor}`}
                  >
                    <Icon size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                      {notification.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}