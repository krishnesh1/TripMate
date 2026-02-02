const Expense = require('../models/Expense');

// @route   GET /api/expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const { payerId, amount, description } = req.body;
    
    const expense = await Expense.create({
      userId: req.user._id,
      payerId,
      amount,
      description
    });
    
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/expenses/reset
exports.resetExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({ userId: req.user._id });
    res.json({ message: 'All expenses reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
