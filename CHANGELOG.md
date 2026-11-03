# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- SECURITY.md for vulnerability reporting and security best practices
- Dependabot configuration for automated dependency updates
- Test coverage reporting with Codecov integration
- GitHub labels configuration for better issue tracking
- Enhanced issue templates (bug report, feature request, question, documentation)
- Contributor onboarding section in CONTRIBUTING.md
- Code coverage script (npm run test:coverage)
- Jest configuration with coverage thresholds

### Changed
- Fixed Code of Conduct contact method placeholder
- Updated README to include Security section
- Enhanced CONTRIBUTING.md with contributor guidelines and communication channels
- Improved GitHub workflow with coverage reporting

### Fixed
- Enabled request logger middleware in the middleware chain for better request debugging
- Configured NPM_TOKEN for automated npm publishing

## [1.5.0] - 2026-11-03

### Added
- Modular architecture with separation of concerns (cli, server, routes, middleware, utils)
- Comprehensive documentation (Getting Started, Configuration, API Reference, Architecture)
- Contributing guidelines with development setup instructions
- GitHub issue templates (bug report, feature request, question)
- ecommerce.json example file
- Enhanced test suite with CLI and utility function tests
- DataStore class for centralized data management
- Request logger middleware (optional)

### Changed
- Refactored monolithic server.js into focused, single-responsibility modules
- Extracted CLI logic into dedicated cli/ module
- Separated route handlers by type (collection, resource, nested)
- Created reusable middleware with factory pattern
- Updated package.json entry point to src/index.js
- Improved error handling throughout the codebase
- Updated CLI output with styled logging
- All existing functionality preserved and tested

### Fixed
- Added *.tgz to .gitignore to exclude build artifacts
- Removed old lib/ directory after successful migration

## [1.4.0] - 2025-11-03

### Added
- Full CRUD support (POST, PUT, DELETE) with in-memory persistence
- CORS support for cross-origin requests
- Query parameter filtering for GET endpoints
- Response delay simulation via `--delay` flag
- Nested route support for complex data structures
- Basic test suite with Jest and Supertest
- Language-agnostic API - can be used with any programming language

### Changed
- Improved documentation with language support examples
- Added comparison section with json-server
- Added FAQ section
- Added Code of Conduct

## [1.0.0] - 2025-10-XX

### Added
- Initial release
- Zero-configuration REST API from JSON files
- Auto-reloading on file changes
- Custom port support
- GET endpoints for all resources
- Basic filtering support

[1.5.0]: https://github.com/alexdev-dot/mock-drop/releases/tag/v1.5.0
[1.4.0]: https://github.com/alexdev-dot/mock-drop/releases/tag/v1.4.0
[1.0.0]: https://github.com/alexdev-dot/mock-drop/releases/tag/v1.0.0
