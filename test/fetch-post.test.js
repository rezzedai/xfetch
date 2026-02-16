const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { fetchPost } = require("../dist/index.js");

describe("fetchPost", () => {
  it("throws for unsupported platform (facebook)", async () => {
    await assert.rejects(
      () => fetchPost("https://facebook.com/post/123"),
      { message: /Unsupported platform/ }
    );
  });

  it("includes hostname in unsupported platform error", async () => {
    await assert.rejects(
      () => fetchPost("https://github.com/user"),
      { message: /github\.com/ }
    );
  });

  it("throws for invalid URL", () => {
    assert.throws(() => {
      new URL("not-a-url");
    }, Error);
  });
});
