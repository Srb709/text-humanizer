import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PROMPTS: Record<string, (inputs: Record<string, string>) => string> = {
  emailSubjects: (inputs) => `You are a world-class email copywriter. Generate exactly 10 compelling email subject lines.

Campaign Topic: ${inputs.topic}
Target Audience: ${inputs.audience}
Tone: ${inputs.tone}

Rules:
- Each subject line must be under 60 characters
- Use a variety of styles: curiosity gaps, numbers, questions, benefit statements, urgency
- Make them feel personal and specific — not generic
- No misleading clickbait

Format: numbered list only, one subject line per line. No extra commentary.`,

  socialPost: (inputs) => `You are a top social media strategist. Write 3 high-performing ${inputs.platform} posts.

Content Topic: ${inputs.topic}
Goal: ${inputs.goal}

Platform guidelines:
- Twitter/X: punchy, under 280 chars, 2-3 hashtags
- LinkedIn: professional, 150-300 words, insights-driven, 3-5 hashtags
- Instagram: engaging caption with storytelling, 5-10 hashtags at end
- Facebook: conversational, 100-200 words, invite engagement
- TikTok: trendy hook, casual voice, 100-150 chars, 4-6 hashtags

Separate posts with "---". Label each "Post 1:", "Post 2:", "Post 3:". Nothing else.`,

  adCopy: (inputs) => `You are a Google Ads specialist. Write high-CTR ad copy.

Product/Service: ${inputs.product}
Key Benefit: ${inputs.benefit}
Target Audience: ${inputs.audience}

Provide EXACTLY this format:

HEADLINES (5 total, max 30 characters each):
1.
2.
3.
4.
5.

DESCRIPTIONS (3 total, max 90 characters each):
1.
2.
3.

DISPLAY PATH:
/suggestion

Keep strictly within character limits. Lead with benefits, not features.`,

  productDesc: (inputs) => `You are a conversion copywriter. Write product descriptions for: ${inputs.name}

Key Features:
${inputs.features}

Target Customer: ${inputs.customer}

Write 3 versions with these exact headers:

SHORT (50-80 words) — for product cards:

MEDIUM (120-200 words) — for collection pages:

LONG (250-350 words) — for product detail pages, SEO-optimized:

Each version must be benefit-driven, persuasive, and tailored to the target customer.`,

  blogOutline: (inputs) => `You are an SEO content strategist. Create a comprehensive blog post outline.

Topic: ${inputs.topic}
Target Keyword: "${inputs.keyword}"
Target Audience: ${inputs.audience}

Use this exact format:

TITLE: (under 65 characters, includes keyword)

META DESCRIPTION: (150-160 characters, compelling, includes keyword)

INTRODUCTION HOOK: (1-2 sentences describing the opening angle)

OUTLINE:
H2: [Section title]
  H3: [Subpoint]
  H3: [Subpoint]
(repeat for 5-7 H2 sections)

CONCLUSION: (brief approach + CTA description)

SEMANTIC KEYWORDS: (8-10 related terms to weave in naturally)

ESTIMATED WORD COUNT: [number]`,
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error:
            "API key not configured. Set ANTHROPIC_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    const { type, inputs } = await req.json();

    if (!type || !inputs) {
      return NextResponse.json(
        { error: "Missing type or inputs" },
        { status: 400 }
      );
    }

    const promptFn = PROMPTS[type];
    if (!promptFn) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const client = new Anthropic();

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1500,
      messages: [{ role: "user", content: promptFn(inputs) }],
    });

    const result =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Generation failed";
    console.error("Generate error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
