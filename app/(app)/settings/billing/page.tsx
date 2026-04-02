import { Badge } from "~/components/ui/Badge";
import { BillingActions } from "~/components/ui/BillingActions";
import { PageHeader } from "~/components/ui/PageHeader";
import { PlanCard } from "~/components/ui/PlanCard";
import { requireUser } from "~/lib/auth";
import { LIMITS, normalizePlan } from "~/lib/planGates";
import { prisma } from "~/lib/prisma";

export default async function BillingPage() {
  const user = await requireUser();
  const [clients, projects, invoices] = await Promise.all([
    prisma.client.count({ where: { userId: user.id } }),
    prisma.project.count({ where: { userId: user.id } }),
    prisma.invoice.count({ where: { userId: user.id } })
  ]);

  const plan = normalizePlan(user.plan);
  const limits = LIMITS[plan];

  return (
    <div>
      <PageHeader
        title="Billing"
        description="See your current plan, usage against limits, and upgrade paths for more capacity."
        action={<BillingActions plan={plan} />}
      />
      <div className="surface-card mb-8 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="font-sans text-2xl font-extrabold uppercase">Current plan</h2>
          <Badge label={plan} tone={plan === "free" ? "neutral" : "paid"} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="surface-card p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Clients used</p>
            <p className="mt-3 font-sans text-3xl font-extrabold uppercase">{clients} / {Number.isFinite(limits.clients) ? limits.clients : "∞"}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Projects used</p>
            <p className="mt-3 font-sans text-3xl font-extrabold uppercase">{projects} / {Number.isFinite(limits.projects) ? limits.projects : "∞"}</p>
          </div>
          <div className="surface-card p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Invoices used</p>
            <p className="mt-3 font-sans text-3xl font-extrabold uppercase">{invoices} / {Number.isFinite(limits.invoices) ? limits.invoices : "∞"}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <PlanCard
          name="Free"
          price="$0"
          compact
          features={[
            { label: "3 clients", included: true },
            { label: "5 projects", included: true },
            { label: "5 invoices", included: true },
            { label: "Leads", included: false },
            { label: "Time tracking", included: false }
          ]}
        />
        <PlanCard
          name="Pro"
          price="$8"
          popular={plan === "pro"}
          compact
          features={[
            { label: "Unlimited clients", included: true },
            { label: "Unlimited projects", included: true },
            { label: "Unlimited invoices", included: true },
            { label: "Leads", included: true },
            { label: "Time tracking", included: true }
          ]}
        />
        <PlanCard
          name="Agency"
          price="$20"
          popular={plan === "agency"}
          compact
          features={[
            { label: "Everything in Pro", included: true },
            { label: "PDF invoices", included: true },
            { label: "Custom branding", included: false },
            { label: "Team members", included: false },
            { label: "API access", included: false }
          ]}
        />
      </div>
      <p className="mt-6 text-sm text-muted">
        Cancellation flow should confirm before proceeding.
        {" "}
        {/* TODO: phase 2 richer subscription lifecycle UI */}
      </p>
    </div>
  );
}
