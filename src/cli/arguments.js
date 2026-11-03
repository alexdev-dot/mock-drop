function parseArguments(args) {
  const result = {
    jsonFile: null,
    port: 3000,
    delay: 0,
    help: false,
    version: false
  };

  const jsonFileIndex = args.findIndex(arg => !arg.startsWith('--'));
  if (jsonFileIndex !== -1) {
    result.jsonFile = args[jsonFileIndex];
  }

  const portIndex = args.indexOf('--port');
  if (portIndex !== -1 && args[portIndex + 1]) {
    const port = parseInt(args[portIndex + 1], 10);
    if (!isNaN(port)) {
      result.port = port;
    }
  }

  const delayIndex = args.indexOf('--delay');
  if (delayIndex !== -1 && args[delayIndex + 1]) {
    const delay = parseInt(args[delayIndex + 1], 10);
    if (!isNaN(delay)) {
      result.delay = delay;
    }
  }

  result.help = args.includes('--help');
  result.version = args.includes('--version');

  return result;
}

function validateArguments(args) {
  const errors = [];

  if (!args.jsonFile && !args.help && !args.version) {
    errors.push('Please provide a JSON file path');
  }

  if (args.port !== undefined && (isNaN(args.port) || args.port < 1 || args.port > 65535)) {
    errors.push('Invalid port number (must be between 1 and 65535)');
  }

  if (args.delay !== undefined && (isNaN(args.delay) || args.delay < 0)) {
    errors.push('Invalid delay value (must be a non-negative number)');
  }

  return errors;
}

module.exports = {
  parseArguments,
  validateArguments
};
