import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Database,
  Headphones,
  History,
  Phone,
  Settings,
  Tv,
  User,
  Wallet,
  Zap,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/dashboard", icon: Wallet },
  { title: "Buy Data", href: "/dashboard/buy-data", icon: Database },
  { title: "Buy Airtime", href: "/dashboard/buy-airtime", icon: Phone },
  { title: "Fund Wallet", href: "/dashboard/fund-wallet", icon: CreditCard },
  { title: "Cable TV", href: "/dashboard/cable-tv", icon: Tv },
  { title: "Electricity", href: "/dashboard/electricity", icon: Zap },
  { title: "Transactions", href: "/dashboard/transactions", icon: History },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Support", href: "/dashboard/support", icon: Headphones },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardMenuPage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] px-5 py-6 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="rounded-[28px] bg-white dark:bg-[#111827] p-6 shadow-sm border border-transparent dark:border-slate-800/80 transition-colors duration-200">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Choose where you want to go.
          </p>

          <div className="mt-6 grid gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/20 px-4 py-4 font-medium text-gray-800 dark:text-slate-200 hover:border-orange-500 hover:text-orange-600 dark:hover:border-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
                >
                  <Icon size={20} className="text-gray-500 dark:text-slate-400 shrink-0" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}