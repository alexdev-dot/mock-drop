function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
}

module.exports = { requestLoggerMiddleware };
