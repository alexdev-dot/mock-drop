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

function startServer(jsonFilePath, port = 3000, delay = 0) {
  currentData = loadData(jsonFilePath);

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Delay middleware if delay is specified
  if (delay > 0) {
    app.use((req, res, next) => {
      setTimeout(next, delay);
    });
  }

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
      let data = currentData[key];

      // Apply query parameter filters
      const queryParams = req.query;
      if (Object.keys(queryParams).length > 0) {
        data = data.filter(item => {
          return Object.entries(queryParams).every(([param, value]) => {
            const itemValue = item[param];

            // Handle different value types
            if (itemValue === undefined || itemValue === null) {
              return false;
            }

            // Try to convert query value to number if item value is a number
            if (typeof itemValue === 'number') {
              const numValue = parseFloat(value);
              return itemValue === numValue;
            }

            // Handle boolean comparison
            if (typeof itemValue === 'boolean') {
              const boolValue = value.toLowerCase() === 'true';
              return itemValue === boolValue;
            }

            // String comparison (case-insensitive)
            return String(itemValue).toLowerCase() === String(value).toLowerCase();
          });
        });
      }

      res.json(data);
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

  // Nested routes: GET /:key/:id/:nestedKey
  app.get('/:key/:id/:nestedKey', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = currentData[key].find(item => item.id === id);
    if (!parentItem) {
      return res.status(404).json({ error: 'Parent item not found' });
    }

    const nestedData = parentItem[nestedKey];
    if (!nestedData) {
      return res.status(404).json({ error: 'Nested resource not found' });
    }

    // Apply query parameter filters if nested data is an array
    let data = nestedData;
    if (Array.isArray(data)) {
      const queryParams = req.query;
      if (Object.keys(queryParams).length > 0) {
        data = data.filter(item => {
          return Object.entries(queryParams).every(([param, value]) => {
            const itemValue = item[param];

            if (itemValue === undefined || itemValue === null) {
              return false;
            }

            if (typeof itemValue === 'number') {
              const numValue = parseFloat(value);
              return itemValue === numValue;
            }

            if (typeof itemValue === 'boolean') {
              const boolValue = value.toLowerCase() === 'true';
              return itemValue === boolValue;
            }

            return String(itemValue).toLowerCase() === String(value).toLowerCase();
          });
        });
      }
    }

    res.json(data);
  });

  // Nested routes: GET /:key/:id/:nestedKey/:nestedId
  app.get('/:key/:id/:nestedKey/:nestedId', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;
    const nestedId = parseInt(req.params.nestedId);

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = currentData[key].find(item => item.id === id);
    if (!parentItem) {
      return res.status(404).json({ error: 'Parent item not found' });
    }

    const nestedData = parentItem[nestedKey];
    if (!nestedData || !Array.isArray(nestedData)) {
      return res.status(404).json({ error: 'Nested resource not found' });
    }

    const nestedItem = nestedData.find(item => item.id === nestedId);
    if (nestedItem) {
      res.json(nestedItem);
    } else {
      res.status(404).json({ error: 'Nested item not found' });
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

  // Nested routes: POST /:key/:id/:nestedKey
  app.post('/:key/:id/:nestedKey', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = currentData[key].find(item => item.id === id);
    if (!parentItem) {
      return res.status(404).json({ error: 'Parent item not found' });
    }

    if (!parentItem[nestedKey]) {
      parentItem[nestedKey] = [];
    }

    if (!Array.isArray(parentItem[nestedKey])) {
      return res.status(400).json({ error: 'Nested resource is not an array' });
    }

    const newItem = req.body;
    if (!newItem) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const maxId = parentItem[nestedKey].reduce((max, item) => Math.max(max, item.id || 0), 0);
    newItem.id = maxId + 1;

    parentItem[nestedKey].push(newItem);
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

  // Nested routes: PUT /:key/:id/:nestedKey/:nestedId
  app.put('/:key/:id/:nestedKey/:nestedId', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;
    const nestedId = parseInt(req.params.nestedId);

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = currentData[key].find(item => item.id === id);
    if (!parentItem) {
      return res.status(404).json({ error: 'Parent item not found' });
    }

    const nestedData = parentItem[nestedKey];
    if (!nestedData || !Array.isArray(nestedData)) {
      return res.status(404).json({ error: 'Nested resource not found' });
    }

    const index = nestedData.findIndex(item => item.id === nestedId);
    if (index === -1) {
      return res.status(404).json({ error: 'Nested item not found' });
    }

    const updatedItem = { ...nestedData[index], ...req.body, id: nestedId };
    nestedData[index] = updatedItem;
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

  // Nested routes: DELETE /:key/:id/:nestedKey/:nestedId
  app.delete('/:key/:id/:nestedKey/:nestedId', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;
    const nestedId = parseInt(req.params.nestedId);

    if (!currentData || !currentData[key]) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = currentData[key].find(item => item.id === id);
    if (!parentItem) {
      return res.status(404).json({ error: 'Parent item not found' });
    }

    const nestedData = parentItem[nestedKey];
    if (!nestedData || !Array.isArray(nestedData)) {
      return res.status(404).json({ error: 'Nested resource not found' });
    }

    const index = nestedData.findIndex(item => item.id === nestedId);
    if (index === -1) {
      return res.status(404).json({ error: 'Nested item not found' });
    }

    const deletedItem = nestedData.splice(index, 1)[0];
    res.json(deletedItem);
  });

  // For testing: if port is 0, don't start the server, just return the app
  if (port === 0) {
    return { app, server: null };
  }

  server = app.listen(port, () => {
    console.log('\n💧 mock-drop is running!');
    console.log(`📅 Watching ${jsonFilePath} for updates...`);
    if (delay > 0) {
      console.log(`⏱️  Response delay: ${delay}ms`);
    }
    console.log('\nEndpoints available:');
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
