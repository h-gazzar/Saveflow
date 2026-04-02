import { PageHeader } from "~/components/ui/PageHeader";
import { TimeTracker } from "~/components/ui/TimeTracker";
import { UpgradePrompt } from "~/components/ui/UpgradePrompt";
import { requireUser } from "~/lib/auth";
import { canUseFeature } from "~/lib/planGates";
import { prisma } from "~/lib/prisma";

export default async function TimePage() {
  const user = await requireUser();

  if (!canUseFeature(user.plan, "time")) {
    return (
      <div>
        <PageHeader title="Time" description="Time tracking is available on Pro and Agency plans." />
        <UpgradePrompt title="Unlock time tracking" description="Log hours by project, compare rates, and see what your effort is earning." />
      </div>
    );
  }

  const [entries, projects] = await Promise.all([
    prisma.timeEntry.findMany({ where: { userId: user.id }, include: { project: true }, orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ where: { userId: user.id }, select: { id: true, name: true } })
  ]);

  return (
    <div>
      <PageHeader title="Time" description="Keep billable time visible and connect hours directly to earnings." />
      <TimeTracker entries={entries} projects={projects} />
    </div>
  );
}
