# @rezzed.ai/xfetch

[![npm version](https://img.shields.io/npm/v/@rezzed.ai/xfetch.svg)](https://www.npmjs.com/package/@rezzed.ai/xfetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)

**Extract social media content from Twitter/X posts — no API keys required.**

```bash
npx xfetch https://x.com/user/status/123456789
```

---

## What It Does

- Extracts post text, author info, and engagement metrics from Twitter/X
- Captures thread content and image alt text
- Uses Playwright browser automation to parse live DOM content
- Returns clean JSON output for downstream processing
- Works with both x.com and twitter.com URLs

## Install

```bash
npm install @rezzed.ai/xfetch
```

**Requirements:** Node.js 18+, Playwright (installed automatically)

First run installs Chromium browser:
```bash
npx playwright install chromium
```

## Quick Start

**CLI:**
```bash
# Basic extraction
xfetch https://x.com/user/status/123

# Pretty-printed output
xfetch --pretty https://x.com/user/status/123

# Skip thread loading (faster)
xfetch --no-scroll https://x.com/user/status/123

# Custom timeout
xfetch --timeout 60000 https://x.com/user/status/123
```

**Programmatic:**
```typescript
import { fetchPost } from '@rezzed.ai/xfetch';

const post = await fetchPost('https://x.com/user/status/123456789');
console.log(post.text);
console.log(post.metrics.likes);

// With options
const post = await fetchPost('https://x.com/user/status/123', {
  timeout: 60000,
  scroll: false,  // Skip thread loading
  headless: true  // Run browser in background
});
```

## CLI Reference

| Flag | Default | Description |
|------|---------|-------------|
| `--pretty` | `false` | Pretty-print JSON output |
| `--timeout N` | `30000` | Page load timeout in milliseconds |
| `--no-scroll` | `false` | Skip scrolling (faster, may miss thread content) |
| `-h, --help` | — | Show help message |

## Programmatic API

```typescript
import { fetchPost, PostData, FetchOptions } from '@rezzed.ai/xfetch';

// Main function
async function fetchPost(
  url: string,
  options?: FetchOptions
): Promise<PostData>

// Options
interface FetchOptions {
  timeout?: number;    // default: 30000ms
  headless?: boolean;  // default: true
  scroll?: boolean;    // default: true (load thread content)
}
```

**Examples:**
```typescript
// Extract with default settings
const post = await fetchPost('https://x.com/user/status/123');

// Custom timeout, skip thread
const post = await fetchPost('https://x.com/user/status/123', {
  timeout: 60000,
  scroll: false
});

// Visible browser (for debugging)
const post = await fetchPost('https://x.com/user/status/123', {
  headless: false
});
```

## Output Format

```typescript
interface PostData {
  url: string;            // Original post URL
  platform: "twitter";    // Platform identifier
  author: string;         // Display name
  handle: string;         // @username
  text: string;           // Full post text
  metrics: {
    replies: string | null;
    reposts: string | null;
    likes: string | null;
    views: string | null;
    bookmarks: string | null;
  };
  images: string[];       // Alt text for images
  timestamp: string | null;
  thread: Array<{         // Thread replies
    author: string;
    handle: string;
    text: string;
    metrics: PostMetrics;
  }>;
}
```

**Example output:**
```json
{
  "url": "https://x.com/user/status/123",
  "platform": "twitter",
  "author": "John Doe",
  "handle": "@johndoe",
  "text": "Just shipped a new feature!",
  "metrics": {
    "replies": "42",
    "reposts": "18",
    "likes": "156",
    "views": "3.2K",
    "bookmarks": "7"
  },
  "images": ["Screenshot of new feature"],
  "timestamp": "2:30 PM · Feb 15, 2026",
  "thread": []
}
```

| Property | Type | Notes |
|----------|------|-------|
| **Runtime** | Playwright + Chromium | Full JavaScript rendering |
| **Dependencies** | `playwright` | Auto-installs browser binaries |
| **Timeout** | 30 seconds (default) | Configurable via `--timeout` or options |
| **Thread Loading** | 5 scroll passes | Can be disabled with `--no-scroll` |
| **User-Agent** | Custom Mozilla/5.0 | Avoids bot detection |
| **Error Handling** | Graceful browser cleanup | Ensures no orphaned processes |

## Why Not...?

**Twitter API?** Costs $100/month for basic access, requires OAuth setup, has strict rate limits, and needs ongoing key management. xfetch works immediately with zero configuration.

**Web scraping with cheerio/axios?** Twitter serves a skeleton HTML shell — all content loads via JavaScript. Static scrapers see empty `<div>` tags. xfetch uses Playwright to render the full page just like a real browser.

**Manual copy-paste?** Doesn't scale. xfetch extracts structured data from hundreds of posts in minutes, ready for analysis or archival.

**Browser DevTools?** Works for one-off tasks, but xfetch is scriptable, CI-friendly, and outputs clean JSON instead of raw HTML.

## What's Next?

More tools coming from the @rezzed.ai toolkit. See [rezzed.ai](https://rezzed.ai) for updates.

Turn social media monitoring from a manual chore into an autonomous workflow.

## License

MIT

---

Built by [Rezzed.ai](https://rezzed.ai)
