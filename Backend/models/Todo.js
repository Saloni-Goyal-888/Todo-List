const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

class Todo {
  constructor(title, description, todoListId, userId, completed = false) {
    this.title = title;
    this.description = description;
    this.todoListId = todoListId; // Link todo to todolist
    this.userId = userId; // Link todo to user
    this.completed = completed;
    this.createdAt = new Date();
  }

  // Save todo to database
  async save() {
    const db = getDB();
    return await db.collection('todos').insertOne(this);
  }

  // Find todos by user ID
  static async findByUserId(userId) {
    const db = getDB();
    return await db.collection('todos').find({ userId: userId }).toArray();
  }

  // Find todos by todolist ID
  static async findByTodoListId(todoListId) {
    const db = getDB();
    return await db.collection('todos').find({ todoListId: todoListId }).toArray();
  }

  // Find todo by ID
  static async findById(id) {
    const db = getDB();
    return await db.collection('todos').findOne({ _id: new ObjectId(id) });
  }

  // Update todo
  static async updateById(id, updateData) {
    const db = getDB();
    return await db.collection('todos').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  // Delete todo
  static async deleteById(id) {
    const db = getDB();
    return await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  }

  // Delete all todos in a todolist
  static async deleteByTodoListId(todoListId) {
    const db = getDB();
    return await db.collection('todos').deleteMany({ todoListId: todoListId });
  }
}

module.exports = Todo;