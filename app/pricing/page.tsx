import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₦1,000",
    data: "5GB",
    validity: "7 Days",
    features: ["Fast activation", "Works on all networks", "Basic support"],
  },
  {
    name: "Standard",
    price: "₦2,500",
    data: "15GB",
    validity: "30 Days",
    features: ["Fast activation", "Works on all networks", "Priority support"],
  },
  {
    name: "Premium",
    price: "₦5,000",
    data: "40GB",
    validity: "30 Days",
    features: ["Fast activation", "Works on all networks", "Premium support"],
  },
];

export default function PricingPage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center px-6 py-10 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.68)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3YxIOmUXwO-OSogGqkYVANuBTrbq3vk_DsFFrxGFIg&s=10')",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          SurePlug
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="hover:text-orange-300">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-4 py-2 text-white"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="mx-auto mt-16 max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">
          Data Plans
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Choose your data subscription
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-200">
          Pick a plan that works for you and continue to your account dashboard.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-[28px] bg-white p-6 text-left text-gray-900 shadow-2xl"
            >
              <h2 className="text-2xl font-bold">{plan.name}</h2>

              <p className="mt-4 text-4xl font-bold text-orange-500">
                {plan.price}
              </p>

              <p className="mt-2 text-gray-500">
                {plan.data} / {plan.validity}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={18} className="text-orange-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-6 block rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 py-3 text-center font-semibold text-white transition hover:opacity-90"
              >
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}