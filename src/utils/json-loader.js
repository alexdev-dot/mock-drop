const fs = require('fs');
const path = require('path');

function loadJsonFile(jsonFilePath) {
  try {
    const absolutePath = path.resolve(jsonFilePath);
    const rawData = fs.readFileSync(absolutePath, 'utf8');
    const data = JSON.parse(rawData);
    return { success: true, data, path: absolutePath };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: false, error: `File not found: ${jsonFilePath}` };
    } else if (error instanceof SyntaxError) {
      return { success: false, error: `Invalid JSON in file: ${jsonFilePath}. ${error.message}` };
    } else {
      return { success: false, error: `Error reading file: ${error.message}` };
    }
  }
}

module.exports = { loadJsonFile };
