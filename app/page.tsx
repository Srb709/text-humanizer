"use client";

import { useMemo, useState } from "react";
import { humanizeText, RewriteMode } from "@/lib/humanize";

const modes: Array<{ value: RewriteMode; label: string; description: string }> = [
  { value: "casual", label: "Casual", description: "Friendly, conversational, natural" },
  { value: "professional", label: "Professional", description: "Clear, polished, and business-ready" },
  { value: "shorter", label: "Shorter", description: "Tighter and more concise" },
];

const examples = [
  {
    input: "In order to utilize our platform effectively, it is important to note that you should commence onboarding at this point in time.",
    output: "To use our platform effectively, note that you should start onboarding now.",
  },
  {
    input: "We would like to endeavor to fix this issue due to the fact that it is very important for the team.",
    output: "We want to try to resolve this issue because it's important for the team.",
  },
];

export default function Home() {
  const [mode, setMode] = useState<RewriteMode>("casual");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const charCount = useMemo(() => input.length, [input]);

  const onHumanize = () => {
    setCopied(false);
    setOutput(humanizeText(input, mode));
  };

  const onCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(45,17,79,0.5),rgba(198,40,63,0.18),rgba(8,8,11,0.95))] bg-[length:220%_220%] animate-gradient-shift" />

      <section className="surface relative mx-auto w-full max-w-4xl rounded-3xl border border-white/10 p-6 shadow-glow backdrop-blur-xl sm:p-10 animate-fade-up">
        <header className="mb-8 space-y-3">
          <p className="inline-flex rounded-full border border-raptorSilver/20 bg-white/5 px-3 py-1 text-xs tracking-[0.18em] text-raptorSilver uppercase">
            Rule-Based Rewriter
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Text Humanizer</h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Rewrite stiff text into cleaner, more natural language with a local, no-API engine.
          </p>
        </header>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {modes.map((item) => (
            <button
              key={item.value}
              onClick={() => setMode(item.value)}
              className={`group rounded-2xl border px-4 py-3 text-left transition duration-300 ${
                mode === item.value
                  ? "border-raptorRed/60 bg-raptorRed/10 shadow-glow"
                  : "border-white/10 bg-white/[0.03] hover:border-raptorSilver/35 hover:bg-white/[0.08]"
              }`}
            >
              <p className="font-semibold">{item.label}</p>
              <p className="mt-1 text-xs text-slate-300">{item.description}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="input-base min-h-48 resize-y"
              placeholder="Paste text that sounds robotic and click Humanize Text..."
            />
            <p className="mt-2 text-right text-xs text-slate-400">{charCount} characters</p>
          </div>

          <button
            onClick={onHumanize}
            className="w-full rounded-2xl bg-gradient-to-r from-raptorPurple via-raptorRed to-raptorPurple bg-[length:200%_100%] px-5 py-3 font-semibold tracking-wide transition duration-300 hover:scale-[1.01] hover:bg-right active:scale-[0.99]"
          >
            Humanize Text
          </button>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-raptorSilver">Output</h2>
              <button
                onClick={onCopy}
                disabled={!output}
                className="rounded-lg border border-white/15 px-3 py-1 text-xs transition hover:border-raptorSilver/50 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="min-h-24 whitespace-pre-wrap text-sm text-slate-100">{output || "Your rewritten text will appear here."}</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-6 w-full max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl animate-fade-up [animation-delay:120ms]">
        <h3 className="mb-4 text-sm font-semibold tracking-[0.14em] text-raptorSilver uppercase">Examples</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {examples.map((sample, index) => (
            <article key={index} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs font-semibold text-raptorSilver">Input</p>
              <p className="mt-1 text-sm text-slate-300">{sample.input}</p>
              <p className="mt-3 text-xs font-semibold text-raptorSilver">Output</p>
              <p className="mt-1 text-sm text-white">{sample.output}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
