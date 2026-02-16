const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { detectPlatform } = require("../dist/index.js");

describe("detectPlatform", () => {
  it("returns 'twitter' for x.com URLs", () => {
    assert.strictEqual(detectPlatform("https://x.com/user/status/123"), "twitter");
  });

  it("returns 'twitter' for twitter.com URLs", () => {
    assert.strictEqual(detectPlatform("https://twitter.com/user/status/123"), "twitter");
  });

  it("returns 'twitter' for www.x.com URLs", () => {
    assert.strictEqual(detectPlatform("https://www.x.com/user/status/123"), "twitter");
  });

  it("returns 'twitter' for www.twitter.com URLs", () => {
    assert.strictEqual(detectPlatform("https://www.twitter.com/user/status/456"), "twitter");
  });

  it("returns null for github.com URLs", () => {
    assert.strictEqual(detectPlatform("https://github.com/user"), null);
  });

  it("returns null for example.com URLs", () => {
    assert.strictEqual(detectPlatform("https://example.com"), null);
  });

  it("returns null for facebook.com URLs", () => {
    assert.strictEqual(detectPlatform("https://facebook.com/post/123"), null);
  });

  it("throws for invalid URLs", () => {
    assert.throws(() => {
      detectPlatform("not-a-url");
    }, Error);
  });
});
