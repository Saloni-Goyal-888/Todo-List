const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

class TodoList {
  constructor(name, userId) {
    this.name = name;
    this.userId = userId; // Link todolist to user
    this.createdAt = new Date();
  }

  // Save todolist to database
  async save() {
    const db = getDB();
    return await db.collection('todolists').insertOne(this);
  }

  // Find todolists by user ID
  static async findByUserId(userId) {
    const db = getDB();
    return await db.collection('todolists').find({ userId: userId }).toArray();
  }

  // Find todolist by ID
  static async findById(id) {
    const db = getDB();
    return await db.collection('todolists').findOne({ _id: new ObjectId(id) });
  }

  // Update todolist
  static async updateById(id, updateData) {
    const db = getDB();
    return await db.collection('todolists').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  // Delete todolist
  static async deleteById(id) {
    const db = getDB();
    return await db.collection('todolists').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = TodoList;