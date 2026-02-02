const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, resetExpenses } = require('../controllers/expenseController');
const  protect  = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.delete('/reset', resetExpenses);

module.exports = router;
