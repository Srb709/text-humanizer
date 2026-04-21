"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const CREDITS_KEY = "cf_credits";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const creditsParam = searchParams.get("credits");

    if (!sessionId || !creditsParam) {
      setStatus("error");
      return;
    }

    fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          const existing = Number(localStorage.getItem(CREDITS_KEY) || "0");
          localStorage.setItem(CREDITS_KEY, String(existing + data.credits));
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  if (status === "verifying") {
    return (
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-violet-400 mx-auto mb-4" />
        <p className="text-white/50">Confirming your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center max-w-md">
        <p className="text-2xl font-bold mb-2">Something went wrong</p>
        <p className="text-white/50 mb-8">
          Your payment may still have gone through. If credits weren&apos;t
          added, please contact support with your Stripe receipt.
        </p>
        <Link
          href="/generate"
          className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"
        >
          Back to generator
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md animate-fade-up">
      <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} className="text-green-400" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Credits added!</h1>
      <p className="text-white/50 mb-8">
        Your credits have been added. Start generating high-converting copy now.
      </p>
      <Link
        href="/generate"
        className="btn-primary px-8 py-4 rounded-xl inline-flex items-center gap-2 text-base"
      >
        Start generating
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-violet-400 mx-auto mb-4" />
            <p className="text-white/50">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
