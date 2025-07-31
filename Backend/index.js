const express = require('express');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connectToDB, getDB } = require('./db');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const todoListRoutes = require('./routes/todolists');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TODO API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// TodoList routes
app.use('/api/todolists', todoListRoutes);

// Todo routes
app.use('/api/todos', todoRoutes);

// Protected route example
const auth = require('./middleware/auth');
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Start server
connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });