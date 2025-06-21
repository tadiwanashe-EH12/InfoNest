module.exports = (err, req, res, next) => {
  console.error(`💥 Error: ${err.message}`);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
};
