const express = require('express');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

let currentData = null;
let server = null;

function loadData(jsonFilePath) {
  try {
    const absolutePath = path.resolve(jsonFilePath);
    const rawData = fs.readFileSync(absolutePath, 'utf8');
    const data = JSON.parse(rawData);
    console.log(`✅ Successfully loaded data from ${jsonFilePath}`);
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: File not found: ${jsonFilePath}`);
    } else if (error instanceof SyntaxError) {
      console.error(`❌ Error: Invalid JSON in file: ${jsonFilePath}`);
      console.error(error.message);
    } else {
      console.error(`❌ Error reading file: ${error.message}`);
    }
    process.exit(1);
  }
}

function startServer(jsonFilePath, port = 3000) {
  currentData = loadData(jsonFilePath);

  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    const endpoints = Object.keys(currentData).map(key => `GET /${key}`);
    res.json({
      message: 'mock-drop API',
      endpoints
    });
  });

  app.get('/:key', (req, res) => {
    const key = req.params.key;
    if (currentData && currentData[key]) {
      res.json(currentData[key]);
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  });

  server = app.listen(port, () => {
    console.log('\n💧 mock-drop is running!');
    console.log(`📅 Watching ${jsonFilePath} for updates...\n`);
    console.log('Endpoints available:');
    Object.keys(currentData).forEach(key => {
      console.log(`👉 http://localhost:${port}/${key}`);
    });
    console.log('\nPress Ctrl+C to stop.\n');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Error: Port ${port} is already in use`);
      console.error(`Try using a different port: mock-drop ${jsonFilePath} --port <port>`);
    } else {
      console.error(`❌ Error starting server: ${error.message}`);
    }
    process.exit(1);
  });

  const watcher = chokidar.watch(jsonFilePath);
  watcher.on('change', () => {
    console.log('\n🔄 File changed, reloading...');
    const newData = loadData(jsonFilePath);
    currentData = newData;
    console.log('✅ Server updated with new data\n');
  });

  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down mock-drop...');
    watcher.close();
    server.close(() => {
      console.log('✨ Goodbye!');
      process.exit(0);
    });
  });
}

module.exports = { startServer };
