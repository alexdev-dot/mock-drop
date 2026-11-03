---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
Steps to reproduce the behavior:
1. Run `mock-drop <your-file.json>` with the following command:
   ```bash
   mock-drop your-file.json
   ```
2. Go to endpoint '...'
3. Click on '....'
4. Scroll down to '....'
5. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
What actually happened? Include error messages, stack traces, or unexpected output.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
Please complete the following information:
 - **OS**: [e.g. Windows 11, macOS 14, Ubuntu 22.04]
 - **Node.js version**: [e.g. 20.0.0] (run `node --version`)
 - **npm version**: [e.g. 10.0.0] (run `npm --version`)
 - **mock-drop version**: [e.g. 1.5.0] (run `mock-drop --version`)

## JSON File (if applicable)
If the bug is related to a specific JSON file structure, please provide a sanitized version:
```json
{
  "your": "data"
}
```

## Command Used
What command did you run? Include any flags:
```bash
mock-drop your-file.json --port 3000 --delay 500
```

## Logs/Error Messages
Include any relevant console output or error messages:
```
Paste logs here
```

## Additional Context
Add any other context about the problem here:
- When did this start happening?
- Does it happen consistently or intermittently?
- What workarounds have you tried?
- Any other relevant information

## Priority
How severe is this bug?
- [ ] Critical - blocks usage or causes data loss
- [ ] High - significantly impacts functionality
- [ ] Medium - workaround available
- [ ] Low - minor inconvenience
