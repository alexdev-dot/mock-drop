const express = require('express');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const cors = require('cors');

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
  app.use(cors());
  app.use(express.json());

  // Setup all routes
  app.get('/', (req, res) => {
    const endpoints = Object.keys(currentData).map(key => ({
      resource: key,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
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

  app.get('/:key/:id', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    if (currentData && currentData[key]) {
      const item = currentData[key].find(item => item.id === id);
      if (item) {
        res.json(item);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } else {
      res.status(404).json({ error: 'Endpoint not found' });
    }
  });

  app.post('/:key', (req, res) => {
    const key = req.params.key;
    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const newItem = req.body;
    if (!newItem) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const maxId = currentData[key].reduce((max, item) => Math.max(max, item.id || 0), 0);
    newItem.id = maxId + 1;

    currentData[key].push(newItem);
    res.status(201).json(newItem);
  });

  app.put('/:key/:id', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const index = currentData[key].findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedItem = { ...currentData[key][index], ...req.body, id };
    currentData[key][index] = updatedItem;
    res.json(updatedItem);
  });

  app.delete('/:key/:id', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const index = currentData[key].findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = currentData[key].splice(index, 1)[0];
    res.json(deletedItem);
  });

  // For testing: if port is 0, don't start the server, just return the app
  if (port === 0) {
    return { app, server: null };
  }

  server = app.listen(port, () => {
    console.log('\n💧 mock-drop is running!');
    console.log(`📅 Watching ${jsonFilePath} for updates...\n`);
    console.log('Endpoints available:');
    Object.keys(currentData).forEach(key => {
      console.log(`👉 http://localhost:${port}/${key} (GET, POST, PUT, DELETE)`);
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

  // Only register SIGINT handler if server is running (not in test mode)
  if (server) {
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down mock-drop...');
      watcher.close();
      server.close(() => {
        console.log('✨ Goodbye!');
        process.exit(0);
      });
    });
  }

  return { app, server };
}

module.exports = { startServer };
