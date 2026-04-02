import { z } from "zod";

import { LIMITS, normalizePlan } from "~/lib/planGates";
import { PLANS, stripe } from "~/lib/stripe";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";

export const billingRouter = createTRPCRouter({
  getCurrentPlan: protectedProcedure.query(({ ctx }) => ({
    plan: normalizePlan(ctx.user.plan),
    stripeCustomerId: ctx.user.stripeCustomerId
  })),
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const [clients, projects, invoices] = await Promise.all([
      ctx.prisma.client.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.project.count({ where: { userId: ctx.user.id } }),
      ctx.prisma.invoice.count({ where: { userId: ctx.user.id } })
    ]);

    const normalized = normalizePlan(ctx.user.plan);

    return {
      plan: normalized,
      usage: { clients, projects, invoices },
      limits: LIMITS[normalized]
    };
  }),
  createCheckoutSession: protectedProcedure
    .input(z.object({ plan: z.enum(["pro", "agency"]) }))
    .mutation(async ({ ctx, input }) => {
      const selectedPlan = PLANS[input.plan];

      if (!selectedPlan.priceId) {
        throw new Error("Stripe price ID is not configured.");
      }

      let customerId = ctx.user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: ctx.user.email,
          metadata: {
            userId: ctx.user.id
          }
        });

        customerId = customer.id;

        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { stripeCustomerId: customerId }
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: selectedPlan.priceId, quantity: 1 }],
        metadata: {
          priceId: selectedPlan.priceId
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?checkout=cancelled`,
        allow_promotion_codes: true
      });

      return { url: session.url };
    }),
  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.stripeCustomerId) {
      throw new Error("No Stripe customer found.");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: ctx.user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`
    });

    return { url: session.url };
  })
});
