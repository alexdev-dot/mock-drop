function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logWarning(message) {
  console.warn(`⚠️  ${message}`);
}

function logMessage(message) {
  console.log(message);
}

module.exports = {
  logSuccess,
  logError,
  logInfo,
  logWarning,
  logMessage
};
