const express = require('express');
const { createBar, getBars } = require('../controllers/barController');
const { protect } = require('../auth/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createBar)
  .get(protect, getBars);

module.exports = router;
