require('dotenv').config();

// Set test environment variables if not already set
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI_TEST = process.env.MONGODB_URI_TEST
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.PORT = process.env.PORT || 5000;

// Increase timeout for tests
jest.setTimeout(30000);