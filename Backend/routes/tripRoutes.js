const express = require('express');
const router = express.Router();
const { getTrips, createTrip } = require('../controllers/tripController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTrips)
  .post(createTrip);

module.exports = router;
