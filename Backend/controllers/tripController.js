const Trip = require('../models/Trip');

// @route   GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/trips
exports.createTrip = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Trip name is required' });
    }

    const trip = await Trip.create({
      userId: req.user._id,
      name: name.trim()
    });

    res.status(201).json(trip);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Trip already exists' });
    }

    res.status(500).json({ message: error.message });
  }
};
