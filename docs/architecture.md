# Architecture

This document describes the internal architecture of mock-drop.

## Overview

mock-drop is built with a modular, maintainable architecture designed for:

- **Separation of concerns**: Each module has a clear, single responsibility
- **Testability**: Components are easily testable in isolation
- **Extensibility**: New features can be added without modifying existing code
- **Performance**: Lightweight and fast startup time

## Directory Structure

```
mock-drop/
├── src/
│ ├── cli/              # Command-line interface
│ │ ├── index.js        # Main CLI entry point
│ │ ├── arguments.js    # Argument parsing and validation
│ │ └── commands.js     # Help and version commands
│ │
│ ├── server/           # Server management
│ │ ├── index.js        # Server entry point
│ │ ├── create-server.js # Express app creation
│ │ └── server-manager.js # Server lifecycle management
│ │
│ ├── routes/           # Route handlers
│ │ ├── index.js        # Route setup orchestration
│ │ ├── collection-routes.js # Collection endpoints (GET, POST)
│ │ ├── resource-routes.js   # Resource endpoints (GET, PUT, DELETE)
│ │ └── nested-routes.js     # Nested resource endpoints
│ │
│ ├── middleware/       # Express middleware
│ │ ├── cors.js         # CORS configuration
│ │ ├── delay.js        # Response delay simulation
│ │ ├── error-handler.js # Centralized error handling
│ │ └── request-logger.js # Request logging (optional)
│ │
│ ├── utils/            # Utility functions
│ │ ├── json-loader.js  # JSON file loading and validation
│ │ ├── file-watcher.js # File change detection
│ │ ├── data-store.js   # In-memory data management
│ │ ├── query-filter.js # Query parameter filtering
│ │ ├── id-generator.js # Auto-incrementing ID generation
│ │ └── logger.js       # Logging utilities
│ │
│ └── index.js          # Main entry point for library usage
│
├── bin/
│ └── mock-drop.js      # CLI executable
│
├── test/               # Test files
├── examples/           # Example JSON files
├── docs/               # Documentation
└── package.json
```

## Module Responsibilities

### CLI (`src/cli/`)

**Responsibilities:**
- Parse command-line arguments
- Validate user input
- Display help and version information
- Coordinate with server module

**Key Functions:**
- `parseArguments()`: Converts CLI args to structured object
- `validateArguments()`: Validates parsed arguments
- `printHelp()`: Displays usage information
- `printVersion()`: Displays version from package.json

**Design Decisions:**
- Separation of parsing and validation for testability
- No business logic in CLI layer
- Delegates all work to server module

### Server (`src/server/`)

**Responsibilities:**
- Create and configure Express application
- Manage server lifecycle (start, stop, error handling)
- Coordinate data loading and file watching
- Handle graceful shutdown

**Key Classes:**
- `ServerManager`: Manages server instance, data store, and file watcher

**Design Decisions:**
- ServerManager encapsulates all server state
- Test mode (port 0) for unit testing without starting actual server
- Centralized error handling for server startup errors

### Routes (`src/routes/`)

**Responsibilities:**
- Define REST API endpoints
- Handle HTTP methods (GET, POST, PUT, DELETE)
- Implement nested route support
- Apply query parameter filtering

**Route Types:**
1. **Collection Routes** (`collection-routes.js`):
   - `GET /:resource` - List all items
   - `POST /:resource` - Create new item

2. **Resource Routes** (`resource-routes.js`):
   - `GET /:resource/:id` - Get single item
   - `PUT /:resource/:id` - Update item
   - `DELETE /:resource/:id` - Delete item

3. **Nested Routes** (`nested-routes.js`):
   - Full CRUD for nested resources
   - Supports arbitrarily deep nesting

**Design Decisions:**
- Routes are pure functions that take app and dataStore
- No direct file I/O in route handlers
- Reusable query filtering logic

### Middleware (`src/middleware/`)

**Responsibilities:**
- Cross-cutting concerns
- Request/response transformation
- Error handling

**Middleware Types:**
1. **CORS** (`cors.js`): Enables cross-origin requests
2. **Delay** (`delay.js`): Simulates network latency
3. **Request Logger** (`request-logger.js`): Logs HTTP requests with method, URL, status, and duration
4. **Error Handler** (`error-handler.js`): Centralized error handling

**Design Decisions:**
- Each middleware is a factory function for configurability
- Error handler placed at end of middleware chain
- CORS applied to all routes by default
- Request logger provides visibility into HTTP requests for debugging

### Utils (`src/utils/`)

**Responsibilities:**
- Reusable utility functions
- No business logic
- Pure functions where possible

**Utilities:**
1. **JSON Loader** (`json-loader.js`):
   - Reads and validates JSON files
   - Returns structured result object

2. **File Watcher** (`file-watcher.js`):
   - Wraps chokidar for file watching
   - Provides callback-based API

3. **Data Store** (`data-store.js`):
   - Encapsulates in-memory data
   - Provides CRUD operations
   - Manages data access patterns

4. **Query Filter** (`query-filter.js`):
   - Filters arrays by query parameters
   - Handles multiple data types (string, number, boolean)

5. **ID Generator** (`id-generator.js`):
   - Auto-increments IDs
   - Handles edge cases (empty arrays, missing IDs)

6. **Logger** (`logger.js`):
   - Provides styled console output
   - Separates logging levels (success, error, info, warning)

