const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

const logInTest = (...args) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(...args);
  }
};

const setupTestDB = () => {
  let connection;

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      connection = await mongoose.connect(process.env.MONGODB_URI_TEST);
      logInTest('Connected to test database');
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  });

  afterAll(async () => {
    try {
      if (connection) {
        await connection.connection.dropDatabase();
        await mongoose.disconnect();
        logInTest('Test database dropped and connection closed');
      }
    } catch (error) {
      throw new Error(`Database cleanup failed: ${error.message}`);
    }
  });

  beforeEach(async () => {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(collections.map(collection => collection.deleteMany()));
  });
};

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    password: 'password123'
  };

  const user = await User.create({ ...defaultUser, ...userData });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return { user, token };
};

const createTestTask = async (userId, taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    userId
  };

  return Task.create({ ...defaultTask, ...taskData });
};

module.exports = {
  setupTestDB,
  createTestUser,
  createTestTask
};