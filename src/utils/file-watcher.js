const chokidar = require('chokidar');
const path = require('path');

function createFileWatcher(filePath, onChange) {
  // Use path.resolve to ensure cross-platform path handling
  const absolutePath = path.resolve(filePath);
  const watcher = chokidar.watch(absolutePath, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', () => {
    onChange();
  });

  return watcher;
}

module.exports = { createFileWatcher };
