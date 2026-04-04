const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

router.post('/', authMiddleware, addExpense);
router.get('/', authMiddleware, getExpenses);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;