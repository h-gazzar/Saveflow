"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircleDollarSign, LayoutDashboard, PiggyBank, Settings, Wallet } from "lucide-react";

import { cn } from "~/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: PiggyBank },
  { href: "/transactions", label: "Transactions", icon: Wallet },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[220px] flex-col border-r border-border bg-[#0d0d0d] px-5 py-6 lg:flex">
      <Link href="/" className="font-sans text-2xl font-extrabold uppercase tracking-[0.18em]">
        save<span className="text-accent">flow</span>
      </Link>
      <p className="mt-3 text-sm leading-6 text-muted">Track spending, build momentum, and reach your next savings target with less friction.</p>
      <nav className="mt-10 space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-sm border-r-2 border-transparent px-3 py-3 text-sm text-muted transition hover:bg-white/[0.03] hover:text-off-white",
                active && "border-accent bg-white/[0.03] text-off-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto surface-card p-4">
        <div className="flex items-center gap-2 text-accent">
          <CircleDollarSign className="h-4 w-4" />
          <span className="font-sans text-xs font-bold uppercase tracking-[0.18em]">Focused saving</span>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted">One place for goals, cash flow, and a calmer view of where your money is going.</p>
      </div>
    </aside>
  );
}
