"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function Modal({
  trigger,
  title,
  description,
  children
}: {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-6 sm:py-10">
          <Dialog.Content className="modal-card mx-auto w-[min(100%,38rem)] p-6 shadow-glow">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="font-sans text-2xl font-extrabold uppercase">{title}</Dialog.Title>
                {description ? <Dialog.Description className="mt-2 text-sm text-muted">{description}</Dialog.Description> : null}
              </div>
              <Dialog.Close className="rounded-sm border border-border p-2 text-muted transition hover:text-off-white">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
