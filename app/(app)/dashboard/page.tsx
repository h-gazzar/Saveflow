import { Badge } from "~/components/ui/Badge";
import { DataTable } from "~/components/ui/DataTable";
import { MetricCard } from "~/components/ui/MetricCard";
import { PageHeader } from "~/components/ui/PageHeader";
import { requireUser } from "~/lib/auth";
import { prisma } from "~/lib/prisma";
import { formatCurrency } from "~/lib/utils";

export default async function DashboardPage() {
  const user = await requireUser();

  const [projects, invoices, leads] = await Promise.all([
    prisma.project.findMany({ where: { userId: user.id }, include: { client: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.invoice.findMany({ where: { userId: user.id }, include: { client: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.lead.count({ where: { userId: user.id } })
  ]);

  const totalRevenue = invoices
    .filter((invoice: (typeof invoices)[number]) => invoice.status.toLowerCase() === "paid")
    .reduce((sum: number, invoice: (typeof invoices)[number]) => sum + invoice.amount, 0);
  const unpaidTotal = invoices
    .filter((invoice: (typeof invoices)[number]) => invoice.status.toLowerCase() !== "paid")
    .reduce((sum: number, invoice: (typeof invoices)[number]) => sum + invoice.amount, 0);
  const activeProjects = projects.filter((project: (typeof projects)[number]) => project.status.toLowerCase() === "active").length;

  return (
    <div>
      <PageHeader title="Dashboard" description="A focused overview of revenue, project momentum, and what still needs your attention." />
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Total revenue" value={formatCurrency(totalRevenue)} subtext="+18% this month" />
        <MetricCard label="Active projects" value={String(activeProjects).padStart(2, "0")} subtext="Healthy delivery load" />
        <MetricCard label="Unpaid invoices" value={formatCurrency(unpaidTotal)} subtext="Follow-up recommended" />
        <MetricCard label="Leads in pipeline" value={String(leads).padStart(2, "0")} subtext="Opportunities in motion" />
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <DataTable
          headers={["Project", "Status"]}
          rows={projects.map((project: (typeof projects)[number]) => [project.name, <Badge key={project.id} label={project.status} />])}
        />
        <DataTable
          headers={["Invoice", "Amount", "Status"]}
          rows={invoices.map((invoice: (typeof invoices)[number]) => [invoice.number, formatCurrency(invoice.amount), <Badge key={invoice.id} label={invoice.status} />])}
        />
      </div>
    </div>
  );
}
