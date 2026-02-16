const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const path = require("node:path");

const exec = promisify(execFile);
const CLI = path.join(__dirname, "..", "dist", "cli.js");

describe("CLI", () => {
  it("shows help with no args", async () => {
    const { stdout } = await exec("node", [CLI]);
    assert.match(stdout, /Usage: xfetch/);
  });

  it("shows help with --help", async () => {
    const { stdout } = await exec("node", [CLI, "--help"]);
    assert.match(stdout, /Usage: xfetch/);
  });

  it("shows help with -h", async () => {
    const { stdout } = await exec("node", [CLI, "-h"]);
    assert.match(stdout, /Usage: xfetch/);
  });

  it("exits with error for invalid --timeout value", async () => {
    await assert.rejects(
      () => exec("node", [CLI, "https://x.com/test/status/1", "--timeout", "abc"]),
      (error) => {
        return error.stderr && error.stderr.includes("--timeout requires a number");
      }
    );
  });

  it("help includes --pretty option", async () => {
    const { stdout } = await exec("node", [CLI, "--help"]);
    assert.match(stdout, /--pretty/);
  });

  it("help includes --no-scroll option", async () => {
    const { stdout } = await exec("node", [CLI, "--help"]);
    assert.match(stdout, /--no-scroll/);
  });
});
