import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "~/lib/prisma";
import { getPlanFromPriceId, stripe } from "~/lib/stripe";

export async function POST(request: Request) {
  const signature = headers().get("stripe-signature");
  const body = await request.text();

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new NextResponse(`Webhook error: ${(error as Error).message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer?.toString();
      const subscriptionId = session.subscription?.toString() ?? null;
      const priceId = session.metadata?.priceId ?? null;

      if (customerId) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: getPlanFromPriceId(priceId),
            stripeSubscriptionId: subscriptionId
          }
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer?.toString();
      const priceId = subscription.items.data[0]?.price.id;

      if (customerId) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: getPlanFromPriceId(priceId),
            stripeSubscriptionId: subscription.id
          }
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer?.toString();

      if (customerId) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: "free",
            stripeSubscriptionId: null
          }
        });
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
