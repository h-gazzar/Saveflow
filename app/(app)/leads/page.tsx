import { LeadBoard } from "~/components/ui/LeadBoard";
import { PageHeader } from "~/components/ui/PageHeader";
import { UpgradePrompt } from "~/components/ui/UpgradePrompt";
import { requireUser } from "~/lib/auth";
import { canUseFeature } from "~/lib/planGates";
import { prisma } from "~/lib/prisma";

export default async function LeadsPage() {
  const user = await requireUser();

  if (!canUseFeature(user.plan, "leads")) {
    return (
      <div>
        <PageHeader title="Leads" description="Lead pipeline is available on Pro and Agency plans." />
        <UpgradePrompt title="Unlock lead pipeline" description="Move opportunities through Lead, Contacted, Negotiation, Won, and Lost with drag-and-drop updates." />
      </div>
    );
  }

  const leads = await prisma.lead.findMany({
    where: { userId: user.id },
    orderBy: [{ stage: "asc" }, { order: "asc" }]
  });

  return (
    <div>
      <PageHeader title="Leads" description="Track new opportunities visually and keep your pipeline moving toward close." />
      <LeadBoard leads={leads} />
    </div>
  );
}
