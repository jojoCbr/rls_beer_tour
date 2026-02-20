const express = require('express');
const { createBeer, getBeers } = require('../controllers/beerController');
const { protect } = require('../auth/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createBeer)
  .get(protect, getBeers);

module.exports = router;
