import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PLANS = {
  starter: { credits: 25, amount: 499, name: "Starter Pack" },
  pro: { credits: 100, amount: 1499, name: "Pro Pack" },
} as const;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured. Set STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    const { plan } = await req.json();
    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `CopyFlow AI – ${selectedPlan.name}`,
              description: `${selectedPlan.credits} AI copywriting credits`,
            },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&credits=${selectedPlan.credits}`,
      cancel_url: `${baseUrl}/generate`,
      metadata: { credits: String(selectedPlan.credits) },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to create checkout";
    console.error("Checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
