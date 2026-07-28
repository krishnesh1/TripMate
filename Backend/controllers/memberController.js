const Member = require('../models/Member');
const Expense = require('../models/Expense');

// @route   GET /api/members
exports.getMembers = async (req, res) => {
  try {
    const { tripId } = req.query;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip is required' });
    }

    const members = await Member.find({ userId: req.user._id, tripId })
      .sort({ createdAt: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/members
exports.createMember = async (req, res) => {
  try {
    const { name, tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip is required' });
    }
    
    const member = await Member.create({
      userId: req.user._id,
      tripId,
      name
    });
    
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Delete all expenses where this member is the payer
    await Expense.deleteMany({
      userId: req.user._id,
      tripId: member.tripId,
      payerId: req.params.id
    });
    
    await member.deleteOne();
    
    res.json({ message: 'Member and related expenses deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
