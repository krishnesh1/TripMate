const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, resetExpenses, deleteExpense } = require('../controllers/expenseController');
const  protect  = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.delete('/reset', resetExpenses);

router.delete('/:id', deleteExpense);

module.exports = router;
