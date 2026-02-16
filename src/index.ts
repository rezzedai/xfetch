import { extractTwitterPost } from "./extractors/twitter";
import type { PostData, FetchOptions } from "./types";

export type { PostData, PostMetrics, ThreadPost, FetchOptions } from "./types";

export function detectPlatform(url: string): "twitter" | null {
  const host = new URL(url).hostname.replace("www.", "");
  if (host === "x.com" || host === "twitter.com") return "twitter";
  return null;
}

export async function fetchPost(
  url: string,
  options: FetchOptions = {}
): Promise<PostData> {
  const platform = detectPlatform(url);

  if (!platform) {
    throw new Error(
      `Unsupported platform: ${new URL(url).hostname}. Supported: x.com, twitter.com`
    );
  }

  return extractTwitterPost(url, options);
}
