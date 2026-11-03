const { ServerManager } = require('./server-manager');

function startServer(jsonFilePath, port = 3000, delay = 0) {
  const manager = new ServerManager();
  manager.loadData(jsonFilePath);
  return manager.start(port, delay);
}

module.exports = { startServer, ServerManager };
