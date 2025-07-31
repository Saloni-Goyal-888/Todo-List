const express = require('express');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');
const TodoList = require('../models/TodoList');
const Todo = require('../models/Todo');

const router = express.Router();

// Get all todolists for a user
router.get('/', auth, async (req, res) => {
  try {
    const todolists = await TodoList.findByUserId(req.user.id);
    res.json(todolists);
  } catch (error) {
    console.error('Error fetching todolists:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todolist
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    const todolist = new TodoList(name, req.user.id);
    const result = await todolist.save();
    
    res.status(201).json({ 
      message: 'TodoList created successfully', 
      todoListId: result.insertedId 
    });
  } catch (error) {
    console.error('Error creating todolist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single todolist
router.get('/:id', auth, async (req, res) => {
  try {
    const todolist = await TodoList.findById(req.params.id);
    
    if (!todolist) {
      return res.status(404).json({ message: 'TodoList not found' });
    }
    
    // Check if todolist belongs to user
    if (todolist.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(todolist);
  } catch (error) {
    console.error('Error fetching todolist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todolist
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const todolist = await TodoList.findById(req.params.id);
    
    if (!todolist) {
      return res.status(404).json({ message: 'TodoList not found' });
    }
    
    // Check if todolist belongs to user
    if (todolist.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    
    await TodoList.updateById(req.params.id, updateData);
    
    res.json({ message: 'TodoList updated successfully' });
  } catch (error) {
    console.error('Error updating todolist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todolist and all its todos
router.delete('/:id', auth, async (req, res) => {
  try {
    const todolist = await TodoList.findById(req.params.id);
    
    if (!todolist) {
      return res.status(404).json({ message: 'TodoList not found' });
    }
    
    // Check if todolist belongs to user
    if (todolist.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Delete all todos in this todolist
    await Todo.deleteByTodoListId(req.params.id);
    
    // Delete the todolist
    await TodoList.deleteById(req.params.id);
    
    res.json({ message: 'TodoList and all its todos deleted successfully' });
  } catch (error) {
    console.error('Error deleting todolist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;