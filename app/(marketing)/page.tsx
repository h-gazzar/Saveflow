import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  FileText,
  Waypoints,
  Users
} from "lucide-react";

import { Badge } from "~/components/ui/Badge";
import { NavBlur } from "~/components/ui/NavBlur";
import { PlanCard } from "~/components/ui/PlanCard";

const featureCards = [
  { icon: Users, title: "Client management", description: "Keep every contact, note, and company relationship organized in one focused workspace.", tags: ["CRM", "Notes"] },
  { icon: BriefcaseBusiness, title: "Project tracking", description: "Monitor deadlines, statuses, and payment readiness without switching tools.", tags: ["Delivery", "Status"] },
  { icon: FileText, title: "Invoice generator", description: "Create polished invoices with auto-numbering and better follow-through on unpaid work.", tags: ["Billing", "Finance"] },
  { icon: Waypoints, title: "Lead pipeline", description: "Watch your pipeline evolve from first contact through negotiation to closed deals.", tags: ["Pipeline", "Pro"] },
  { icon: Clock3, title: "Time tracking", description: "Capture billable hours fast and turn effort into clear earnings visibility.", tags: ["Hours", "Pro"] },
  { icon: BarChart3, title: "Revenue dashboard", description: "See performance trends, unpaid totals, and the momentum of your freelance business.", tags: ["Metrics", "Growth"] }
];

const testimonials = [
  ["Soloflow gave me back the mental bandwidth I used to spend juggling spreadsheets and DMs.", "NA", "Nadia Ahmed", "Brand designer"],
  ["The invoice and project views feel built for the way freelancers actually work, not teams of fifty.", "JR", "Julian Ross", "Webflow developer"],
  ["I finally have a pipeline view that doesn’t feel bloated. It’s focused, fast, and easy to trust.", "MS", "Mina Saleh", "Product strategist"]
];

const pricingFeatures = {
  free: [
    { label: "Up to 3 clients", included: true },
    { label: "Up to 5 projects", included: true },
    { label: "Up to 5 invoices", included: true },
    { label: "Lead pipeline", included: false },
    { label: "Time tracking", included: false }
  ],
  pro: [
    { label: "Unlimited clients", included: true },
    { label: "Unlimited projects", included: true },
    { label: "Unlimited invoices", included: true },
    { label: "Lead pipeline", included: true },
    { label: "Time tracking", included: true }
  ],
  agency: [
    { label: "Everything in Pro", included: true },
    { label: "PDF invoices", included: true },
    { label: "Best for multiple brands", included: true },
    { label: "Team members", included: false },
    { label: "Custom branding", included: false }
  ]
};

