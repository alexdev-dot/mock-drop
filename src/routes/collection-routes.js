const { filterByQueryParams } = require('../utils/query-filter');
const { generateId } = require('../utils/id-generator');

function setupCollectionRoutes(app, dataStore) {
  app.get('/:key', (req, res) => {
    const key = req.params.key;
    const resource = dataStore.getResource(key);

    if (!resource) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    let data = resource;
    const queryParams = req.query;

    if (Object.keys(queryParams).length > 0) {
      data = filterByQueryParams(data, queryParams);
    }

    res.json(data);
  });

  app.post('/:key', (req, res) => {
    const key = req.params.key;
    const resource = dataStore.getResource(key);

    if (!resource) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const newItem = req.body;
    if (!newItem) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    const id = generateId(resource);
    newItem.id = id;

    dataStore.addItem(key, newItem);
    res.status(201).json(newItem);
  });
}

module.exports = { setupCollectionRoutes };
