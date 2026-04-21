"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Share2,
  MessageSquare,
  Search,
  Play,
  Loader2,
  ChevronRight,
  Clock,
} from "lucide-react";

interface StatusData {
  wordpress: boolean;
  twitter: boolean;
  reddit: boolean;
  google: boolean;
  keywordCount: number;
  keywords: string[];
  siteName: string;
  siteUrl: string;
  wordpressUrl: string;
}

interface RunResult {
  success: boolean;
  error?: string;
  log?: Record<string, unknown>;
}

const SETUP_STEPS = [
  {
    key: "wordpress",
    label: "WordPress Blog",
    icon: Globe,
    desc: "Where your SEO posts are published",
    vars: ["WORDPRESS_URL", "WORDPRESS_USERNAME", "WORDPRESS_APP_PASSWORD"],
    guide:
      "In WordPress: Settings → Users → your user → Application Passwords. Create one and copy it.",
  },
  {
    key: "google",
    label: "Google Indexing",
    icon: Search,
    desc: "Pings Google to crawl new posts immediately",
    vars: ["WORDPRESS_URL"],
    guide:
      "Auto-configured when WordPress is set up. Uses your sitemap at /sitemap.xml.",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: Share2,
    desc: "Auto-posts a thread for each blog",
    vars: [
      "TWITTER_API_KEY",
      "TWITTER_API_SECRET",
      "TWITTER_ACCESS_TOKEN",
      "TWITTER_ACCESS_SECRET",
    ],
    guide:
      "Create a project at developer.twitter.com. Requires Basic plan ($100/mo) for write access.",
  },
  {
    key: "reddit",
    label: "Reddit",
    icon: MessageSquare,
    desc: "Posts to your target subreddits",
    vars: [
      "REDDIT_CLIENT_ID",
      "REDDIT_CLIENT_SECRET",
      "REDDIT_USERNAME",
      "REDDIT_PASSWORD",
      "REDDIT_SUBREDDITS",
    ],
    guide:
      "Go to reddit.com/prefs/apps → Create app (script type). Free to use.",
  },
];

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
      <CheckCircle size={14} />
      Connected
    </div>
  ) : (
    <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium">
      <XCircle size={14} />
      Not configured
    </div>
  );
}

