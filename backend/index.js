require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? 'your-production-domain.com' 
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }));

app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());

require('./config/passport');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
