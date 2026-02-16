#!/usr/bin/env node

import { fetchPost } from "./index";

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: xfetch <url> [options]");
    console.log("");
    console.log("Options:");
    console.log("  --pretty     Pretty-print JSON output");
    console.log("  --timeout N  Set page load timeout in ms (default: 30000)");
    console.log("  --no-scroll  Skip scrolling (faster, may miss thread)");
    console.log("  -h, --help   Show this help message");
    process.exit(0);
  }

  const url = args[0]!;
  const pretty = args.includes("--pretty");
  const noScroll = args.includes("--no-scroll");

  let timeout = 30000;
  const timeoutIdx = args.indexOf("--timeout");
  if (timeoutIdx !== -1 && args[timeoutIdx + 1]) {
    timeout = parseInt(args[timeoutIdx + 1], 10);
    if (isNaN(timeout)) {
      console.error("Error: --timeout requires a number");
      process.exit(1);
    }
  }

  try {
    const result = await fetchPost(url, {
      timeout,
      scroll: !noScroll,
    });

    const output = pretty
      ? JSON.stringify(result, null, 2)
      : JSON.stringify(result);
    console.log(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
