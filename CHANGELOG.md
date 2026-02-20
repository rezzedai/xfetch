# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-02-20

### Added
- Initial release
- Twitter/X post extraction via Playwright browser automation
- CLI with flags: `--pretty`, `--timeout`, `--no-scroll`
- Programmatic API with TypeScript definitions
- Thread content extraction with scroll support
- Image alt text capture
- Engagement metrics (replies, reposts, likes, views, bookmarks)
- Custom user-agent to avoid bot detection
- Graceful browser cleanup on errors
- Support for both x.com and twitter.com URLs
- Comprehensive test suite and CI workflow
- Arsenal pre-commit hook for public repo safety
- MIT LICENSE

### Changed
- Updated npm scope from `@rezzedai` to `@rezzed.ai`
- Sanitized README to remove internal references

### Fixed
- N/A (initial release)

[0.1.0]: https://github.com/rezzedai/xfetch/releases/tag/v0.1.0
