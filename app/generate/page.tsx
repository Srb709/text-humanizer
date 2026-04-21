"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Mail,
  Hash,
  Megaphone,
  ShoppingBag,
  FileText,
  Zap,
  Copy,
  Check,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";

const CREDITS_KEY = "cf_credits";
const FREE_CREDITS = 3;

type TextField = {
  id: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
};

type SelectField = {
  id: string;
  label: string;
  type: "select";
  placeholder: string;
  options: string[];
};

type FormField = TextField | SelectField;

type ContentTypeConfig = {
  label: string;
  icon: LucideIcon;
  desc: string;
  fields: FormField[];
};

const CONTENT_TYPES: Record<string, ContentTypeConfig> = {
  emailSubjects: {
    label: "Email Subjects",
    icon: Mail,
    desc: "10 click-worthy subject lines",
    fields: [
      {
        id: "topic",
        label: "Campaign Topic",
        type: "textarea",
        placeholder:
          "e.g. Summer sale, product launch, weekly newsletter...",
      },
      {
        id: "audience",
        label: "Target Audience",
        type: "text",
        placeholder: "e.g. Small business owners, fitness enthusiasts...",
      },
      {
        id: "tone",
        label: "Tone",
        type: "select",
        placeholder: "Select tone",
        options: [
          "Curiosity",
          "Benefit-focused",
          "Urgency",
          "Question",
          "Humor",
        ],
      },
    ],
  },
  socialPost: {
    label: "Social Media Post",
    icon: Hash,
    desc: "3 platform-specific captions",
    fields: [
      {
        id: "topic",
        label: "Content Topic",
        type: "textarea",
        placeholder: "What is this post about?",
      },
      {
        id: "platform",
        label: "Platform",
        type: "select",
        placeholder: "Select platform",
        options: ["Twitter / X", "LinkedIn", "Instagram", "Facebook", "TikTok"],
      },
      {
        id: "goal",
        label: "Goal",
        type: "select",
        placeholder: "Select goal",
        options: [
          "Drive engagement",
          "Generate traffic",
          "Build awareness",
          "Drive sales",
        ],
      },
    ],
  },
  adCopy: {
    label: "Ad Copy",
    icon: Megaphone,
    desc: "Headlines + descriptions",
    fields: [
      {
        id: "product",
        label: "Product / Service",
        type: "text",
        placeholder: "e.g. Online accounting software for freelancers",
      },
      {
        id: "benefit",
        label: "Key Benefit",
        type: "text",
        placeholder: "e.g. Save 5 hours per week on bookkeeping",
      },
      {
        id: "audience",
        label: "Target Audience",
        type: "text",
        placeholder: "e.g. Freelancers and solopreneurs",
      },
    ],
  },
  productDesc: {
    label: "Product Description",
    icon: ShoppingBag,
    desc: "Short, medium & long versions",
    fields: [
      {
        id: "name",
        label: "Product Name",
        type: "text",
        placeholder: "e.g. AirPods Pro 3",
      },
      {
        id: "features",
        label: "Key Features",
        type: "textarea",
        placeholder: "List 3-5 key features, one per line...",
      },
      {
        id: "customer",
        label: "Target Customer",
        type: "text",
        placeholder: "e.g. Remote workers who love music",
      },
    ],
  },
  blogOutline: {
    label: "Blog Outline",
    icon: FileText,
    desc: "Full SEO-optimized outline",
    fields: [
      {
        id: "topic",
        label: "Blog Topic",
        type: "text",
        placeholder: "e.g. How to grow your email list in 2025",
      },
      {
        id: "keyword",
        label: "Target Keyword",
        type: "text",
        placeholder: "e.g. email list growth strategies",
      },
      {
        id: "audience",
        label: "Reader Audience",
        type: "text",
        placeholder: "e.g. Marketing managers at B2B SaaS companies",
      },
    ],
  },
};

