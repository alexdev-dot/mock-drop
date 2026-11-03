# mock-drop 💧

[![npm version](https://badge.fury.io/js/mock-drop.svg)](https://www.npmjs.com/package/mock-drop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/mock-drop.svg)](https://nodejs.org)

---

**mock-drop** is a zero-configuration CLI tool that instantly transforms any local JSON file into a fully functional REST API server on `localhost`.

Designed for frontend developers who need to prototype interfaces without waiting for backend teams or managing complex configurations. Simply drop a JSON file, run one command, and start building.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Zero Configuration** – No databases, no complex UIs. Point to a JSON file and go.
- **Auto-Reloading** – Watch your JSON file for changes; updates are live instantly without restarting the server.
- **Custom Ports** – Avoid port conflicts easily using the `--port` flag.
- **Lightweight** – Minimal dependencies for fast installation and execution.

---

## Prerequisites

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher

---

## Installation

Install globally via npm:

```bash
npm install -g mock-drop
```

Verify the installation:

```bash
mock-drop --version
```

---

## Quick Start

### 1. Create a Mock Data File

Create a file named `db.json` in your project directory:

```json
{
  "users": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "posts": [
    { "id": 101, "title": "Hello World" }
  ]
}
```

### 2. Start the Server

Run the tool and point it to your JSON file:

```bash
mock-drop db.json
```

**Expected Output:**

```text
💧 mock-drop is running!
📅 Watching db.json for updates...

Endpoints available:
👉 http://localhost:3000/users
👉 http://localhost:3000/posts

Press Ctrl+C to stop.
```

### 3. Access Your API

Open your browser or use a tool like `curl` to access your endpoints:

```bash
curl http://localhost:3000/users
```

---

## Usage

### Basic Command

```bash
mock-drop <json-file>
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--port <number>` | Specify the port number | `3000` |
| `--help` | Display help information | — |
| `--version` | Display version number | — |

### Examples

Run on a custom port:

```bash
mock-drop db.json --port 8080
```

Use a different JSON file:

```bash
mock-drop data.json --port 4000
```

---

## API Endpoints

Given the example `db.json` above, the following endpoints are automatically generated:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Retrieve all users |
| `GET` | `/posts` | Retrieve all posts |

All endpoints return JSON responses based on your data structure.

---

## Configuration

### JSON File Structure

Your JSON file should use an object format where each key represents an endpoint:

```json
{
  "endpoint-name": [
    { "field": "value" }
  ]
}
```

### File Watching

The server automatically watches your JSON file for changes. When you modify the file, the API endpoints update instantly without requiring a server restart.

---

## Contributing

Contributions are welcome! Whether you want to fix a bug, improve documentation, or suggest a feature, we appreciate your help.

### Roadmap

Looking for a place to start? Check out these planned features:

- [ ] Support for `POST`, `PUT`, and `DELETE` requests (in-memory persistence)
- [ ] Add a delay flag (`--delay 500`) to simulate slow networks
- [ ] Generate fake data automatically for empty endpoints
- [ ] Support for nested routes and query parameters

### Development Setup

1. Fork and clone this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Link the package locally for testing:

   ```bash
   npm link
   ```

4. Run tests or launch your local build against a test file

### Pull Request Guidelines

- Ensure your code follows the existing style
- Write clear commit messages
- Update documentation as needed
- Test your changes thoroughly

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Support

For issues, questions, or suggestions, please open an issue on the project repository.
