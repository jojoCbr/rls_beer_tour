const express = require('express');
const { createBeerLog, getUserBeerLogs } = require('../controllers/beerLogController');
const { protect } = require('../auth/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.route('/')
  .post(protect, upload.single('image'), createBeerLog)
  .get(protect, getUserBeerLogs);

module.exports = router;
