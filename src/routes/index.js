const { setupCollectionRoutes } = require('./collection-routes');
const { setupResourceRoutes } = require('./resource-routes');
const { setupNestedRoutes } = require('./nested-routes');

function setupRootRoute(app, dataStore) {
  app.get('/', (req, res) => {
    const endpoints = dataStore.getResourceNames().map(key => ({
      resource: key,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));
    res.json({
      message: 'mock-drop API',
      endpoints
    });
  });
}

function setupAllRoutes(app, dataStore) {
  setupRootRoute(app, dataStore);
  setupCollectionRoutes(app, dataStore);
  setupResourceRoutes(app, dataStore);
  setupNestedRoutes(app, dataStore);
}

module.exports = {
  setupRootRoute,
  setupAllRoutes
};
