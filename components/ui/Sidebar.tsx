"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Receipt,
  Settings,
  Timer,
  Users,
  Waypoints
} from "lucide-react";

import { cn } from "~/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/leads", label: "Leads", icon: Waypoints },
  { href: "/time", label: "Time", icon: Timer },
  { href: "/settings/billing", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[180px] flex-col border-r border-border bg-[#0d0d0d] px-4 py-6">
      <Link href="/" className="mb-10 font-sans text-2xl font-extrabold uppercase tracking-[0.18em]">
        solo<span className="text-accent">flow</span>
      </Link>
      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between rounded-sm border-r-2 border-transparent px-3 py-3 text-sm text-muted transition hover:bg-white/[0.03] hover:text-off-white",
                active && "border-accent text-off-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto surface-card p-4">
        <div className="mb-2 flex items-center gap-2 text-accent">
          <CreditCard className="h-4 w-4" />
          <span className="font-sans text-xs font-bold uppercase tracking-[0.2em]">Billing</span>
        </div>
        <p className="text-xs leading-6 text-muted">Manage plans, usage limits, and subscriptions in one place.</p>
      </div>
    </aside>
  );
}
