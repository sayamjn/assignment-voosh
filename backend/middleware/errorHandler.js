const errorHandler = (err, req, res, next) => {
    // Log the full error
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    });
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(err.errors).map(e => e.message)
      });
    }
  
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Duplicate Error',
          message: 'A record with that data already exists',
          field: Object.keys(err.keyPattern)[0]
        });
      }
    }
  
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
  };
  
  module.exports = { errorHandler };