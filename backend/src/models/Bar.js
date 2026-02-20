const db = require('../../db');

class Bar {
  static async create(name, location) {
    const [bar] = await db('bars').insert({ name, location }).returning('*');
    return bar;
  }

  static async findAll() {
    return db('bars').select('*');
  }

  static async findById(id) {
    return db('bars').where({ id }).first();
  }

  static async findByName(name) {
    return db('bars').where({ name }).first();
  }
}

module.exports = Bar;
