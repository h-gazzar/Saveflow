"use client";

import { useRouter } from "next/navigation";

import { Modal } from "~/components/ui/Modal";
import { formatCurrency } from "~/lib/utils";
import { trpc } from "~/lib/trpc/client";

export function TimeTracker({
  projects,
  entries
}: {
  projects: { id: string; name: string }[];
  entries: { id: string; hours: number; rate: number; project: { name: string } }[];
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createEntry = trpc.time.create.useMutation({
    onSuccess: async () => {
      await utils.time.list.invalidate();
      router.refresh();
    }
  });

  const maxHours = Math.max(...entries.map((entry) => entry.hours), 1);
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalEarnings = entries.reduce((sum, entry) => sum + entry.hours * entry.rate, 0);
  const weightedRate = totalHours ? totalEarnings / totalHours : 0;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Modal
          title="Log time"
          description="Track hours by project and keep earnings visibility close to the work."
          trigger={<button className="btn-primary">Log time</button>}
        >
          <form
            className="space-y-4"
            action={(formData) => {
              createEntry.mutate({
                projectId: String(formData.get("projectId") ?? ""),
                hours: Number(formData.get("hours") ?? 0),
                rate: Number(formData.get("rate") ?? 0)
              });
            }}
          >
            <select name="projectId" className="input-base">
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input name="hours" type="number" step="0.25" className="input-base" placeholder="Hours" />
              <input name="rate" type="number" step="0.01" className="input-base" placeholder="Hourly rate" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Save entry</button>
            </div>
          </form>
        </Modal>
      </div>
      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-5 border-b border-border bg-white/[0.02] px-5 py-3 text-xs uppercase tracking-[0.25em] text-muted">
          <div>Project</div>
          <div>Hours</div>
          <div>Rate</div>
          <div>Total</div>
          <div>Progress</div>
        </div>
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-5 items-center gap-4 px-5 py-4 text-sm">
              <div>{entry.project.name}</div>
              <div>{entry.hours.toFixed(1)}h</div>
              <div>{formatCurrency(entry.rate)}</div>
              <div>{formatCurrency(entry.hours * entry.rate)}</div>
              <div>
                <div className="h-2 rounded-full bg-white/[0.05]">
                  <div className="h-2 rounded-full bg-accent" style={{ width: `${(entry.hours / maxHours) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-5 items-center gap-4 px-5 py-4 text-sm font-bold text-off-white">
            <div>Totals</div>
            <div>{totalHours.toFixed(1)}h</div>
            <div>{formatCurrency(weightedRate)}</div>
            <div>{formatCurrency(totalEarnings)}</div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
