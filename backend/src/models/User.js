const db = require('../../db');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password) {
    const password_hash = await bcrypt.hash(password, 10);
    const [user] = await db('users').insert({ username, email, password_hash }).returning('*');
    return user;
  }

  static async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  static async comparePassword(password, password_hash) {
    return bcrypt.compare(password, password_hash);
  }

  static async findById(id) {
    return db('users').where({ id }).first();
  }
}

module.exports = User;