function delayMiddleware(delayMs) {
  return (req, res, next) => {
    if (delayMs > 0) {
      setTimeout(next, delayMs);
    } else {
      next();
    }
  };
}

module.exports = { delayMiddleware };
