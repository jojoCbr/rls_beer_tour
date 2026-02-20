const BeerLog = require('../models/BeerLog');

exports.getUserRankings = async (req, res) => {
  try {
    const rankings = await BeerLog.getUserRankings();
    res.json(rankings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user rankings.' });
  }
};

exports.getBarRankings = async (req, res) => {
  try {
    const rankings = await BeerLog.getBarRankings();
    res.json(rankings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bar rankings.' });
  }
};