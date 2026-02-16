const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { parseMetrics } = require("../dist/extractors/twitter.js");

describe("parseMetrics", () => {
  it("parses full metrics array", () => {
    const result = parseMetrics(["42", "10", "500", "12K", "5"]);
    assert.deepStrictEqual(result, {
      replies: "42",
      reposts: "10",
      likes: "500",
      views: "12K",
      bookmarks: "5"
    });
  });

  it("handles empty array", () => {
    const result = parseMetrics([]);
    assert.deepStrictEqual(result, {
      replies: null,
      reposts: null,
      likes: null,
      views: null,
      bookmarks: null
    });
  });

  it("handles partial array", () => {
    const result = parseMetrics(["1", "2"]);
    assert.deepStrictEqual(result, {
      replies: "1",
      reposts: "2",
      likes: null,
      views: null,
      bookmarks: null
    });
  });

  it("handles single element array", () => {
    const result = parseMetrics(["99"]);
    assert.deepStrictEqual(result, {
      replies: "99",
      reposts: null,
      likes: null,
      views: null,
      bookmarks: null
    });
  });
});
