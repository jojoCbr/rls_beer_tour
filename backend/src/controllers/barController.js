const Bar = require('../models/Bar');

exports.createBar = async (req, res) => {
  try {
    const { name, location } = req.body;
    const bar = await Bar.create(name, location);
    res.status(201).json(bar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating bar.' });
  }
};

exports.getBars = async (req, res) => {
  try {
    const bars = await Bar.findAll();
    res.json(bars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bars.' });
  }
};