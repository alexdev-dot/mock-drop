# Configuration

mock-drop is designed to work with zero configuration, but it offers several options to customize its behavior.

## Command-Line Options

### Basic Usage

```bash
mock-drop <json-file> [options]
```

### Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--port <number>` | Specify the port number | `3000` | `--port 8080` |
| `--delay <milliseconds>` | Add artificial delay to all responses | `0` | `--delay 500` |
| `--help` | Display help information | — | `--help` |
| `--version` | Display version number | — | `--version` |

## JSON File Structure

Your JSON file should use an object format where each key represents an endpoint:

```json
{
  "endpoint-name": [
    { "field": "value" }
  ]
}
```

### Example: Basic Structure

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

This creates:
- `GET /users` - Returns all users
- `GET /users/:id` - Returns a specific user
- `POST /users` - Creates a new user
- `PUT /users/:id` - Updates a user
- `DELETE /users/:id` - Deletes a user
- Same endpoints for `/posts`

### Example: Nested Structure

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "posts": [
        { "id": 1, "title": "Alice's Post" },
        { "id": 2, "title": "Another Post" }
      ]
    }
  ]
}
```

This creates nested endpoints:
- `GET /users/:id/posts` - Get all posts for a user
- `GET /users/:id/posts/:postId` - Get a specific post
- `POST /users/:id/posts` - Create a new post
- `PUT /users/:id/posts/:postId` - Update a post
- `DELETE /users/:id/posts/:postId` - Delete a post

## File Watching

mock-drop automatically watches your JSON file for changes. When you modify the file:

1. The server detects the change
2. The data is reloaded
3. All endpoints are updated instantly
4. No server restart required

**Note:** Changes made via POST, PUT, or DELETE are only stored in memory and will be lost when the server restarts or the file is reloaded.

## Query Parameter Filtering

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
```

**Filtering behavior:**
- String comparison is case-insensitive
- Numbers are compared numerically
- Booleans accept `true` or `false` (case-insensitive)
- Multiple parameters use AND logic (all must match)
- Returns an empty array if no matches found

## Port Configuration

### Default Port

By default, mock-drop runs on port 3000.

### Custom Port

To use a different port:

```bash
mock-drop db.json --port 8080
```

### Port Conflicts

If the specified port is already in use, mock-drop will display an error:

```
❌ Port 8080 is already in use
❌ Try using a different port: mock-drop db.json --port <port>
```

## Response Delay Configuration

### Purpose

Response delay simulates slow network conditions, useful for:
- Testing loading states
- Verifying error handling
- Simulating real-world network latency

### Usage

```bash
mock-drop db.json --delay 500
```

This adds a 500ms delay to all HTTP responses.

### Best Practices

- Use delays in development to test UI loading states
- Set delays to 0 for production-like performance during testing
- Typical delays: 100-1000ms for realistic network simulation

## CORS Configuration

mock-drop has CORS enabled by default, allowing requests from any origin. This means:

- You can access the API from any frontend framework
- No additional CORS configuration needed
- Works with different ports and domains

## Error Handling

mock-drop provides clear error messages for common issues:

### File Not Found
```
❌ File not found: db.json
```

### Invalid JSON
```
❌ Invalid JSON in file: db.json. Unexpected token } in JSON at position 10
```

### Port in Use
```
❌ Port 3000 is already in use
```

### Invalid Port
```
❌ Invalid port number (must be between 1 and 65535)
```

## Environment Variables

Currently, mock-drop does not use environment variables. All configuration is done via command-line arguments.

## Best Practices

1. **Keep JSON files organized**: Use meaningful resource names
2. **Use consistent IDs**: Include `id` fields in all resources
3. **Test with realistic data**: Use sample data that resembles your production data
4. **Version control your JSON files**: Track changes to your mock data
5. **Use file watching**: Take advantage of auto-reload during development