export default function MarketingPage() {
  return (
    <main>
      <NavBlur>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-sans text-2xl font-extrabold uppercase tracking-[0.18em]">
            solo<span className="text-accent">flow</span>
          </Link>
          <div className="hidden items-center gap-8 font-sans text-sm font-bold uppercase tracking-[0.15em] text-muted md:flex">
            <a href="#features">Features</a>
            <a href="#preview">Dashboard</a>
            <a href="#pricing">Pricing</a>
            <a href="#reviews">Reviews</a>
          </div>
          <Link href="/signup" className="btn-primary">
            Start free
          </Link>
        </nav>
      </NavBlur>

      <section className="hero-grid relative overflow-hidden px-6 pb-20 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-16 bg-accent" />
            Freelancer CRM SaaS
          </div>
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <h1 className="max-w-5xl font-sans text-[clamp(3.8rem,9vw,8.8rem)] font-extrabold uppercase leading-[0.88]">
                Run your freelance business with more <span className="font-serif italic normal-case text-accent">clarity</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-8 text-muted">
                Soloflow gives freelancers one disciplined workspace for clients, projects, invoices, leads, and billable time without the clutter of a heavyweight CRM.
              </p>
            </div>
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-4 lg:ml-auto lg:max-w-sm">
                <Link href="/signup" className="btn-primary w-full">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#pricing" className="btn-ghost w-full">
                  View pricing
                </Link>
              </div>
              <div className="self-center text-xs uppercase tracking-[0.25em] text-muted">Scroll to explore</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white/[0.02] px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Used by freelancers at</p>
          <div className="grid grid-cols-2 gap-4 text-sm uppercase tracking-[0.25em] text-muted md:grid-cols-5">
            <span>Framer</span>
            <span>Webflow</span>
            <span>Upwork</span>
            <span>Behance</span>
            <span>Dribbble</span>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>01</span>
          <h2>Core Features</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => (
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
            <div className="rounded-full border border-border px-4 py-2">app.soloflow.co/dashboard</div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
            <aside className="border-r border-border bg-[#0d0d0d] p-5">
              <div className="font-sans text-xl font-extrabold uppercase">solo<span className="text-accent">flow</span></div>
              <div className="mt-8 space-y-3 text-sm text-muted">
                <div className="rounded-sm border-r-2 border-accent bg-white/[0.03] px-3 py-3 text-off-white">Dashboard</div>
                <div className="px-3 py-3">Clients</div>
                <div className="px-3 py-3">Projects</div>
                <div className="px-3 py-3">Invoices</div>
              </div>
            </aside>
            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Revenue", "$12.4K"],
                  ["Projects", "08"],
                  ["Unpaid", "$1.8K"],
                  ["Leads", "17"]
                ].map(([label, value]) => (
                  <div key={label} className="surface-card p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
                    <div className="mt-3 font-sans text-3xl font-extrabold uppercase">{value}</div>
                    <p className="mt-2 text-sm text-accent">+18% this month</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="surface-card p-5">
                  <p className="mb-4 font-sans text-lg font-extrabold uppercase">Recent projects</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span>Nova landing page</span><Badge label="Active" /></div>
                    <div className="flex items-center justify-between"><span>Pulse redesign</span><Badge label="Proposal" /></div>
                    <div className="flex items-center justify-between"><span>Aster portal</span><Badge label="Done" /></div>
                  </div>
                </div>
                <div className="surface-card p-5">
                  <p className="mb-4 font-sans text-lg font-extrabold uppercase">Recent invoices</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span>#0027</span><Badge label="Paid" /></div>
                    <div className="flex items-center justify-between"><span>#0028</span><Badge label="Unpaid" /></div>
                    <div className="flex items-center justify-between"><span>#0029</span><Badge label="Paid" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>03</span>
          <h2>Lead Pipeline</h2>
        </div>
        <div className="reveal mt-12 grid gap-4 lg:grid-cols-5">
          {["Lead", "Contacted", "Negotiation", "Won", "Lost"].map((stage) => (
            <div key={stage} className="surface-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-sans text-sm font-extrabold uppercase">{stage}</p>
                <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">3</span>
              </div>
              <div className="space-y-3">
                <div className={`rounded-sm border p-3 ${stage === "Negotiation" ? "border-accent/30 bg-tag/30" : "border-border"}`}>
                  <p className="font-sans text-sm font-bold uppercase">Maya Chen</p>
                  <p className="mt-1 text-xs text-muted">Northwind Studio</p>
                  <p className="mt-3 text-sm text-off-white">$2,400</p>
                </div>
                <div className="rounded-sm border border-border p-3">
                  <p className="font-sans text-sm font-bold uppercase">Omar Nabil</p>
                  <p className="mt-1 text-xs text-muted">Luma Labs</p>
                  <p className="mt-3 text-sm text-off-white">$1,250</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>04</span>
          <h2>Pricing</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <PlanCard name="Free" price="$0" features={pricingFeatures.free} footer={<Link href="/signup" className="btn-ghost w-full">Get started</Link>} />
          <PlanCard name="Pro" price="$8" features={pricingFeatures.pro} popular footer={<Link href="/signup" className="btn-primary w-full">Start Pro</Link>} />
          <PlanCard name="Agency" price="$20" features={pricingFeatures.agency} footer={<Link href="/signup" className="btn-ghost w-full">Choose Agency</Link>} />
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-7xl px-6 py-24">
        <div className="section-header reveal">
          <span>05</span>
          <h2>Testimonials</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map(([quote, initials, name, role]) => (
            <div key={name} className="surface-card reveal p-6">
              <p className="font-serif text-2xl italic leading-9 text-off-white">“{quote}”</p>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] font-sans text-sm font-extrabold uppercase text-accent">
                  {initials}
                </div>
                <div>
                  <p className="font-sans text-sm font-extrabold uppercase">{name}</p>
                  <p className="text-sm text-muted">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="surface-card mx-auto max-w-5xl p-10 text-center md:p-16">
          <h2 className="font-sans text-[clamp(2.6rem,6vw,5.2rem)] font-extrabold uppercase leading-[0.92]">
            Freelance operations <span className="font-serif italic normal-case text-accent">without</span> the drag
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-muted">
            Start free, grow into Pro when your pipeline needs it, and keep every moving part of your business inside one sharp system.
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
            solo<span className="text-accent">flow</span>
          </Link>
          <div className="flex gap-6 uppercase tracking-[0.18em]">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#reviews">Reviews</a>
          </div>
          <p>© 2026 Soloflow</p>
        </div>
      </footer>
    </main>
  );
}
