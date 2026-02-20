const express = require('express');
const { getUserRankings, getBarRankings } = require('../controllers/rankingController');
const { protect } = require('../auth/authMiddleware');

const router = express.Router();

router.get('/users', protect, getUserRankings);
router.get('/bars', protect, getBarRankings);

module.exports = router;
