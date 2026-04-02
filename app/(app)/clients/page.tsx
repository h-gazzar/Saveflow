import { Avatar } from "~/components/ui/Avatar";
import { ClientActions } from "~/components/ui/ClientActions";
import { DataTable } from "~/components/ui/DataTable";
import { PageHeader } from "~/components/ui/PageHeader";
import { UpgradePrompt } from "~/components/ui/UpgradePrompt";
import { requireUser } from "~/lib/auth";
import { getPlanLimit, normalizePlan } from "~/lib/planGates";
import { prisma } from "~/lib/prisma";
import { formatCurrency } from "~/lib/utils";

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { projects: true } },
      invoices: true
    },
    orderBy: { createdAt: "desc" }
  });

  const plan = normalizePlan(user.plan);
  const limit = getPlanLimit(plan, "clients");

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Keep every client relationship clear, searchable, and tied back to payment history."
        action={<ClientActions currentCount={clients.length} />}
      />
      {plan === "free" && clients.length >= limit ? <div className="mb-6"><UpgradePrompt title="Client limit reached" description="Free users can manage up to 3 clients. Upgrade to Pro for unlimited client records." /></div> : null}
      <DataTable
        headers={["Client", "Email", "Company", "Projects", "Total paid"]}
        rows={clients.map((client: (typeof clients)[number]) => [
          <div key={client.id} className="flex items-center gap-3">
            <Avatar name={client.name} />
            <span>{client.name}</span>
          </div>,
          client.email,
          client.company ?? "Independent",
          String(client._count.projects),
          formatCurrency(
            client.invoices
              .filter((invoice: (typeof client.invoices)[number]) => invoice.status.toLowerCase() === "paid")
              .reduce((sum: number, invoice: (typeof client.invoices)[number]) => sum + invoice.amount, 0)
          )
        ])}
      />
    </div>
  );
}
