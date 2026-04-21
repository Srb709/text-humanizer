import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Mail,
  Hash,
  Megaphone,
  ShoppingBag,
  FileText,
  Check,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Mail,
    title: "Email Subject Lines",
    desc: "10 curiosity-driven, click-worthy subject lines tailored to your audience and tone.",
  },
  {
    icon: Hash,
    title: "Social Media Posts",
    desc: "Platform-optimized captions for Twitter, LinkedIn, Instagram, Facebook, and TikTok.",
  },
  {
    icon: Megaphone,
    title: "Ad Copy",
    desc: "Google ad headlines and descriptions built to drive clicks and lower your CPC.",
  },
  {
    icon: ShoppingBag,
    title: "Product Descriptions",
    desc: "Short, medium, and long SEO-friendly descriptions that convert browsers into buyers.",
  },
  {
    icon: FileText,
    title: "Blog Outlines",
    desc: "Full SEO outlines with H2/H3 structure, semantic keywords, and meta descriptions.",
  },
  {
    icon: Zap,
    title: "More coming soon",
    desc: "Landing page copy, cold emails, video scripts, and more on the roadmap.",
  },
];

const steps = [
  {
    num: "01",
    title: "Pick a content type",
    desc: "Choose from email subjects, ad copy, social posts, product descriptions, or blog outlines.",
  },
  {
    num: "02",
    title: "Fill in the details",
    desc: "Tell us about your product, audience, and goal. Takes under a minute.",
  },
  {
    num: "03",
    title: "Get conversion-ready copy",
    desc: "Claude AI generates professional copy instantly. Copy, tweak, and publish.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    credits: "3 credits",
    cta: "Start free",
    href: "/generate",
    highlight: false,
    features: [
      "3 AI generations",
      "All 5 content types",
      "Copy to clipboard",
      "No credit card needed",
    ],
  },
  {
    name: "Starter",
    price: "$4.99",
    period: "one-time",
    credits: "25 credits",
    cta: "Buy Starter",
    href: "/generate?plan=starter",
    highlight: true,
    features: [
      "25 AI generations",
      "All 5 content types",
      "Copy to clipboard",
      "$0.20 per generation",
    ],
  },
  {
    name: "Pro",
    price: "$14.99",
    period: "one-time",
    credits: "100 credits",
    cta: "Buy Pro",
    href: "/generate?plan=pro",
    highlight: false,
    features: [
      "100 AI generations",
      "All 5 content types",
      "Copy to clipboard",
      "$0.15 per generation",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080808]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-xs">
              CF
            </div>
            <span className="font-semibold text-lg tracking-tight">
              CopyFlow AI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#how-it-works"
              className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              Pricing
            </a>
            <Link
              href="/generate"
              className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"
            >
              Try free
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <Zap size={11} />
            Powered by Claude AI — the world&apos;s best copywriter
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
            Marketing copy that
            <br />
            <span className="gradient-text">actually converts</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate email subjects, ad copy, social posts, product
            descriptions, and blog outlines in seconds. No writer. No guessing.
            Just results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="btn-primary px-8 py-4 rounded-xl text-base flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Start generating free
              <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="text-white/40 hover:text-white/70 text-sm transition-colors"
            >
              See how it works ↓
            </a>
          </div>
          <p className="text-white/25 text-xs mt-5">
            3 free generations · No credit card required
          </p>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="border-y border-white/5 py-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/25 text-xs font-medium">
            {[
              "Trusted by 1,000+ marketers",
              "2M+ pieces of copy generated",
              "4.9/5 average rating",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Star
                  size={10}
                  className="text-violet-500"
                  fill="currentColor"
                />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Copy ready in under 60 seconds
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              No prompt engineering needed. Just fill in the blanks and let AI
              do the heavy lifting.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="glass-card rounded-2xl p-8">
                <div className="text-5xl font-black text-white/5 mb-4 select-none">
                  {s.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              5 types of high-converting copy
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Everything a modern marketer or founder needs to grow their
              business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 hover:border-violet-500/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <f.icon size={20} className="text-violet-400" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple, pay-as-you-go pricing
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Start free. Buy credits when you need more. No subscriptions, no
              surprises.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-8 flex flex-col relative ${
                  p.highlight
                    ? "bg-violet-600/20 border border-violet-500/40 shadow-lg shadow-violet-500/10"
                    : "glass-card"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-white/60 text-sm font-medium mb-2">
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    {p.period && (
                      <span className="text-white/40 text-sm">{p.period}</span>
                    )}
                  </div>
                  <p className="text-violet-400 font-medium text-sm mt-1">
                    {p.credits}
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2.5 text-sm text-white/70"
                    >
                      <Check size={14} className="text-violet-400 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all block ${
                    p.highlight ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Start writing better copy today
          </h2>
          <p className="text-white/50 mb-8">
            3 free generations. No account. No credit card.
          </p>
          <Link
            href="/generate"
            className="btn-primary px-10 py-4 rounded-xl text-base inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            Try CopyFlow free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-xs">
              CF
            </div>
            <span>CopyFlow AI</span>
          </div>
          <p>© 2025 CopyFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
