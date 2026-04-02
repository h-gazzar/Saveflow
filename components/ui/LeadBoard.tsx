"use client";

import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";

import { Modal } from "~/components/ui/Modal";
import { trpc } from "~/lib/trpc/client";
import { formatCurrency } from "~/lib/utils";

const stages = ["lead", "contacted", "negotiation", "won", "lost"] as const;

export function LeadBoard({
  leads
}: {
  leads: { id: string; name: string; company: string | null; stage: string; value: number | null; order: number }[];
}) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createLead = trpc.leads.create.useMutation({
    onSuccess: async () => {
      await utils.leads.list.invalidate();
      router.refresh();
    }
  });
  const updateStage = trpc.leads.updateStage.useMutation({
    onSuccess: async () => {
      await utils.leads.list.invalidate();
      router.refresh();
    }
  });

  const grouped = stages.map((stage) => ({
    stage,
    items: leads.filter((lead) => lead.stage.toLowerCase() === stage).sort((a, b) => a.order - b.order)
  }));

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    updateStage.mutate({
      id: result.draggableId,
      stage: result.destination.droppableId,
      order: result.destination.index
    });
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Modal
          title="Add lead"
          description="Capture new opportunities and place them directly into your pipeline."
          trigger={<button className="btn-primary">Add lead</button>}
        >
          <form
            className="space-y-4"
            action={(formData) => {
              createLead.mutate({
                name: String(formData.get("name") ?? ""),
                company: String(formData.get("company") ?? ""),
                stage: String(formData.get("stage") ?? "lead"),
                value: Number(formData.get("value") ?? 0)
              });
            }}
          >
            <input name="name" className="input-base" placeholder="Lead name" />
            <input name="company" className="input-base" placeholder="Company" />
            <div className="grid gap-4 md:grid-cols-2">
              <select name="stage" className="input-base">
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <input name="value" type="number" className="input-base" placeholder="Deal value" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Save lead</button>
            </div>
          </form>
        </Modal>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-4 xl:grid-cols-5">
          {grouped.map((column) => (
            <Droppable droppableId={column.stage} key={column.stage}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="surface-card min-h-[24rem] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-sans text-sm font-extrabold uppercase">{column.stage}</p>
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">{column.items.length}</span>
                  </div>
                  <div className="space-y-3">
                    {column.items.map((lead, index) => (
                      <Draggable draggableId={lead.id} index={index} key={lead.id}>
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`rounded-sm border p-3 ${column.stage === "negotiation" ? "border-accent/40 bg-tag/20" : "border-border bg-white/[0.02]"}`}
                          >
                            <p className="font-sans text-sm font-bold uppercase">{lead.name}</p>
                            <p className="mt-1 text-xs text-muted">{lead.company ?? "Independent"}</p>
                            <p className="mt-3 text-sm">{formatCurrency(lead.value ?? 0)}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
