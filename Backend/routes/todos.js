const express = require('express');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');
const TodoList = require('../models/TodoList');

const router = express.Router();

// Get all todos for a user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.findByUserId(req.user.id);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all todos for a specific todolist
router.get('/list/:listId', auth, async (req, res) => {
  try {
    const todolist = await TodoList.findById(req.params.listId);
    
    if (!todolist) {
      return res.status(404).json({ message: 'TodoList not found' });
    }
    
    // Check if todolist belongs to user
    if (todolist.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const todos = await Todo.findByTodoListId(req.params.listId);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todo in a specific todolist
router.post('/list/:listId', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const todolist = await TodoList.findById(req.params.listId);
    
    if (!todolist) {
      return res.status(404).json({ message: 'TodoList not found' });
    }
    
    // Check if todolist belongs to user
    if (todolist.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const todo = new Todo(title, description, req.params.listId, req.user.id);
    const result = await todo.save();
    
    res.status(201).json({ 
      message: 'Todo created successfully', 
      todoId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single todo
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if todo belongs to user
    if (todo.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if todo belongs to user
    if (todo.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    
    await Todo.updateById(req.params.id, updateData);
    
    res.json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Check if todo belongs to user
    if (todo.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Todo.deleteById(req.params.id);
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;