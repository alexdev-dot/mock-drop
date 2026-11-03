function errorHandlerMiddleware(err, req, res, next) {
  console.error('Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
}

module.exports = { errorHandlerMiddleware };
