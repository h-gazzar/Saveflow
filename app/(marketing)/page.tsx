import Link from "next/link";
import { ArrowRight, BarChart3, CircleDollarSign, PiggyBank, Wallet } from "lucide-react";

import { NavBlur } from "~/components/ui/NavBlur";

const features = [
  {
    icon: PiggyBank,
    title: "Savings goals",
    description: "Create focused savings goals with progress tracking, remaining amount, and weekly guidance.",
    tags: ["Goals", "Progress"]
  },
  {
    icon: Wallet,
    title: "Simple cash flow",
    description: "Log income and expenses fast without falling into complicated budgeting workflows.",
    tags: ["Income", "Expenses"]
  },
  {
    icon: BarChart3,
    title: "Lightweight reports",
    description: "See monthly spending, category breakdowns, and income versus expenses at a glance.",
    tags: ["Reports", "Charts"]
  },
  {
    icon: CircleDollarSign,
    title: "Fintech clarity",
    description: "Keep a clean view of your balance and where your money is moving each month.",
    tags: ["Balance", "Focus"]
  }
];

export default function MarketingPage() {
  return (
    <main>
      <NavBlur>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-sans text-2xl font-extrabold uppercase tracking-[0.18em]">
            save<span className="text-accent">flow</span>
          </Link>
          <div className="hidden items-center gap-8 font-sans text-sm font-bold uppercase tracking-[0.15em] text-muted md:flex">
            <a href="#features">Features</a>
            <a href="#preview">Preview</a>
            <a href="#reports">Reports</a>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="btn-ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Start free
            </Link>
          </div>
        </nav>
      </NavBlur>

      <section className="hero-grid relative overflow-hidden px-6 pb-20 pt-16">
        <div className="mx-auto w-full">
          <div className="mb-8 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.25em] text-accent/90">
            <span className="h-px w-16 bg-accent" />
            Modern savings tracker
          </div>
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative z-10">
              <h1 className="mx-auto w-full max-w-none font-sans text-[clamp(3.8rem,9vw,8.3rem)] font-extrabold uppercase leading-[0.88] text-off-white">
                Save with more <span className="font-serif italic normal-case text-accent">clarity</span>, spend with less noise
              </h1>
              <p className="mx-auto mt-8 w-full max-w-none text-base leading-8 text-off-white/72">
                SaveFlow helps you track income, expenses, and savings goals in one clean workspace built for people who want momentum without heavy budgeting overhead.
              </p>
              <div className="mx-auto mt-8 w-full max-w-sm space-y-4">
                <Link href="/signup" className="btn-primary w-full">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="btn-ghost w-full">
                  Log in
                </Link>
              </div>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted">Scroll to explore</div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>01</span>
          <h2>Core Features</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div key={feature.title} className="surface-card reveal p-6" style={{ transitionDelay: `${index * 70}ms` }}>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-sm bg-tag">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-sans text-2xl font-extrabold uppercase">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{feature.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-tag px-3 py-1 text-xs uppercase tracking-[0.16em] text-tag-color">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="preview" className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>02</span>
          <h2>Dashboard Preview</h2>
        </div>
        <div className="surface-card reveal mt-12 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
            </div>
            <div className="rounded-full border border-border px-4 py-2">app.saveflow.co/dashboard</div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
            <aside className="border-r border-border bg-[#141510] p-5">
              <div className="font-sans text-xl font-extrabold uppercase">save<span className="text-accent">flow</span></div>
              <div className="mt-8 space-y-3 text-sm text-muted">
                <div className="rounded-sm border-r-2 border-accent bg-white/[0.03] px-3 py-3 text-off-white">Dashboard</div>
                <div className="px-3 py-3">Goals</div>
                <div className="px-3 py-3">Transactions</div>
                <div className="px-3 py-3">Reports</div>
              </div>
            </aside>
            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Balance", "$5.4K"],
                  ["Income", "$3.8K"],
                  ["Expenses", "$1.9K"]
                ].map(([label, value]) => (
                  <div key={label} className="surface-card p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
                    <div className="mt-3 font-sans text-3xl font-extrabold uppercase">{value}</div>
                    <p className="mt-2 text-sm text-accent">Updated this month</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="surface-card p-5">
                  <p className="mb-4 font-sans text-lg font-extrabold uppercase">Active goals</p>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex items-center justify-between"><span>Emergency fund</span><span>72%</span></div>
                      <div className="mt-2 h-2 rounded-full bg-white/[0.05]"><div className="h-2 w-[72%] rounded-full bg-accent" /></div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between"><span>New laptop</span><span>45%</span></div>
                      <div className="mt-2 h-2 rounded-full bg-white/[0.05]"><div className="h-2 w-[45%] rounded-full bg-accent" /></div>
                    </div>
                  </div>
                </div>
                <div className="surface-card p-5">
                  <p className="mb-4 font-sans text-lg font-extrabold uppercase">Recent activity</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span>Salary</span><span>$2,400</span></div>
                    <div className="flex items-center justify-between"><span>Groceries</span><span>$120</span></div>
                    <div className="flex items-center justify-between"><span>Goal transfer</span><span>$300</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reports" className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>03</span>
          <h2>Built For Focus</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            ["Monthly summaries", "Understand spending trends month by month without building a full budget spreadsheet."],
            ["Category breakdown", "See where money goes most often so decisions feel informed instead of reactive."],
            ["Goal pacing", "Get a clear weekly savings recommendation when a target date matters."]
          ].map(([title, description]) => (
            <div key={title} className="surface-card reveal p-6">
              <h3 className="font-sans text-2xl font-extrabold uppercase">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="surface-card mx-auto max-w-5xl p-10 text-center md:p-16">
          <h2 className="font-sans text-[clamp(2.6rem,6vw,5.2rem)] font-extrabold uppercase leading-[0.92]">
            Money tracking that feels <span className="font-serif italic normal-case text-accent">lighter</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-muted">
            SaveFlow gives you just enough structure to track spending and make real progress on savings goals without the clutter of a full budgeting suite.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="btn-primary">Start free</Link>
            <Link href="/login" className="btn-ghost">Log in</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="font-sans text-2xl font-extrabold uppercase tracking-[0.18em] text-off-white">
            save<span className="text-accent">flow</span>
          </Link>
          <div className="flex gap-6 uppercase tracking-[0.18em]">
            <a href="#features">Features</a>
            <a href="#preview">Preview</a>
            <a href="#reports">Reports</a>
          </div>
          <p>© 2026 SaveFlow</p>
        </div>
      </footer>
    </main>
  );
}