export default function AutoPilotPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetch("/api/autopilot/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(console.error);
  }, []);

  const handleRunNow = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/autopilot/run");
      const data = await res.json();
      setRunResult(data);
    } catch {
      setRunResult({ success: false, error: "Request failed" });
    } finally {
      setRunning(false);
    }
  };

  const configured = status
    ? [status.wordpress, status.twitter, status.reddit, status.google].filter(
        Boolean
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-xs">
              CF
            </div>
          </Link>
          <ChevronRight size={14} className="text-white/20" />
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-violet-400" />
            <span className="font-semibold">AutoPilot</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Clock size={12} />
          Runs daily at 9:00 AM UTC
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Autonomous Marketing Engine
          </h1>
          <p className="text-white/50">
            Generates an SEO blog post every day, publishes it to WordPress,
            pings Google, and distributes to Twitter and Reddit — automatically.
          </p>
        </div>

        {/* Pipeline flow */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
          {[
            { icon: Zap, label: "Claude writes blog" },
            { icon: Globe, label: "WordPress publish" },
            { icon: Search, label: "Google ping" },
            { icon: Share2, label: "Twitter thread" },
            { icon: MessageSquare, label: "Reddit post" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2 shrink-0">
              <div className="glass-card rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm">
                <step.icon size={14} className="text-violet-400" />
                <span className="text-white/70 whitespace-nowrap">
                  {step.label}
                </span>
              </div>
              {i < 4 && (
                <ChevronRight size={14} className="text-white/20 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Integration status */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Integrations</h2>
            <span className="text-xs text-white/40">
              {configured}/4 connected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SETUP_STEPS.map((step) => {
              const isOk = status ? status[step.key as keyof StatusData] as boolean : false;
              return (
                <div
                  key={step.key}
                  className={`rounded-xl p-4 border transition-colors ${
                    isOk
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <step.icon
                        size={16}
                        className={isOk ? "text-green-400" : "text-white/30"}
                      />
                      <span className="font-medium text-sm">{step.label}</span>
                    </div>
                    {status && <StatusBadge ok={isOk} />}
                  </div>
                  <p className="text-white/40 text-xs mb-3">{step.desc}</p>
                  {!isOk && (
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-white/50 text-xs leading-relaxed">
                        {step.guide}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {step.vars.map((v) => (
                          <code
                            key={v}
                            className="text-xs bg-white/5 text-violet-300 px-1.5 py-0.5 rounded"
                          >
                            {v}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Keywords */}
        {status && (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Keyword Rotation</h2>
              <span className="text-xs text-white/40">
                {status.keywordCount} keywords ·{" "}
                {status.keywordCount > 0
                  ? `~${status.keywordCount} days before repeating`
                  : "none configured"}
              </span>
            </div>
            {status.keywordCount > 0 ? (
              <div className="flex flex-wrap gap-2">
                {status.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 px-3 py-1.5 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
                {status.keywordCount > 5 && (
                  <span className="text-xs text-white/30 px-3 py-1.5">
                    +{status.keywordCount - 5} more
                  </span>
                )}
              </div>
            ) : (
              <div className="bg-white/[0.02] rounded-xl p-4">
                <p className="text-white/50 text-sm mb-2">
                  Set keywords in your environment:
                </p>
                <code className="text-xs text-violet-300 bg-white/5 px-2 py-1 rounded">
                  AUTOPILOT_KEYWORDS=AI copywriting tool,email subject line
                  generator,ad copy AI
                </code>
              </div>
            )}
          </div>
        )}

        {/* Run controls */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="font-semibold mb-1">Manual Trigger</h2>
          <p className="text-white/50 text-sm mb-6">
            Run the full pipeline now to test your setup or publish on demand.
            The cron job also runs this automatically every day.
          </p>
          <button
            onClick={handleRunNow}
            disabled={running || !status?.wordpress}
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Running pipeline...
              </>
            ) : (
              <>
                <Play size={16} />
                Run AutoPilot Now
              </>
            )}
          </button>
          {!status?.wordpress && (
            <p className="text-white/40 text-xs mt-3">
              Configure WordPress first to enable manual runs.
            </p>
          )}
        </div>

        {/* Run result */}
        {runResult && (
          <div
            className={`rounded-2xl p-6 border ${
              runResult.success
                ? "bg-green-500/5 border-green-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              {runResult.success ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : (
                <XCircle size={18} className="text-red-400" />
              )}
              <h3 className="font-semibold">
                {runResult.success ? "Pipeline completed" : "Pipeline failed"}
              </h3>
            </div>

            {runResult.error && (
              <p className="text-red-400 text-sm mb-4">{runResult.error}</p>
            )}

            {runResult.log && (
              <div className="space-y-2">
                {Object.entries(runResult.log).map(([key, val]) => {
                  if (key === "timestamp") return null;
                  return (
                    <div key={key} className="flex items-start gap-3 text-sm">
                      <span className="text-white/40 w-24 shrink-0 capitalize">
                        {key}
                      </span>
                      <span className="text-white/70 font-mono text-xs break-all">
                        {typeof val === "object"
                          ? JSON.stringify(val)
                          : String(val)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Setup guide toggle */}
        <div className="mt-8">
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            <ChevronRight
              size={14}
              className={`transition-transform ${showSetup ? "rotate-90" : ""}`}
            />
            Full setup guide
          </button>

          {showSetup && (
            <div className="mt-6 glass-card rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold">Complete Setup Checklist</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-1">
                    1. Create a WordPress site
                  </p>
                  <p className="text-white/50">
                    Use wordpress.com (free) or self-host on any $5/mo VPS. Install the Yoast SEO plugin for automatic sitemaps.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">2. Get WordPress credentials</p>
                  <p className="text-white/50">
                    WordPress Admin → Users → Your Profile → scroll to
                    &quot;Application Passwords&quot; → generate one. Use your
                    username + that password.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">
                    3. Register Google Search Console
                  </p>
                  <p className="text-white/50">
                    Add your site at search.google.com/search-console. This
                    speeds up indexing and lets you track rankings over time.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">
                    4. Twitter Developer App (optional)
                  </p>
                  <p className="text-white/50">
                    Go to developer.twitter.com → Create Project → Create App.
                    Note: posting requires the Basic tier ($100/mo). Get all 4
                    keys from the &quot;Keys and Tokens&quot; tab.
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">5. Reddit App (optional)</p>
                  <p className="text-white/50">
                    Go to reddit.com/prefs/apps → &quot;create another
                    app&quot; → choose &quot;script&quot; type → set redirect to
                    http://localhost. Free. Set{" "}
                    <code className="text-violet-300">REDDIT_SUBREDDITS</code>{" "}
                    to comma-separated list like{" "}
                    <code className="text-violet-300">
                      r/entrepreneur,r/marketing
                    </code>
                    .
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-1">6. Deploy to Vercel</p>
                  <p className="text-white/50">
                    Push to GitHub → Import in Vercel → add all env vars in
                    Vercel Dashboard → Deploy. The cron job in{" "}
                    <code className="text-violet-300">vercel.json</code> runs
                    automatically at 9 AM UTC daily.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
