"use client";

import { useRouter } from "next/navigation";

import { Modal } from "~/components/ui/Modal";
import { trpc } from "~/lib/trpc/client";

export function ProjectActions({
  clients
}: {
  clients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createProject = trpc.projects.create.useMutation({
    onSuccess: async () => {
      await utils.projects.list.invalidate();
      router.refresh();
    }
  });

  return (
    <Modal
      title="Add project"
      description="Tie each project back to a client, a deadline, and a payment state."
      trigger={<button className="btn-primary">Add project</button>}
    >
      <form
        className="space-y-4"
        action={(formData) => {
          createProject.mutate({
            name: String(formData.get("name") ?? ""),
            clientId: String(formData.get("clientId") ?? ""),
            status: String(formData.get("status") ?? "active"),
            deadline: String(formData.get("deadline") ?? ""),
            paymentStatus: String(formData.get("paymentStatus") ?? "unpaid")
          });
        }}
      >
        <input name="name" required placeholder="Project name" className="input-base" />
        <select name="clientId" className="input-base" required>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <div className="grid gap-4 md:grid-cols-3">
          <select name="status" className="input-base">
            <option value="active">Active</option>
            <option value="proposal">Proposal</option>
            <option value="done">Done</option>
          </select>
          <input name="deadline" type="date" className="input-base" />
          <select name="paymentStatus" className="input-base">
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="warning">Pending</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Save project</button>
        </div>
      </form>
    </Modal>
  );
}
