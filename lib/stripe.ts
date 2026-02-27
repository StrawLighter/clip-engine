import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    priceId: "",
    clips_per_month: 3,
    name: "Free",
    price: 0,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    clips_per_month: 999999,
    name: "Pro",
    price: 29,
  },
} as const;
