const { loadJsonFile } = require('../utils/json-loader');
const { createFileWatcher } = require('../utils/file-watcher');
const { DataStore } = require('../utils/data-store');
const { logSuccess, logError, logMessage, logInfo, symbols } = require('../utils/logger');
const { createServer } = require('./create-server');

class ServerManager {
  constructor() {
    this.dataStore = new DataStore();
    this.server = null;
    this.watcher = null;
    this.jsonFilePath = null;
  }

  loadData(jsonFilePath) {
    const result = loadJsonFile(jsonFilePath);

    if (!result.success) {
      logError(result.error);
      process.exit(1);
    }

    this.dataStore.setData(result.data);
    this.jsonFilePath = jsonFilePath;
    logSuccess(`Successfully loaded data from ${jsonFilePath}`);
    return result.data;
  }

  start(port, delay = 0) {
    const app = createServer(this.dataStore, delay);

    if (port === 0) {
      return { app, server: null };
    }

    this.server = app.listen(port, () => {
      this.printStartupInfo(port, delay);
    });

    this.server.on('error', (error) => {
      this.handleServerError(error, port);
    });

    this.setupFileWatcher();
    this.setupShutdownHandler();

    return { app, server: this.server };
  }

  printStartupInfo(port, delay) {
    logMessage(`\n${symbols.water} mock-drop is running!`);
    logInfo(`Watching ${this.jsonFilePath} for updates...`);
    if (delay > 0) {
      logInfo(`Response delay: ${delay}ms`);
    }
    logMessage('\nEndpoints available:');
    const resourceNames = this.dataStore.getResourceNames();
    resourceNames.forEach(key => {
      logMessage(`${symbols.bullet} http://localhost:${port}/${key} (GET, POST, PUT, DELETE)`);
    });
    logMessage('\nPress Ctrl+C to stop.\n');
  }

  handleServerError(error, port) {
    if (error.code === 'EADDRINUSE') {
      logError(`Port ${port} is already in use`);
      logError(`Try using a different port: mock-drop ${this.jsonFilePath} --port <port>`);
    } else {
      logError(`Error starting server: ${error.message}`);
    }
    process.exit(1);
  }

  setupFileWatcher() {
    this.watcher = createFileWatcher(this.jsonFilePath, () => {
      logMessage(`\n${symbols.refresh} File changed, reloading...`);
      this.loadData(this.jsonFilePath);
      logSuccess('Server updated with new data\n');
    });
  }

  setupShutdownHandler() {
    const shutdown = () => {
      logMessage(`\n\n${symbols.wave} Shutting down mock-drop...`);
      if (this.watcher) {
        this.watcher.close();
      }
      if (this.server) {
        this.server.close(() => {
          logMessage(`${symbols.sparkle} Goodbye!`);
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    // Handle SIGINT (Ctrl+C) - works on all platforms
    process.on('SIGINT', shutdown);

    // Handle SIGTERM - Unix/Linux/Mac only
    process.on('SIGTERM', shutdown);
  }

  close() {
    if (this.watcher) {
      this.watcher.close();
    }
    if (this.server) {
      this.server.close();
    }
  }
}

module.exports = { ServerManager };
