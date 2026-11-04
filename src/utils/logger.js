// Check if terminal supports emojis
const supportsEmoji = process.platform !== 'win32' || process.env.TERM === 'xterm-256color' || process.env.WT_SESSION;

const symbols = {
  success: supportsEmoji ? '✅' : '[OK]',
  error: supportsEmoji ? '❌' : '[ERROR]',
  info: supportsEmoji ? 'ℹ️' : '[INFO]',
  warning: supportsEmoji ? '⚠️' : '[WARN]',
  bullet: supportsEmoji ? '👉' : '->',
  water: supportsEmoji ? '💧' : '[mock-drop]',
  wave: supportsEmoji ? '👋' : '[BYE]',
  sparkle: supportsEmoji ? '✨' : '[DONE]',
  refresh: supportsEmoji ? '🔄' : '[RELOAD]'
};

function logSuccess(message) {
  console.log(`${symbols.success} ${message}`);
}

function logError(message) {
  console.error(`${symbols.error} ${message}`);
}

function logInfo(message) {
  console.log(`${symbols.info} ${message}`);
}

function logWarning(message) {
  console.warn(`${symbols.warning} ${message}`);
}

function logMessage(message) {
  console.log(message);
}

module.exports = {
  logSuccess,
  logError,
  logInfo,
  logWarning,
  logMessage,
  symbols
};
