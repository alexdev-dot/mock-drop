const cors = require('cors');

function corsMiddleware() {
  return cors();
}

module.exports = { corsMiddleware };
