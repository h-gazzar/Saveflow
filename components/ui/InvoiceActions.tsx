"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "~/components/ui/Modal";
import { formatCurrency } from "~/lib/utils";
import { trpc } from "~/lib/trpc/client";

export function InvoiceActions({
  clients,
  nextNumber
}: {
  clients: { id: string; name: string }[];
  nextNumber: string;
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [amount, setAmount] = useState(0);
  const createInvoice = trpc.invoices.create.useMutation({
    onSuccess: async () => {
      await utils.invoices.list.invalidate();
      router.refresh();
    }
  });

  return (
    <Modal
      title="New invoice"
      description="Invoice numbers auto-increment and the preview updates as you type."
      trigger={<button className="btn-primary">New invoice</button>}
    >
      <form
        className="space-y-4"
        action={(formData) => {
          createInvoice.mutate({
            clientId: String(formData.get("clientId") ?? ""),
            amount,
            date: String(formData.get("date") ?? ""),
            status: String(formData.get("status") ?? "unpaid")
          });
        }}
      >
        <select name="clientId" className="input-base">
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            className="input-base"
            onChange={(event) => setAmount(Number(event.target.value))}
          />
          <input name="date" type="date" className="input-base" />
          <select name="status" className="input-base">
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="warning">Pending</option>
          </select>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Live preview</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="font-mono text-sm text-muted">{nextNumber}</p>
              <p className="mt-2 font-sans text-2xl font-extrabold uppercase">{formatCurrency(amount || 0)}</p>
            </div>
            <p className="text-sm text-accent">Total before save</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">Create invoice</button>
        </div>
      </form>
    </Modal>
  );
}