export default function GeneratePage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [activeType, setActiveType] = useState("emailSubjects");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [error, setError] = useState("");
  const [buyingPlan, setBuyingPlan] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CREDITS_KEY);
    if (stored === null) {
      localStorage.setItem(CREDITS_KEY, String(FREE_CREDITS));
      setCredits(FREE_CREDITS);
    } else {
      setCredits(Number(stored));
    }

    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan === "starter" || plan === "pro") {
      setShowPurchase(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (credits === null || credits <= 0) {
      setShowPurchase(true);
      return;
    }

    const fields = CONTENT_TYPES[activeType].fields;
    const missing = fields.some((f) => !formData[f.id]?.trim());
    if (missing) {
      setError("Please fill in all fields before generating.");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeType, inputs: formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResult(data.result);
      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem(CREDITS_KEY, String(newCredits));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = async (plan: "starter" | "pro") => {
    setBuyingPlan(plan);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to start checkout.";
      setError(msg);
    } finally {
      setBuyingPlan(null);
    }
  };

  const switchType = (key: string) => {
    setActiveType(key);
    setResult("");
    setError("");
    setFormData({});
  };

  const activeConfig = CONTENT_TYPES[activeType];

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/5 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-xs">
            CF
          </div>
          <span className="font-semibold text-sm hidden sm:block">
            CopyFlow AI
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg ${
              credits === 0
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-white/5 text-white/70"
            }`}
          >
            <Zap size={13} />
            <span>{credits === null ? "..." : credits}</span>
            <span className="hidden sm:inline">credits</span>
          </div>
          <button
            onClick={() => setShowPurchase(true)}
            className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
          >
            <ShoppingCart size={12} />
            <span className="hidden sm:inline">Buy credits</span>
            <span className="sm:hidden">Buy</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-56 border-r border-white/5 p-3 gap-1 shrink-0 overflow-y-auto">
          {Object.entries(CONTENT_TYPES).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => switchType(key)}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group ${
                activeType === key
                  ? "bg-violet-600/20 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <cfg.icon
                size={16}
                className={`mt-0.5 shrink-0 ${
                  activeType === key
                    ? "text-violet-400"
                    : "group-hover:text-white/70"
                }`}
              />
              <div>
                <div className="font-medium text-sm">{cfg.label}</div>
                <div className="text-xs opacity-60 mt-0.5">{cfg.desc}</div>
              </div>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4">
            {Object.entries(CONTENT_TYPES).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => switchType(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeType === key
                    ? "bg-violet-600 text-white"
                    : "glass-card text-white/60 hover:text-white"
                }`}
              >
                <cfg.icon size={12} />
                {cfg.label}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">{activeConfig.label}</h1>
            <p className="text-white/50 text-sm mb-8">{activeConfig.desc}</p>

            {/* Form fields */}
            <div className="space-y-5 mb-6">
              {activeConfig.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-colors resize-none"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                    >
                      <option value="" disabled>
                        {field.placeholder}
                      </option>
                      {(field as SelectField).options.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#1a1a1a]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed mb-8"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Generate — 1 credit
                </>
              )}
            </button>

            {result && (
              <div className="glass-card rounded-2xl p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-sm text-white/80">
                    Generated Copy
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check size={12} className="text-green-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                    {copied ? "Copied!" : "Copy all"}
                  </button>
                </div>
                <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Purchase modal */}
      {showPurchase && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPurchase(false);
          }}
        >
          <div className="glass-card rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h2 className="text-xl font-bold mb-1">Get more credits</h2>
            <p className="text-white/50 text-sm mb-8">
              Pay once. Use anytime. No subscriptions.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Starter */}
              <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
                <p className="font-semibold mb-1">Starter</p>
                <p className="text-3xl font-extrabold">$4.99</p>
                <p className="text-violet-400 text-sm mt-1">25 credits</p>
                <p className="text-white/40 text-xs mt-0.5">
                  $0.20 / generation
                </p>
                <button
                  onClick={() => handleBuy("starter")}
                  disabled={buyingPlan !== null}
                  className="mt-4 w-full btn-primary py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {buyingPlan === "starter" ? "Loading..." : "Buy Now"}
                </button>
              </div>
              {/* Pro */}
              <div className="border border-violet-500/40 bg-violet-500/10 rounded-xl p-5 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  Best value
                </div>
                <p className="font-semibold mb-1">Pro</p>
                <p className="text-3xl font-extrabold">$14.99</p>
                <p className="text-violet-400 text-sm mt-1">100 credits</p>
                <p className="text-white/40 text-xs mt-0.5">
                  $0.15 / generation
                </p>
                <button
                  onClick={() => handleBuy("pro")}
                  disabled={buyingPlan !== null}
                  className="mt-4 w-full btn-primary py-2.5 rounded-lg text-sm disabled:opacity-50"
                >
                  {buyingPlan === "pro" ? "Loading..." : "Buy Now"}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPurchase(false)}
              className="w-full text-center text-white/40 hover:text-white text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
