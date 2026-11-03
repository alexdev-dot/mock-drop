# Getting Started with mock-drop

This guide will help you get up and running with mock-drop in just a few minutes.

## Installation

### Global Installation

Install mock-drop globally using npm:

```bash
npm install -g @alex_developer/mock-drop
```

Verify the installation:

```bash
mock-drop --version
```

### Local Installation

For development purposes, you can also install it locally in your project:

```bash
npm install @alex_developer/mock-drop
```

Then run it using npx:

```bash
npx mock-drop db.json
```

## Quick Start

### 1. Create a Mock Data File

Create a JSON file named `db.json` in your project directory:

```json
{
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "posts": [
    { "id": 1, "title": "Hello World", "authorId": 1 }
  ]
}
```

### 2. Start the Server

Run mock-drop with your JSON file:

```bash
mock-drop db.json
```

**Expected Output:**

```
✅ Successfully loaded data from db.json

💧 mock-drop is running!
ℹ️  Watching db.json for updates...

Endpoints available:
👉 http://localhost:3000/users (GET, POST, PUT, DELETE)
👉 http://localhost:3000/posts (GET, POST, PUT, DELETE)

Press Ctrl+C to stop.
```

### 3. Access Your API

Your API is now running! You can access it using:

- **Browser**: Open `http://localhost:3000/users`
- **curl**: `curl http://localhost:3000/users`
- **Postman/Insomnia**: Make requests to `http://localhost:3000/users`
- **JavaScript**: `fetch('http://localhost:3000/users')`

## Common Use Cases

### Custom Port

If port 3000 is already in use, specify a different port:

```bash
mock-drop db.json --port 8080
```

### Simulate Network Delay

Test loading states by adding artificial delay:

```bash
mock-drop db.json --delay 500
```

This adds a 500ms delay to all responses.

### Multiple Instances

Run multiple mock-drop instances on different ports:

```bash
# Terminal 1
mock-drop users.json --port 3000

# Terminal 2
mock-drop posts.json --port 3001
```

## Next Steps

- Learn about [Configuration](configuration.md)
- Explore the [API Reference](api-reference.md)
- Understand the [Architecture](architecture.md)
- Check out the [examples](../examples/) directory
