#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { startServer } = require('../lib/server');

function printVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`mock-drop v${packageJson.version}`);
}

function printHelp() {
  console.log(`
Usage: mock-drop <json-file> [options]

Arguments:
  json-file              Path to your JSON data file

Options:
  --port <number>        Specify the port number (default: 3000)
  --delay <milliseconds> Add artificial delay to all responses (default: 0)
  --help                 Display help information
  --version              Display version number

Examples:
  mock-drop db.json
  mock-drop db.json --port 8080
  mock-drop data.json --port 4000 --delay 500
`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--version')) {
    printVersion();
    process.exit(0);
  }

  const jsonFileIndex = args.findIndex(arg => !arg.startsWith('--'));
  if (jsonFileIndex === -1) {
    console.error('Error: Please provide a JSON file path');
    console.error('Run "mock-drop --help" for usage information');
    process.exit(1);
  }

  const jsonFilePath = args[jsonFileIndex];
  const portIndex = args.indexOf('--port');
  const port = portIndex !== -1 && args[portIndex + 1] ? parseInt(args[portIndex + 1], 10) : 3000;

  const delayIndex = args.indexOf('--delay');
  const delay = delayIndex !== -1 && args[delayIndex + 1] ? parseInt(args[delayIndex + 1], 10) : 0;

  if (isNaN(port) || port < 1 || port > 65535) {
    console.error('Error: Invalid port number');
    process.exit(1);
  }

  if (isNaN(delay) || delay < 0) {
    console.error('Error: Invalid delay value');
    process.exit(1);
  }

  startServer(jsonFilePath, port, delay);
}

main();
