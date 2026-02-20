const db = require('../../db');

class BeerLog {
  static async create(userId, beerId, barId, score, notes, imageUrl) {
    const [beerLog] = await db('beer_logs').insert({
      user_id: userId,
      beer_id: beerId,
      bar_id: barId,
      score,
      notes,
      image_url: imageUrl,
    }).returning('*');
    return beerLog;
  }

  static async findByUserId(userId) {
    return db('beer_logs')
      .where({ user_id: userId })
      .join('beers', 'beer_logs.beer_id', 'beers.id')
      .leftJoin('bars', 'beer_logs.bar_id', 'bars.id')
      .select(
        'beer_logs.id',
        'beer_logs.score',
        'beer_logs.consumed_at',
        'beer_logs.notes',
        'beer_logs.image_url',
        'beers.name as beer_name',
        'beers.brewery as beer_brewery',
        'beers.style as beer_style',
        'bars.name as bar_name',
        'bars.location as bar_location'
      )
      .orderBy('consumed_at', 'desc');
  }

  static async getUserRankings() {
    return db('beer_logs')
      .select('users.id as user_id', 'users.username', db.raw('COUNT(beer_logs.id) as total_beers'))
      .join('users', 'beer_logs.user_id', 'users.id')
      .groupBy('users.id', 'users.username')
      .orderBy('total_beers', 'desc');
  }

  static async getBarRankings() {
    return db('beer_logs')
      .select('bars.id as bar_id', 'bars.name as bar_name', db.raw('AVG(beer_logs.score) as average_score'))
      .join('bars', 'beer_logs.bar_id', 'bars.id')
      .whereNotNull('beer_logs.bar_id') // Only include logs with a bar
      .groupBy('bars.id', 'bars.name')
      .orderBy('average_score', 'desc');
  }
}

module.exports = BeerLog;
