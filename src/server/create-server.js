const express = require('express');
const { corsMiddleware } = require('../middleware/cors');
const { delayMiddleware } = require('../middleware/delay');
const { errorHandlerMiddleware } = require('../middleware/error-handler');
const { requestLoggerMiddleware } = require('../middleware/request-logger');
const { setupAllRoutes } = require('../routes');

function createServer(dataStore, delay = 0) {
  const app = express();

  app.use(corsMiddleware());
  app.use(express.json());
  app.use(delayMiddleware(delay));
  app.use(requestLoggerMiddleware);
  app.use(errorHandlerMiddleware);

  setupAllRoutes(app, dataStore);

  return app;
}

module.exports = { createServer };
