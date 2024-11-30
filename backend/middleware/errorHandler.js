const errorHandler = (err, req, res, next) => {
    const isTest = process.env.NODE_ENV === 'test';
    const isProd = process.env.NODE_ENV === 'production';
  
    if (!isTest) {
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code
      });
    }
  
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
  
    const response = {
      error: err.message || 'Internal Server Error'
    };
  
    if (!isProd) {
      response.stack = err.stack;
    }
  
    res.status(err.status || 500).json(response);
  };
  
  module.exports = { errorHandler };