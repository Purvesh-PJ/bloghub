const errorHandler = (err, req, res, _next) => {
  console.error('[Error]', err.stack || err.message);
  return res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
  });
};

module.exports = errorHandler;
