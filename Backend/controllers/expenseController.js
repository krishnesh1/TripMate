const Expense = require('../models/Expense');
const Member = require('../models/Member');

// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const { tripId } = req.query;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip is required' });
    }

    const expenses = await Expense.find({ userId: req.user._id, tripId })
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { payerId, amount, description, tripId, excludedMemberIds = [] } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip is required' });
    }

    const payer = await Member.findOne({
      _id: payerId,
      userId: req.user._id,
      tripId
    });

    if (!payer) {
      return res.status(404).json({ message: 'Payer not found in this trip' });
    }

    if (!Array.isArray(excludedMemberIds)) {
      return res.status(400).json({ message: 'Excluded members must be a list' });
    }

    const excludedCount = await Member.countDocuments({
      _id: { $in: excludedMemberIds },
      userId: req.user._id,
      tripId
    });

    if (excludedCount !== excludedMemberIds.length) {
      return res.status(400).json({ message: 'Invalid excluded member selected' });
    }
    
    const expense = await Expense.create({
      userId: req.user._id,
      tripId,
      payerId,
      amount,
      description,
      excludedMemberIds
    });
    
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/expenses/reset
exports.resetExpenses = async (req, res) => {
  try {
    const { tripId } = req.query;

    if (!tripId) {
      return res.status(400).json({ message: 'Trip is required' });
    }

    await Expense.deleteMany({ userId: req.user._id, tripId });
    res.json({ message: 'All expenses reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
