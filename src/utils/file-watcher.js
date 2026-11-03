const chokidar = require('chokidar');

function createFileWatcher(filePath, onChange) {
  const watcher = chokidar.watch(filePath);

  watcher.on('change', () => {
    onChange();
  });

  return watcher;
}

module.exports = { createFileWatcher };
