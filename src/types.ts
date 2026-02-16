export interface PostData {
  url: string;
  platform: "twitter";
  author: string;
  handle: string;
  text: string;
  metrics: PostMetrics;
  images: string[];
  timestamp: string | null;
  thread: ThreadPost[];
}

export interface ThreadPost {
  author: string;
  handle: string;
  text: string;
  metrics: PostMetrics;
}

export interface PostMetrics {
  replies: string | null;
  reposts: string | null;
  likes: string | null;
  views: string | null;
  bookmarks: string | null;
}

export interface FetchOptions {
  timeout?: number;
  headless?: boolean;
  scroll?: boolean;
}
