"use client";

import { useRouter } from "next/navigation";

import { Modal } from "~/components/ui/Modal";
import { trpc } from "~/lib/trpc/client";

export function ClientActions({ currentCount }: { currentCount: number }) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createClient = trpc.clients.create.useMutation({
    onSuccess: async () => {
      await utils.clients.list.invalidate();
      router.refresh();
    }
  });

  return (
    <Modal
      title="Add client"
      description={currentCount >= 3 ? "Free users can save up to 3 clients before upgrading." : "Capture the essentials and keep account context attached to every project."}
      trigger={<button className="btn-primary">Add client</button>}
    >
      <form
        className="space-y-4"
        action={(formData) => {
          const payload = {
            name: String(formData.get("name") ?? ""),
            company: String(formData.get("company") ?? ""),
            email: String(formData.get("email") ?? ""),
            notes: String(formData.get("notes") ?? "")
          };
          createClient.mutate(payload);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input name="name" required placeholder="Name" className="input-base" />
          <input name="company" placeholder="Company" className="input-base" />
        </div>
        <input name="email" required type="email" placeholder="Email" className="input-base" />
        <textarea name="notes" placeholder="Notes" className="input-base min-h-28" />
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
