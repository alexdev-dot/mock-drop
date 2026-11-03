const path = require('path');
const fs = require('fs');

function printVersion() {
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
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

module.exports = {
  printVersion,
  printHelp
};
