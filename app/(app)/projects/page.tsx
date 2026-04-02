import Link from "next/link";

import { Badge } from "~/components/ui/Badge";
import { DataTable } from "~/components/ui/DataTable";
import { PageHeader } from "~/components/ui/PageHeader";
import { ProjectActions } from "~/components/ui/ProjectActions";
import { UpgradePrompt } from "~/components/ui/UpgradePrompt";
import { requireUser } from "~/lib/auth";
import { getPlanLimit, normalizePlan } from "~/lib/planGates";
import { prisma } from "~/lib/prisma";
import { formatDate } from "~/lib/utils";

export default async function ProjectsPage() {
  const user = await requireUser();
  const [projects, clients] = await Promise.all([
    prisma.project.findMany({ where: { userId: user.id }, include: { client: true }, orderBy: { createdAt: "desc" } }),
    prisma.client.findMany({ where: { userId: user.id }, select: { id: true, name: true } })
  ]);
  const plan = normalizePlan(user.plan);
  const limit = getPlanLimit(plan, "projects");

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Track delivery status, deadlines, and payment readiness across active client work."
        action={<ProjectActions clients={clients} />}
      />
      {plan === "free" && projects.length >= limit ? <div className="mb-6"><UpgradePrompt title="Project limit reached" description="Free users can manage up to 5 projects. Upgrade to keep growing without friction." /></div> : null}
      <DataTable
        headers={["Project", "Client", "Status", "Deadline", "Payment"]}
        rows={projects.map((project: (typeof projects)[number]) => [
          project.name,
          <Link key={project.id} href="/clients" className="text-accent">{project.client.name}</Link>,
          <Badge key={`${project.id}-status`} label={project.status} />,
          formatDate(project.deadline),
          <Badge key={`${project.id}-payment`} label={project.paymentStatus} />
        ])}
      />
    </div>
  );
}
