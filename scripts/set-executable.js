#!/usr/bin/env node

// Set executable permission for the CLI script on Unix-like systems
// This script is safe to run on Windows (it will just do nothing)

const { exec } = require('child_process');
const path = require('path');

// Skip on Windows
if (process.platform === 'win32') {
  process.exit(0);
}

const binPath = path.join(__dirname, '..', 'bin', 'mock-drop.js');

exec(`chmod +x "${binPath}"`, (error) => {
  if (error) {
    console.warn(`Warning: Could not set executable permission on ${binPath}`);
    console.warn('You may need to run: chmod +x bin/mock-drop.js');
  }
  process.exit(0);
});
