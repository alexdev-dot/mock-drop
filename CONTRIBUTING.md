# Contributing to mock-drop

Thank you for your interest in contributing to mock-drop! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

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

- Node.js v14.0.0 or higher
- npm v6.0.0 or higher

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

3. Run tests:
```bash
npm test
```

4. Commit your changes with a clear message:
```bash
git commit -m "Add feature: description of changes"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

6. Create a pull request

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
- Maintain test coverage

### Documentation

- Update README.md for user-facing changes
- Update docs/ for architecture changes
- Add inline comments for complex code
- Keep documentation in sync with code

## Project Structure

```
mock-drop/
├── src/
│ ├── cli/          # Command-line interface
│ ├── server/       # Server management
│ ├── routes/       # Route handlers
│ ├── middleware/   # Express middleware
│ └── utils/        # Utility functions
├── test/           # Test files
├── examples/       # Example JSON files
├── docs/           # Documentation
└── bin/            # CLI executable
```

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

## Getting Help

If you need help:
- Check existing issues and discussions
- Read the documentation in the `docs/` directory
- Ask questions in an issue (label with `question`)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
