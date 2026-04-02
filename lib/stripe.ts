import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia"
});

export const PLANS = {
  free: { label: "Free", price: 0, priceId: null },
  pro: { label: "Pro", price: 8, priceId: process.env.STRIPE_PRO_PRICE_ID ?? null },
  agency: { label: "Agency", price: 20, priceId: process.env.STRIPE_AGENCY_PRICE_ID ?? null }
} as const;

export function getPlanFromPriceId(priceId?: string | null) {
  if (priceId && priceId === process.env.STRIPE_AGENCY_PRICE_ID) return "agency";
  if (priceId && priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "free";
}
