# Security Policy

## Supported Versions

Security updates are provided for the following versions:

| Version | Supported |
|---------|-----------|
| 1.5.x   | ✅ Yes    |
| 1.4.x   | ✅ Yes    |
| < 1.4.0 | ❌ No     |

## Reporting a Vulnerability

If you discover a security vulnerability in mock-drop, please report it responsibly.

### How to Report

**Do NOT** open a public issue for security vulnerabilities.

Instead, please send an email to:

- **Email**: security@mock-drop.dev
- **Subject**: [Security] Vulnerability Report

Alternatively, you can use GitHub's private vulnerability reporting feature by clicking "Report a vulnerability" in the repository.

### What to Include

Please include as much of the following information as possible:

- A description of the vulnerability
- Steps to reproduce the issue
- Affected versions
- Potential impact
- Any proof-of-concept code or screenshots (if applicable)
- Your proposed fix (if you have one)

### Response Timeline

We aim to respond to security reports within:

- **48 hours**: Initial acknowledgment
- **7 days**: Assessment and triage
- **30 days**: Patch release (for critical vulnerabilities)

### Disclosure Policy

Once a vulnerability is fixed:

1. We will release a security patch as soon as possible
2. We will announce the fix in the release notes
3. We may publish a security advisory on GitHub
4. We will credit the reporter (unless you wish to remain anonymous)

### Best Practices for Users

To keep your mock-drop installation secure:

- **Use in development only**: mock-drop is designed for development and prototyping, not production
- **Don't expose publicly**: Avoid running mock-drop on public-facing servers
- **Keep dependencies updated**: Regularly update to the latest version
- **Review network access**: Use firewalls or VPNs to restrict access when needed
- **Monitor access logs**: Be aware of who is accessing your mock APIs

### Security Features

mock-drop includes the following security features:

- **CORS enabled**: Cross-origin requests are allowed by default (configure as needed)
- **No authentication**: Intentionally simple for development (add reverse proxy for auth in production)
- **In-memory storage**: No persistent data storage reduces attack surface
- **Minimal dependencies**: Fewer dependencies mean fewer potential vulnerabilities

### Dependencies

We regularly audit and update dependencies. Automated security updates are enabled via Dependabot.

## Receiving Security Updates

To receive security updates:

- Watch the GitHub repository for releases
- Subscribe to security advisories on GitHub
- Check the [CHANGELOG.md](CHANGELOG.md) for security-related updates

## Security Contact

For security-related questions that are not vulnerability reports, please open a GitHub issue with the `security` label.
