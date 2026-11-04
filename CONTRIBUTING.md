# Contributing to mock-drop

Thank you for your interest in contributing to mock-drop! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

New to open source? Welcome! We're excited to have you. Here's how to get started:

### For First-Time Contributors

1. **Read this document** - It contains everything you need to know
2. **Check existing issues** - Look for issues labeled `good first issue`
3. **Ask questions** - If you're unsure about anything, open an issue with the `question` label
4. **Start small** - Begin with documentation updates or simple bug fixes

### Finding Issues to Work On

- **Good First Issues**: Look for issues labeled [`good first issue`](https://github.com/alexdev-dot/mock-drop/labels/good%20first%20issue) - these are perfect for newcomers
- **Help Wanted**: Issues labeled [`help wanted`](https://github.com/alexdev-dot/mock-drop/labels/help%20wanted) need community help
- **Feature Requests**: Check [`enhancement`](https://github.com/alexdev-dot/mock-drop/labels/enhancement) labeled issues for new features
- **Bug Reports**: Help fix issues labeled [`bug`](https://github.com/alexdev-dot/mock-drop/labels/bug)

### Claiming an Issue

Before you start working on an issue:
1. Comment on the issue to let us know you're working on it
2. We'll assign the issue to you
3. If you don't make progress within 7 days, we may reassign it

### Contribution Ideas

Looking for something to work on? Here are some ideas:

**Beginner-Friendly:**
- Improve documentation or add examples
- Fix typos or grammar errors
- Add more test cases
- Create additional example JSON files

**Intermediate:**
- Implement a new feature from the roadmap
- Fix a reported bug
- Improve error messages
- Add performance optimizations

**Advanced:**
- Refactor code for better maintainability
- Add TypeScript definitions
- Create a plugin system
- Implement persistent storage options

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When creating a bug report, include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, mock-drop version)
- Relevant code snippets or JSON files

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
- Use a clear and descriptive title
- Provide a detailed description of the enhancement
- Explain why this enhancement would be useful
- Provide examples of how the enhancement would be used

### Pull Requests

1. Fork the repository
2. Create a branch for your feature or bugfix
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Update documentation if needed
7. Submit a pull request with a clear description

## Development Setup

### Prerequisites

- Node.js v18.0.0 or higher
- npm v6.0.0 or higher

### Cross-Platform Development

mock-drop is designed to work seamlessly across Windows, Linux, and macOS. When contributing, keep these cross-platform considerations in mind:

**Path Handling:**
- Always use Node.js's `path` module for path operations
- Use `path.join()` or `path.resolve()` instead of string concatenation
- Never hardcode path separators (`/` or `\`) - use `path.sep` if needed
- The codebase already uses `path.resolve()` in `json-loader.js` and `file-watcher.js`

**Signal Handling:**
- The tool handles both `SIGINT` (Ctrl+C) and `SIGTERM` signals
- `SIGINT` works on all platforms
- `SIGTERM` is primarily for Unix/Linux/macOS and is safely ignored on Windows
- See `server-manager.js` for the implementation

**File System Operations:**
- Use Node.js's `fs` module which is cross-platform
- File watcher uses `chokidar` which handles platform differences automatically
- Executable permissions are set via a postinstall script (safe on Windows)

**Terminal Emojis:**
- The logger automatically detects terminal emoji support
- Fallbacks to text symbols on terminals that don't support emojis
- Windows Command Prompt uses text fallbacks by default
- Windows Terminal and PowerShell may support emojis

**Testing on Multiple Platforms:**
- When possible, test your changes on multiple operating systems
- At minimum, ensure code doesn't break on Windows (common pain point)
- GitHub Actions CI tests on multiple platforms automatically

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alexdev-dot/mock-drop.git
cd mock-drop
```

2. Install dependencies:
```bash
npm install
```

3. Link the package locally for testing:
```bash
npm link
```

**Platform-Specific Notes:**

**Windows:**
- Works with CMD, PowerShell, and Git Bash
- No additional setup required
- Executable permissions are not needed on Windows

**Linux/macOS:**
- The postinstall script automatically sets executable permissions
- If you encounter permission errors, manually run: `chmod +x bin/mock-drop.js`
- On some systems, you may need to use `sudo npm link` if npm is configured globally

### Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Development Workflow

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bugfix-name
```

2. Make your changes

3. Run tests locally:
```bash
npm test
```

4. Check test coverage:
```bash
npm run test:coverage
```

5. Test your changes manually:
```bash
npm link
mock-drop examples/basic.json
```

6. Commit your changes with a clear message:
```bash
git commit -m "Add: feature description"
```

7. Push to your fork:
```bash
git push origin feature/your-feature-name
```

8. Create a pull request

### Best Practices

- **Keep PRs focused**: One PR should address one issue or feature
- **Write descriptive commit messages**: Follow the commit message guidelines
- **Update tests**: Ensure test coverage doesn't decrease
- **Document changes**: Update README, docs, or comments as needed
- **Be responsive**: Address review feedback promptly

## Coding Standards

### Code Style

- Use clear, descriptive variable and function names
- Keep functions small and focused
- Follow existing code patterns
- Add comments for complex logic
- Maintain separation of concerns

### File Organization

- Place code in the appropriate `src/` subdirectory
- Use the existing module structure
- Don't create unnecessary abstractions
- Keep related functionality together

### Testing

- Write tests for new features
- Ensure existing tests still pass
- Test edge cases
- Maintain test coverage (aim for 70%+)
- Use descriptive test names
- Follow the existing test structure

### Test Structure

Tests are organized in the `test/` directory:
- `test/cli.test.js` - CLI argument parsing and validation
- `test/server.test.js` - Server startup and endpoint handling
- `test/utils.test.js` - Utility function tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Guidelines

- **Unit tests**: Test individual functions and modules
- **Integration tests**: Test interactions between components
- **API tests**: Use Supertest to test HTTP endpoints
- **Coverage**: Maintain at least 70% code coverage
- **Edge cases**: Test error conditions, empty inputs, null values
- **Cross-platform**: Ensure tests pass on Windows, Linux, and macOS (verified via CI)

### Documentation

- Update README.md for user-facing changes
- Update docs/ for architecture changes
- Add inline comments for complex code
- Keep documentation in sync with code

## Project Structure

```
mock-drop/
├── src/
│ ├── cli/          # Command-line interface (argument parsing, validation)
│ ├── server/       # Server management (Express setup, DataStore)
│ ├── routes/       # Route handlers (collection, resource, nested)
│ ├── middleware/   # Express middleware (CORS, logging, error handling)
│ └── utils/        # Utility functions (file operations, helpers)
├── test/           # Test files (Jest + Supertest)
├── examples/       # Example JSON files for testing
├── docs/           # Documentation (getting-started, configuration, API)
├── bin/            # CLI executable entry point
└── .github/        # GitHub configuration (workflows, issue templates)
```

### Key Components

- **cli/**: Handles command-line argument parsing and validation
- **server/**: Manages Express server lifecycle and DataStore
- **routes/**: Defines RESTful route handlers for different resource types
- **middleware/**: Provides reusable Express middleware functions
- **utils/**: Contains helper functions for file operations and data manipulation

### Architecture Overview

The project follows a modular architecture with clear separation of concerns:

1. **CLI Layer** (`src/cli/`) - Parses command-line arguments
2. **Server Layer** (`src/server/`) - Manages Express server and data storage
3. **Route Layer** (`src/routes/`) - Handles HTTP requests and responses
4. **Middleware Layer** (`src/middleware/`) - Cross-cutting concerns (CORS, logging)
5. **Utility Layer** (`src/utils/`) - Reusable helper functions

For detailed architecture information, see [docs/architecture.md](docs/architecture.md).

## Commit Message Guidelines

Use clear, descriptive commit messages:

```
Add: feature description
Fix: bug description
Update: documentation update
Refactor: code refactoring
Test: add/update tests
Docs: documentation changes
```

Examples:
- `Add: support for custom response headers`
- `Fix: handle empty arrays in nested routes`
- `Update: README with new installation instructions`
- `Refactor: extract query filtering logic`

## Pull Request Guidelines

### Before Submitting

- Ensure all tests pass
- Update documentation if needed
- Follow the code style guidelines
- Add tests for new functionality
- Check for spelling and grammar errors
- Rebase your branch on the latest main

### Code Review Process

1. **Automated Checks**: CI will run tests and coverage checks
2. **Peer Review**: At least one maintainer will review your PR
3. **Feedback**: Address review comments in a timely manner
4. **Approval**: Once approved, a maintainer will merge

### What Reviewers Look For

- Code follows project conventions
- Tests are comprehensive and pass
- Documentation is updated
- No breaking changes (or they're documented)
- Performance considerations addressed
- Security implications considered

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Release Process

Releases are managed by maintainers:
1. Update version in package.json
2. Update CHANGELOG.md
3. Create a git tag
4. Publish to npm
5. Create GitHub release

## Communication

### Where to Ask Questions

- **GitHub Issues**: Use the `question` label for general questions
- **Discussions**: Join our GitHub Discussions for community conversations
- **Pull Requests**: Use PR comments for code-specific questions

### Reporting Security Issues

**Do NOT** open a public issue for security vulnerabilities. Instead:
- Email: security@mock-drop.dev
- Or use GitHub's private vulnerability reporting feature
- See [SECURITY.md](SECURITY.md) for details

## Recognition

We value all contributions! Contributors will be:
- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Recognized in the annual project update

## Additional Resources

- [Project Roadmap](README.md#roadmap) - See what we're planning
- [Documentation](docs/) - Detailed project documentation
- [Architecture](docs/architecture.md) - Understand the codebase structure
- [Security Policy](SECURITY.md) - Security guidelines and reporting

## Staying Informed

- **Watch the repository** to get notified of new releases and discussions
- **Join discussions** to participate in community conversations
- **Follow the changelog** to stay updated on new features

## Getting Help

If you need help:
- Check existing issues and discussions
- Read the documentation in the `docs/` directory
- Ask questions in an issue (label with `question`)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
