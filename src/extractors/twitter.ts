import { chromium, type Browser, type BrowserContext } from "playwright";
import type { PostData, PostMetrics, ThreadPost, FetchOptions } from "../types";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

interface RawTweet {
  author: string;
  handle: string;
  text: string;
  metrics: string[];
  time: string | null;
}

interface PageExtraction {
  tweets: RawTweet[];
  images: string[];
}

function parseMetrics(raw: string[]): PostMetrics {
  return {
    replies: raw[0] ?? null,
    reposts: raw[1] ?? null,
    likes: raw[2] ?? null,
    views: raw[3] ?? null,
    bookmarks: raw[4] ?? null,
  };
}

export async function extractTwitterPost(
  url: string,
  options: FetchOptions = {}
): Promise<PostData> {
  const timeout = options.timeout ?? 30000;
  const headless = options.headless ?? true;
  const scroll = options.scroll ?? true;

  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({ headless });
    const context: BrowserContext = await browser.newContext({
      userAgent: DEFAULT_USER_AGENT,
      viewport: { width: 1280, height: 900 },
    });

    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });

    // Wait for tweet content to render
    try {
      await page.waitForSelector('[data-testid="tweetText"]', {
        timeout: 15000,
      });
    } catch {
      // Fallback: wait a bit longer for JS-heavy pages
      await page.waitForTimeout(8000);
    }

    // Scroll to load thread content if enabled
    if (scroll) {
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(1500);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(1000);
    }

    // Extract data from the page
    const data: PageExtraction = await page.evaluate(() => {
      const articles = document.querySelectorAll(
        'article[data-testid="tweet"]'
      );
      const tweets: RawTweet[] = [];

      articles.forEach((article) => {
        const textEl = article.querySelector('[data-testid="tweetText"]');
        const nameEl = article.querySelector('[data-testid="User-Name"]');
        const metricEls = article.querySelectorAll(
          '[data-testid="app-text-transition-container"]'
        );
        const timeEl = article.querySelector("time");

        const metrics: string[] = [];
        metricEls.forEach((m) => {
          const text = (m as HTMLElement).innerText?.trim();
          if (text) metrics.push(text);
        });

        const nameText = nameEl
          ? (nameEl as HTMLElement).innerText?.trim()
          : "";
        const handleMatch = nameText.match(/@[\w]+/);

        tweets.push({
          author: nameText.split("\n")[0] ?? "",
          handle: handleMatch ? handleMatch[0] : "",
          text: textEl ? (textEl as HTMLElement).innerText?.trim() : "",
          metrics,
          time: timeEl ? timeEl.getAttribute("datetime") : null,
        });
      });

      // Extract image alt text
      const images: string[] = [];
      document
        .querySelectorAll('[data-testid="tweetPhoto"] img')
        .forEach((img) => {
          const alt = (img as HTMLImageElement).alt;
          if (alt) images.push(alt);
        });

      return { tweets, images };
    });

    // Build result
    const main = data.tweets[0];
    if (!main) {
      throw new Error(`No tweet content found at ${url}`);
    }

    const thread: ThreadPost[] = data.tweets.slice(1).map((t) => ({
      author: t.author,
      handle: t.handle,
      text: t.text,
      metrics: parseMetrics(t.metrics),
    }));

    return {
      url,
      platform: "twitter",
      author: main.author,
      handle: main.handle,
      text: main.text,
      metrics: parseMetrics(main.metrics),
      images: data.images,
      timestamp: main.time,
      thread,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
