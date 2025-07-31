const { ObjectId } = require('mongodb');
const { getDB } = require('../db');

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  // Save user to database
  async save() {
    const db = getDB();
    return await db.collection('users').insertOne(this);
  }

  // Find user by email
  static async findByEmail(email) {
    const db = getDB();
    return await db.collection('users').findOne({ email });
  }

  // Find user by ID
  static async findById(id) {
    const db = getDB();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;