import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

const client = new Anthropic();

// ─── Utilities ────────────────────────────────────────────────────────────────

function extractJSON(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (fenced) return fenced[1].trim();
  const obj = text.match(/\{[\s\S]+\}/);
  if (obj) return obj[0].trim();
  return text.trim();
}

function getTodaysKeyword(): string {
  const raw = process.env.AUTOPILOT_KEYWORDS ?? "AI copywriting tool";
  const keywords = raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const day = Math.floor(Date.now() / 86_400_000);
  return keywords[day % keywords.length];
}

// ─── Blog Generation ──────────────────────────────────────────────────────────

interface BlogPost {
  title: string;
  metaDescription: string;
  slug: string;
  excerpt: string;
  content: string;
}

async function generateBlogPost(keyword: string): Promise<BlogPost> {
  const siteName = process.env.AUTOPILOT_SITE_NAME ?? "CopyFlow AI";
  const siteUrl = process.env.AUTOPILOT_SITE_URL ?? "";

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are a world-class SEO content writer. Write a comprehensive, high-ranking blog post.

Target Keyword: "${keyword}"
Brand: ${siteName}${siteUrl ? `\nBrand URL: ${siteUrl}` : ""}

Respond with ONLY a valid JSON object — no markdown fences, no extra text:
{
  "title": "SEO-optimized title under 60 characters containing the keyword",
  "metaDescription": "Compelling meta description 150-160 characters with keyword and CTA",
  "slug": "hyphenated-url-slug-with-keyword",
  "excerpt": "2-3 sentence summary of the post",
  "content": "Complete HTML blog post 1500-2000 words using <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>. Include keyword naturally 8-12 times. Structure: hook intro, 5-6 detailed H2 sections with real value, conclusion with CTA${siteUrl ? ` linking to ${siteUrl}` : ""}. Pure HTML only."
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "{}";
  return JSON.parse(extractJSON(text)) as BlogPost;
}

// ─── Social Content ───────────────────────────────────────────────────────────

interface SocialContent {
  twitterThread: string[];
  redditTitle: string;
  redditBody: string;
}

async function generateSocialContent(
  title: string,
  excerpt: string,
  postUrl: string
): Promise<SocialContent> {
  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Create social media content for this blog post.

Title: ${title}
Summary: ${excerpt}
URL: ${postUrl}

Respond with ONLY a valid JSON object — no markdown fences, no extra text:
{
  "twitterThread": [
    "Tweet 1: strong hook under 260 chars, no URL",
    "Tweet 2: key insight under 270 chars",
    "Tweet 3: another insight under 270 chars",
    "Tweet 4: final value point + link ${postUrl} (under 280 chars total)"
  ],
  "redditTitle": "Value-first Reddit title with no self-promotion",
  "redditBody": "Genuine, insightful post 200-300 words sharing real learnings from the article. Mention the link once naturally at the end: ${postUrl}"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "{}";
  return JSON.parse(extractJSON(text)) as SocialContent;
}

// ─── WordPress ────────────────────────────────────────────────────────────────

interface WPResponse {
  id: number;
  link: string;
}

async function publishToWordPress(post: BlogPost): Promise<WPResponse> {
  const wpUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  const wpUser = process.env.WORDPRESS_USERNAME ?? "";
  const wpPass = process.env.WORDPRESS_APP_PASSWORD ?? "";

  if (!wpUrl || !wpUser || !wpPass) {
    throw new Error(
      "WordPress not configured — set WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_APP_PASSWORD"
    );
  }

  const auth = Buffer.from(`${wpUser}:${wpPass}`).toString("base64");

  const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      status: "publish",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WordPress ${res.status}: ${err}`);
  }

  return res.json() as Promise<WPResponse>;
}

// ─── Google Sitemap Ping ──────────────────────────────────────────────────────

async function pingSitemap(wpUrl: string) {
  const sitemapUrl = `${wpUrl.replace(/\/$/, "")}/sitemap.xml`;
  try {
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );
    return { success: true, sitemapUrl };
  } catch {
    return { success: false, sitemapUrl };
  }
}

// ─── Twitter (OAuth 1.0a) ─────────────────────────────────────────────────────

function buildOAuth1Header(method: string, url: string): string {
  const consumerKey = process.env.TWITTER_API_KEY!;
  const consumerSecret = process.env.TWITTER_API_SECRET!;
  const token = process.env.TWITTER_ACCESS_TOKEN!;
  const tokenSecret = process.env.TWITTER_ACCESS_SECRET!;

  const oauth: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: "1.0",
  };

  const paramString = Object.entries(oauth)
    .sort()
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const base = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString),
  ].join("&");

  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  oauth.oauth_signature = crypto
    .createHmac("sha256", signingKey)
    .update(base)
    .digest("base64");

  return (
    "OAuth " +
    Object.entries(oauth)
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

async function postTwitterThread(tweets: string[]) {
  const apiKey = process.env.TWITTER_API_KEY;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;

  if (!apiKey || !accessToken) {
    return { skipped: true, reason: "Twitter credentials not configured" };
  }

  const url = "https://api.twitter.com/2/tweets";
  let lastId: string | undefined;
  let posted = 0;

  for (const text of tweets.slice(0, 4)) {
    const body: Record<string, unknown> = { text };
    if (lastId) body.reply = { in_reply_to_tweet_id: lastId };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: buildOAuth1Header("POST", url),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as { data?: { id: string } };
    if (data.data?.id) {
      lastId = data.data.id;
      posted++;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  return { success: true, tweetsPosted: posted };
}

// ─── Reddit ───────────────────────────────────────────────────────────────────

async function postToReddit(title: string, body: string) {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;
  const subredditsRaw = process.env.REDDIT_SUBREDDITS ?? "";

  if (!clientId || !clientSecret || !username || !password) {
    return { skipped: true, reason: "Reddit credentials not configured" };
  }

  const subreddits = subredditsRaw
    .split(",")
    .map((s) => s.trim().replace(/^r\//, ""))
    .filter(Boolean)
    .slice(0, 2);

  if (subreddits.length === 0) {
    return { skipped: true, reason: "No subreddits configured" };
  }

  const userAgent = `AutoPilot:CopyFlowAI:1.0 (by /u/${username})`;

  const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: new URLSearchParams({ grant_type: "password", username, password }),
  });

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    return { success: false, error: "Reddit authentication failed" };
  }

  const posted: string[] = [];
  for (const subreddit of subreddits) {
    const postRes = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": userAgent,
      },
      body: new URLSearchParams({
        sr: subreddit,
        kind: "self",
        title,
        text: body,
        resubmit: "true",
        nsfw: "false",
      }),
    });

    const postData = (await postRes.json()) as {
      json?: { data?: { url?: string } };
    };
    const postUrl = postData?.json?.data?.url;
    if (postUrl) posted.push(postUrl);
    await new Promise((r) => setTimeout(r, 2000));
  }

  return { success: true, posts: posted };
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  // Allow unauthenticated in dev; require Bearer token in production
  if (
    process.env.NODE_ENV === "production" &&
    cronSecret &&
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
  };

  const keyword = getTodaysKeyword();
  log.keyword = keyword;

  try {
    console.log(`[AutoPilot] Starting run — keyword: "${keyword}"`);

    // 1. Generate blog post
    const blog = await generateBlogPost(keyword);
    log.blog = { title: blog.title, slug: blog.slug };
    console.log(`[AutoPilot] Blog generated: "${blog.title}"`);

    // 2. Publish to WordPress
    const wpPost = await publishToWordPress(blog);
    log.wordpress = { url: wpPost.link, id: wpPost.id };
    console.log(`[AutoPilot] Published to WordPress: ${wpPost.link}`);

    // 3. Ping Google
    log.google = await pingSitemap(process.env.WORDPRESS_URL!);
    console.log("[AutoPilot] Google sitemap pinged");

    // 4. Generate social content
    const social = await generateSocialContent(
      blog.title,
      blog.excerpt,
      wpPost.link
    );

    // 5. Post to Twitter
    log.twitter = await postTwitterThread(social.twitterThread);
    console.log("[AutoPilot] Twitter done:", log.twitter);

    // 6. Post to Reddit
    log.reddit = await postToReddit(social.redditTitle, social.redditBody);
    console.log("[AutoPilot] Reddit done:", log.reddit);

    return NextResponse.json({ success: true, log });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Pipeline failed";
    console.error("[AutoPilot] Error:", msg);
    return NextResponse.json(
      { success: false, error: msg, log },
      { status: 500 }
    );
  }
}
