const { parseArguments, validateArguments } = require('./arguments');
const { printVersion, printHelp } = require('./commands');
const { startServer } = require('../server');
const { logError } = require('../utils/logger');

function main() {
  const args = process.argv.slice(2);
  const parsedArgs = parseArguments(args);

  if (parsedArgs.help) {
    printHelp();
    process.exit(0);
  }

  if (parsedArgs.version) {
    printVersion();
    process.exit(0);
  }

  const errors = validateArguments(parsedArgs);
  if (errors.length > 0) {
    errors.forEach(error => logError(error));
    console.error('Run "mock-drop --help" for usage information');
    process.exit(1);
  }

  startServer(parsedArgs.jsonFile, parsedArgs.port, parsedArgs.delay);
}

module.exports = { main };

if (require.main === module) {
  main();
}
