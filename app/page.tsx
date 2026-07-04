import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900 tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">BB</span>
            BestBlug Pro
          </Link>

          <div className="flex items-center gap-5 text-xs uppercase tracking-wider font-bold text-slate-600">
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded bg-blue-600 px-4 py-2 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-block rounded bg-blue-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-blue-800 mb-4">
          Fast Data Subscriptions
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight max-w-3xl">
          Buy affordable mobile data plans & airtime instantly
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
          Subscribe to simple, high-speed, reliable data plans from major telecom networks and manage all your transactions from a single dashboard.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/signup"
            className="rounded bg-blue-600 px-6 py-3 text-xs uppercase tracking-wider font-extrabold text-white shadow hover:bg-blue-700 transition-all"
          >
            Get Started
          </Link>

          <Link
            href="/pricing"
            className="rounded border border-slate-300 bg-white px-6 py-3 text-xs uppercase tracking-wider font-extrabold text-slate-700 hover:bg-slate-50 transition-all"
          >
            View Plans
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between px-6 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          <div>Site ID: DS-004192-NG</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </main>
  );
}