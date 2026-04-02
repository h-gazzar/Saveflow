import { Badge } from "~/components/ui/Badge";
import { DataTable } from "~/components/ui/DataTable";
import { InvoiceActions } from "~/components/ui/InvoiceActions";
import { PageHeader } from "~/components/ui/PageHeader";
import { UpgradePrompt } from "~/components/ui/UpgradePrompt";
import { requireUser } from "~/lib/auth";
import { getPlanLimit, normalizePlan } from "~/lib/planGates";
import { prisma } from "~/lib/prisma";
import { formatCurrency, formatDate } from "~/lib/utils";

export default async function InvoicesPage() {
  const user = await requireUser();
  const [invoices, clients, latest] = await Promise.all([
    prisma.invoice.findMany({ where: { userId: user.id }, include: { client: true }, orderBy: { createdAt: "desc" } }),
    prisma.client.findMany({ where: { userId: user.id }, select: { id: true, name: true } }),
    prisma.invoice.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  ]);
  const last = Number(latest?.number.replace(/\D/g, "") ?? "0");
  const nextNumber = `#${String(last + 1).padStart(4, "0")}`;
  const plan = normalizePlan(user.plan);
  const limit = getPlanLimit(plan, "invoices");

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Create clean invoice records, monitor payment states, and stay ahead of follow-up."
        action={<InvoiceActions clients={clients} nextNumber={nextNumber} />}
      />
      {plan === "free" && invoices.length >= limit ? <div className="mb-6"><UpgradePrompt title="Invoice limit reached" description="Free users can create up to 5 invoices. Upgrade to remove billing limits and keep momentum." /></div> : null}
      <DataTable
        headers={["Number", "Client", "Amount", "Date", "Status"]}
        rows={invoices.map((invoice: (typeof invoices)[number]) => [
          <span key={invoice.id} className="font-mono">{invoice.number}</span>,
          invoice.client.name,
          formatCurrency(invoice.amount),
          formatDate(invoice.date),
          <Badge key={`${invoice.id}-status`} label={invoice.status} />
        ])}
      />
    </div>
  );
}
