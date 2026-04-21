import { NextResponse } from "next/server";

export async function GET() {
  const keywords = (process.env.AUTOPILOT_KEYWORDS ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return NextResponse.json({
    wordpress: !!(
      process.env.WORDPRESS_URL &&
      process.env.WORDPRESS_USERNAME &&
      process.env.WORDPRESS_APP_PASSWORD
    ),
    twitter: !!(
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_SECRET
    ),
    reddit: !!(
      process.env.REDDIT_CLIENT_ID &&
      process.env.REDDIT_CLIENT_SECRET &&
      process.env.REDDIT_USERNAME &&
      process.env.REDDIT_PASSWORD
    ),
    google: !!(process.env.WORDPRESS_URL),
    keywordCount: keywords.length,
    keywords: keywords.slice(0, 5),
    siteName: process.env.AUTOPILOT_SITE_NAME ?? "",
    siteUrl: process.env.AUTOPILOT_SITE_URL ?? "",
    wordpressUrl: process.env.WORDPRESS_URL ?? "",
  });
}
