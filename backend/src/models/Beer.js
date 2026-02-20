const db = require('../../db');

class Beer {
  static async create(name, brewery, style) {
    const [beer] = await db('beers').insert({ name, brewery, style }).returning('*');
    return beer;
  }

  static async findAll() {
    return db('beers').select('*');
  }

  static async findById(id) {
    return db('beers').where({ id }).first();
  }

  static async findByName(name) {
    return db('beers').where({ name }).first();
  }
}

module.exports = Beer;
