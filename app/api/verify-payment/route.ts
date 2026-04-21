import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ valid: false, error: "Stripe not configured" });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ valid: false });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const credits = Number(session.metadata?.credits ?? 0);
      return NextResponse.json({ valid: true, credits });
    }

    return NextResponse.json({ valid: false });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Verification failed";
    console.error("Verify payment error:", msg);
    return NextResponse.json({ valid: false, error: msg });
  }
}
