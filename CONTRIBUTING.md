# Contributing to xfetch

We welcome contributions to make xfetch more useful for social media content extraction.

## Setup

1. **Clone the repo**

```bash
git clone https://github.com/rezzedai/xfetch.git
cd xfetch
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npx playwright install chromium
```

4. **Build**

```bash
npm run build
```

## Testing

Run the test suite:

```bash
npm test
```

Tests live in `test/` and use Node.js native test runner.

## Making Changes

1. **Create a branch**

```bash
git checkout -b feat/your-feature
```

2. **Make your changes**

- Add tests for new features
- Update README.md if adding CLI options or changing API
- Follow existing code style (TypeScript, Playwright)
- Ensure browser cleanup happens in all code paths (avoid orphaned processes)

3. **Test your changes**

```bash
npm test
```

4. **Commit with clear messages**

```bash
git commit -m "feat: add X" # or fix: / docs: / test: / chore:
```

## Pull Requests

1. Push your branch:

```bash
git push origin feat/your-feature
```

2. Open a PR on GitHub

3. Describe what changed and why

4. Wait for CI to pass

We review PRs within a few days.

## Adding Platform Support

When adding support for a new social media platform:

- Create a new extractor in `src/extractors/`
- Add platform detection logic in `src/utils/detect-platform.ts`
- Export the extractor in `src/index.ts`
- Add test cases in `test/`
- Document in README.md with usage examples

Current extractors:
- `twitter.ts` — Twitter/X posts

## License

By contributing, you agree your contributions will be licensed under MIT.