**Design Decisions:**
- Pure functions for easy testing
- No side effects where possible
- Clear, descriptive function names

## Data Flow

### Startup Flow

```
CLI Entry Point
    ↓
Parse Arguments
    ↓
Validate Arguments
    ↓
Load JSON File
    ↓
Initialize Data Store
    ↓
Create Express App
    ↓
Apply Middleware
    ↓
Setup Routes
    ↓
Start Server
    ↓
Start File Watcher
    ↓
Register Shutdown Handler
```

### Request Flow

```
HTTP Request
    ↓
CORS Middleware
    ↓
JSON Parser Middleware
    ↓
Delay Middleware (if configured)
    ↓
Route Handler
    ↓
Data Store Operations
    ↓
Response
    ↓
Error Handler (if error)
```

### File Watch Flow

```
File Change Detected
    ↓
Reload JSON File
    ↓
Update Data Store
    ↓
All Subsequent Requests Use New Data
```

## Key Design Patterns

### 1. Dependency Injection

Route handlers receive `dataStore` as a parameter, enabling:
- Easy testing with mock data stores
- Swapping implementations
- Clear dependencies

```javascript
function setupCollectionRoutes(app, dataStore) {
  // dataStore is injected
}
```

### 2. Factory Pattern

Middleware are factory functions that return middleware:

```javascript
function delayMiddleware(delayMs) {
  return (req, res, next) => {
    // Configurable delay
  };
}
```

### 3. Manager Pattern

`ServerManager` encapsulates complex lifecycle management:

```javascript
class ServerManager {
  loadData() { }
  start() { }
  close() { }
}
```

### 4. Result Object Pattern

Functions return structured result objects instead of throwing:

```javascript
{
  success: true,
  data: {...}
}
// or
{
  success: false,
  error: "..."
}
```

## Error Handling Strategy

### 1. CLI Errors
- Display user-friendly messages
- Exit with appropriate exit code
- Suggest solutions

### 2. Server Startup Errors
- Handle EADDRINUSE (port in use)
- Display helpful error messages
- Exit gracefully

### 3. Request Errors
- Centralized error handler middleware
- Consistent error response format
- HTTP status codes match REST conventions

### 4. Data Loading Errors
- Validate JSON before loading
- Clear error messages for file issues
- Exit on critical errors

## Testing Strategy

### Unit Tests
- Test individual functions in isolation
- Mock dependencies
- Focus on edge cases

### Integration Tests
- Test module interactions
- Use test database (port 0 mode)
- Verify end-to-end flows

### Test Coverage
- CLI argument parsing
- Utility functions
- Route handlers
- Server lifecycle

## Performance Considerations

### 1. In-Memory Data
- All data stored in memory
- Fast read/write operations
- No database overhead

### 2. File Watching
- Efficient change detection via chokidar
- Debounced file reads
- Minimal I/O operations

### 3. Express.js
- Lightweight framework
- Minimal middleware stack
- Fast request handling

### 4. Startup Time
- Lazy initialization where possible
- Minimal dependencies
- Quick JSON parsing

## Security Considerations

### Current Limitations
- No authentication
- No authorization
- No input validation beyond JSON parsing
- No rate limiting
- No HTTPS support

### Intended Use Case
- Development and prototyping only
- Local network only
- Not suitable for production

### Future Enhancements
- Optional authentication middleware
- Request validation
- Rate limiting support
- HTTPS configuration

## Extension Points

### Adding New Middleware

Create a new middleware file in `src/middleware/`:

```javascript
function customMiddleware(options) {
  return (req, res, next) => {
    // Custom logic
    next();
  };
}

module.exports = { customMiddleware };
```

Register in `create-server.js`:

```javascript
app.use(customMiddleware(options));
```

### Adding New Route Types

Create a new route file in `src/routes/`:

```javascript
function setupCustomRoutes(app, dataStore) {
  app.get('/custom-endpoint', (req, res) => {
    // Custom logic
  });
}

module.exports = { setupCustomRoutes };
```

Register in `routes/index.js`:

```javascript
function setupAllRoutes(app, dataStore) {
  setupRootRoute(app, dataStore);
  setupCollectionRoutes(app, dataStore);
  setupResourceRoutes(app, dataStore);
  setupNestedRoutes(app, dataStore);
  setupCustomRoutes(app, dataStore); // Add custom routes
}
```

### Adding New Utilities

Create a new utility file in `src/utils/`:

```javascript
function customUtility(input) {
  // Custom logic
  return result;
}

module.exports = { customUtility };
```

## Dependencies

### Production Dependencies
- `express`: Web framework
- `cors`: CORS support
- `chokidar`: File watching

### Development Dependencies
- `jest`: Testing framework
- `supertest`: HTTP assertion library

### Minimizing Dependencies
- Only essential dependencies included
- Prefer built-in Node.js modules
- Avoid heavy frameworks

## Future Architecture Improvements

### Potential Enhancements
1. **Plugin System**: Allow custom middleware and routes via plugins
2. **Configuration File**: Support for `.mockdroprc` or similar
3. **Validation Schema**: JSON Schema validation for requests
4. **Relationships**: Support for foreign key relationships
5. **Pagination**: Built-in pagination support
6. **Sorting**: Configurable result sorting
7. **Search**: Full-text search capabilities
8. **WebSockets**: Real-time data updates

### Maintainability
- Continuous refactoring
- Regular dependency updates
- Code quality metrics
- Documentation updates
