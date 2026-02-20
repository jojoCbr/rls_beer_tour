const Beer = require('../models/Beer');

exports.createBeer = async (req, res) => {
  try {
    const { name, brewery, style } = req.body;
    const beer = await Beer.create(name, brewery, style);
    res.status(201).json(beer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating beer.' });
  }
};

exports.getBeers = async (req, res) => {
  try {
    const beers = await Beer.findAll();
    res.json(beers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching beers.' });
  }
};