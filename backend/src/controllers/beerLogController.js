const BeerLog = require('../models/BeerLog');
const Beer = require('../models/Beer');
const Bar = require('../models/Bar');

exports.createBeerLog = async (req, res) => {
  try {
    let { beerId, barId, beerName, barName, score, notes } = req.body;
    const userId = req.user.id; // User ID from authenticated user
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate score
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Score must be between 1 and 5.' });
    }

    // Handle Beer
    if (!beerId && beerName) {
      let beer = await Beer.findByName(beerName);
      if (!beer) {
        beer = await Beer.create(beerName);
      }
      beerId = beer.id;
    } else if (beerId) {
      const beer = await Beer.findById(beerId);
      if (!beer) {
        return res.status(404).json({ message: 'Beer not found.' });
      }
    } else {
      return res.status(400).json({ message: 'Beer ID or Beer Name is required.' });
    }

    // Handle Bar
    if (!barId && barName) {
      let bar = await Bar.findByName(barName);
      if (!bar) {
        bar = await Bar.create(barName);
      }
      barId = bar.id;
    } else if (barId) {
      const bar = await Bar.findById(barId);
      if (!bar) {
        return res.status(404).json({ message: 'Bar not found.' });
      }
    }

    const beerLog = await BeerLog.create(userId, beerId, barId, score, notes, imageUrl);
    res.status(201).json(beerLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating beer log.' });
  }
};

exports.getUserBeerLogs = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from authenticated user
    const beerLogs = await BeerLog.findByUserId(userId);
    res.json(beerLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user beer logs.' });
  }
};