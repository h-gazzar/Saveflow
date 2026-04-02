"use client";

import { useRouter } from "next/navigation";

import { Modal } from "~/components/ui/Modal";
import { trpc } from "~/lib/trpc/client";

export function BillingActions({ plan }: { plan: "free" | "pro" | "agency" }) {
  const router = useRouter();
  const checkout = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    }
  });
  const portal = trpc.billing.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    }
  });

  return (
    <div className="flex flex-wrap gap-3">
      {plan !== "pro" ? (
        <button className="btn-primary" onClick={() => checkout.mutate({ plan: "pro" })}>
          Upgrade to Pro
        </button>
      ) : null}
      {plan !== "agency" ? (
        <button className="btn-ghost" onClick={() => checkout.mutate({ plan: "agency" })}>
          Upgrade to Agency
        </button>
      ) : null}
      {plan !== "free" ? (
        <>
          <button className="btn-ghost" onClick={() => portal.mutate()}>
            Manage subscription
          </button>
          <Modal
            title="Cancel subscription"
            description="We’ll send you to Stripe Customer Portal to confirm cancellation securely."
            trigger={<button className="btn-ghost">Cancel plan</button>}
          >
            <div className="space-y-5">
              <p className="text-sm leading-7 text-muted">
                Your subscription will stay active through the current billing period if Stripe is configured that way in your account settings.
              </p>
              <div className="flex justify-end">
                <button className="btn-primary" onClick={() => portal.mutate()}>
                  Continue to Stripe
                </button>
              </div>
            </div>
          </Modal>
        </>
      ) : null}
      <button className="btn-ghost" onClick={() => router.refresh()}>
        Refresh usage
      </button>
    </div>
  );
}
