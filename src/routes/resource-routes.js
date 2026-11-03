function setupResourceRoutes(app, dataStore) {
  app.get('/:key/:id', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const item = dataStore.findItem(key, id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });

  app.put('/:key/:id', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const index = dataStore.findItemIndex(key, id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const resource = dataStore.getResource(key);
    const updatedItem = { ...resource[index], ...req.body, id };
    dataStore.updateItem(key, index, updatedItem);
    res.json(updatedItem);
  });

  app.delete('/:key/:id', (req, res) => {
    const key = req.params.key;
    const id = parseInt(req.params.id);

    if (!dataStore.hasResource(key)) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const index = dataStore.findItemIndex(key, id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = dataStore.deleteItem(key, index);
    res.json(deletedItem);
  });
}

module.exports = { setupResourceRoutes };
