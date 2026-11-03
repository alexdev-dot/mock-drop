# mock-drop

[![npm version](https://badge.fury.io/js/%40alex_developer%2Fmock-drop.svg)](https://www.npmjs.com/package/@alex_developer/mock-drop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/%40alex_developer%2Fmock-drop.svg)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/alexdev-dot/mock-drop?style=social)](https://github.com/alexdev-dot/mock-drop/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/alexdev-dot/mock-drop)](https://github.com/alexdev-dot/mock-drop/issues)

---

**mock-drop** is a zero-configuration CLI tool that instantly transforms any local JSON file into a fully functional REST API server on `localhost`.

Designed for frontend developers who need to prototype interfaces without waiting for backend teams or managing complex configurations. Simply drop a JSON file, run one command, and start building.

## Why mock-drop?

- ⚡ **Speed**: Get a REST API running in seconds
- 🎯 **Simplicity**: No configuration files, no databases, no setup
- �️ **Flexibility**: Works with any JSON structure
- 🔗 **Universal**: Language-agnostic - use with any tech stack
- 📦 **Lightweight**: Minimal dependencies, fast to install
- 🔄 **Auto-reload**: Changes to your JSON file reflect instantly

[View on GitHub](https://github.com/alexdev-dot/mock-drop) | [Report Issues](https://github.com/alexdev-dot/mock-drop/issues)

---

## Table of Contents

- [Features](#features)
- [Language Support](#language-support)
- [Comparison](#comparison)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Examples](#examples)
- [Documentation](#documentation)
- [Configuration](#configuration)
- [FAQ](#faq)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Zero Configuration** – No databases, no complex UIs. Point to a JSON file and go.
- **Auto-Reloading** – Watch your JSON file for changes; updates are live instantly without restarting the server.
- **Custom Ports** – Avoid port conflicts easily using the `--port` flag.
- **Response Delay** – Simulate slow network conditions with the `--delay` flag for testing loading states.
- **Query Filtering** – Filter data using query parameters (e.g., `/users?name=Alice&age=25`).
- **Nested Routes** – Support for nested resources (e.g., `/users/1/posts`).
- **Lightweight** – Minimal dependencies for fast installation and execution.
- **Full CRUD Support** – GET, POST, PUT, and DELETE endpoints with in-memory persistence.
- **CORS Enabled** – Access your API from any origin or port.

---

## Language Support

mock-drop is language-agnostic! Since it creates a standard REST API that returns JSON, it can be used by **any programming language** that can make HTTP requests.

### Supported Languages/Frameworks

**Frontend/Web:**
- JavaScript/TypeScript (React, Vue, Angular, vanilla JS)
- HTML/CSS (via fetch API)

**Backend:**
- Python (requests, httpx, Flask, Django)
- Java (HttpClient, Spring, OkHttp)
- C#/.NET (HttpClient, ASP.NET)
- Go (net/http)
- Ruby (Net::HTTP, Rails)
- PHP (cURL, Guzzle)
- Rust (reqwest, actix-web)
- Node.js (axios, fetch, node-fetch)

**Mobile:**
- Swift (iOS - URLSession)
- Kotlin (Android - Retrofit, OkHttp)
- Flutter/Dart (http package)
- React Native (fetch, axios)

**Testing Tools:**
- Postman
- Insomnia
- curl
- wget

### Usage Examples

**JavaScript/TypeScript:**
```javascript
fetch('http://localhost:3000/users')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Python:**
```python
import requests
response = requests.get('http://localhost:3000/users')
print(response.json())
```

**Java:**
```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("http://localhost:3000/users"))
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
```

**Go:**
```go
resp, _ := http.Get("http://localhost:3000/users")
body, _ := ioutil.ReadAll(resp.Body)
fmt.Println(string(body))
```

**C#:**
```csharp
using (var client = new HttpClient())
{
    var response = await client.GetStringAsync("http://localhost:3000/users");
    Console.WriteLine(response);
}
```

---

## Comparison

### mock-drop vs json-server

| Feature | mock-drop | json-server |
|---------|-----------|-------------|
| Zero Configuration | ✓ True | ± Requires CLI arguments |
| Auto-Reloading | ✓ Built-in | ✓ Built-in |
| Query Filtering | ✓ Full support | ✓ Full support |
| Nested Routes | ✓ Supported | ± Limited |
| Custom Ports | ✓ Simple flag | ✓ Available |
| Response Delay | ✓ Built-in flag | ✗ Requires middleware |
| CORS | ✓ Enabled by default | ✓ Available |
| Package Size | ✓ Lightweight | ± Larger |
| Learning Curve | ✓ Minimal | ± Moderate |

**Why choose mock-drop?**
- Simpler, more intuitive command-line interface
- Built-in delay simulation for testing loading states
- Better nested route support out of the box
- Focused on the most common use cases without unnecessary complexity

---

## Prerequisites

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher

---

## Installation

Install globally via npm:

```bash
npm install -g @alex_developer/mock-drop
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
✓ mock-drop is running!
 Watching db.json for updates...

Endpoints available:
➜ http://localhost:3000/users
➜ http://localhost:3000/posts

Press Ctrl+C to stop.
```

### 3. Access Your API

Open your browser or use a tool like `curl` to access your endpoints:

```bash
# Get all users
curl http://localhost:3000/users

# Filter users by name
curl http://localhost:3000/users?name=Alice

# Filter by multiple parameters
curl http://localhost:3000/users?name=Alice&age=25
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
| `--delay <milliseconds>` | Add artificial delay to all responses | `0` |
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

Add delay to simulate slow network:

```bash
mock-drop db.json --delay 500
```

Combine port and delay:

```bash
mock-drop db.json --port 8080 --delay 1000
```

---

## API Endpoints

Given the example `db.json` above, the following endpoints are automatically generated:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Retrieve all users |
| `GET` | `/users/:id` | Retrieve a specific user by ID |
| `POST` | `/users` | Create a new user (auto-increments ID) |
| `PUT` | `/users/:id` | Update a user by ID |
| `DELETE` | `/users/:id` | Delete a user by ID |
| `GET` | `/posts` | Retrieve all posts |
| `GET` | `/posts/:id` | Retrieve a specific post by ID |
| `POST` | `/posts` | Create a new post (auto-increments ID) |
| `PUT` | `/posts/:id` | Update a post by ID |
| `DELETE` | `/posts/:id` | Delete a post by ID |

All endpoints return JSON responses based on your data structure.

### Query Parameter Filtering

You can filter results using query parameters on any `GET` endpoint:

```bash
# Filter by a single field
GET /users?name=Alice

# Filter by multiple fields (AND logic)
GET /users?name=Alice&age=25

# Filter by number fields
GET /users?age=30

# Filter by boolean fields
GET /users?active=true
GET /posts?published=false
```

**Filtering behavior:**
- String comparison is case-insensitive
- Numbers are compared numerically
- Booleans accept `true` or `false` (case-insensitive)
- Multiple parameters use AND logic (all must match)
- Returns an empty array if no matches found

### Nested Routes

mock-drop supports nested resources for complex data structures. If your JSON data contains nested arrays, you can access them via nested routes.

Given this JSON structure:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "posts": [
        { "id": 1, "title": "Alice's Post 1" },
        { "id": 2, "title": "Alice's Post 2" }
      ]
    }
  ]
}
```

You can access nested resources with these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/:id/posts` | Get all posts for a specific user |
| `GET` | `/users/:id/posts/:postId` | Get a specific post for a user |
| `POST` | `/users/:id/posts` | Create a new post for a user |
| `PUT` | `/users/:id/posts/:postId` | Update a post for a user |
| `DELETE` | `/users/:id/posts/:postId` | Delete a post for a user |

**Examples:**

```bash
# Get all posts for user 1
GET /users/1/posts

# Get a specific post
GET /users/1/posts/1

# Create a new post for user 1
POST /users/1/posts
Body: { "title": "New Post", "published": true }

# Update a post
PUT /users/1/posts/1
Body: { "title": "Updated Title" }

# Delete a post
DELETE /users/1/posts/1

# Filter nested posts
GET /users/1/posts?published=true
```

**Nested route behavior:**
- Works with query parameter filtering
- Auto-increments IDs for nested resources
- Full CRUD support on nested arrays
- Returns 404 if parent or nested resource doesn't exist

---

## Examples

Check out the [examples directory](examples/) for sample JSON files:

- [basic.json](examples/basic.json) - Simple flat structure with users, posts, and comments
- [nested.json](examples/nested.json) - Nested structure demonstrating user relationships
- [ecommerce.json](examples/ecommerce.json) - E-commerce example with products, customers, and orders

Run with an example:
```bash
mock-drop examples/basic.json
```

---

## Documentation

For detailed documentation, see:

- [Getting Started](docs/getting-started.md) - Installation and quick start guide
- [Configuration](docs/configuration.md) - Configuration options and best practices
- [API Reference](docs/api-reference.md) - Complete API endpoint documentation
- [Architecture](docs/architecture.md) - Internal architecture and design patterns

---

## Configuration

For detailed configuration options, see the [Configuration documentation](docs/configuration.md).

### Quick Configuration

Your JSON file should use an object format where each key represents an endpoint:

```json
{
  "endpoint-name": [
    { "field": "value" }
  ]
}
```

The server automatically watches your JSON file for changes. When you modify the file, the API endpoints update instantly without requiring a server restart.

---

## FAQ

### Does mock-drop persist data?

No, mock-drop uses in-memory storage. Changes made via POST, PUT, or DELETE will persist as long as the server is running, but will be lost when you restart the server. This is intentional for prototyping and testing purposes.

### Can I use mock-drop in production?

mock-drop is designed for development and prototyping. For production use, consider using a real backend solution or tools like json-server with a database backend.

### How do I handle authentication?

mock-drop does not include authentication features. If you need authentication for your prototype, you can add middleware or use a reverse proxy like nginx.

### Can I use custom routes?

Currently, mock-drop generates routes based on your JSON file structure. Custom route definitions are not supported, but you can structure your JSON to match your desired endpoint names.

### Is there a limit to the size of my JSON file?

There's no hard limit, but extremely large files may affect performance. For optimal performance, keep your mock data under 10MB.

### Can I run multiple mock-drop instances?

Yes! You can run multiple instances on different ports:
```bash
mock-drop users.json --port 3000
mock-drop posts.json --port 3001
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.

---

## Contributing

Contributions are welcome! Whether you want to fix a bug, improve documentation, or suggest a feature, we appreciate your help.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### Roadmap

Looking for a place to start? Check out these planned features:

- [x] Support for `POST`, `PUT`, and `DELETE` requests (in-memory persistence)
- [x] CORS support for cross-origin requests
- [x] Basic test suite with Jest and Supertest
- [x] Add a delay flag (`--delay 500`) to simulate slow networks
- [x] Support for query parameter filtering
- [x] Support for nested routes
- [ ] Generate fake data automatically for empty endpoints

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

4. Run tests:

   ```bash
   npm test
   ```

5. Launch your local build against a test file:

   ```bash
   mock-drop examples/basic.json
   ```

For detailed development guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

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
