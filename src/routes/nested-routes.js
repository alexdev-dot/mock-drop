const { filterByQueryParams } = require('../utils/query-filter');
const { generateId } = require('../utils/id-generator');

function setupNestedRoutes(app, dataStore) {
  app.get('/:key/:id/:nestedKey', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = dataStore.findItem(key, id);
    if (!parentItem) {
      return res.status(404).json({ error: 'Parent item not found' });
    }

    const nestedData = parentItem[nestedKey];
    if (!nestedData) {
      return res.status(404).json({ error: 'Nested resource not found' });
    }

    let data = nestedData;
    if (Array.isArray(data)) {
      const queryParams = req.query;
      if (Object.keys(queryParams).length > 0) {
        data = filterByQueryParams(data, queryParams);
      }
    }

    res.json(data);
  });

  app.get('/:key/:id/:nestedKey/:nestedId', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;
    const nestedId = parseInt(req.params.nestedId);

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = dataStore.findItem(key, id);
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

  app.post('/:key/:id/:nestedKey', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = dataStore.findItem(key, id);
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

    const idValue = generateId(parentItem[nestedKey]);
    newItem.id = idValue;

    parentItem[nestedKey].push(newItem);
    res.status(201).json(newItem);
  });

  app.put('/:key/:id/:nestedKey/:nestedId', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;
    const nestedId = parseInt(req.params.nestedId);

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = dataStore.findItem(key, id);
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

  app.delete('/:key/:id/:nestedKey/:nestedId', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);
    const nestedKey = req.params.nestedKey;
    const nestedId = parseInt(req.params.nestedId);

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const parentItem = dataStore.findItem(key, id);
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
}

module.exports = { setupNestedRoutes };
