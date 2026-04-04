const pool = require('../config/db');

const addExpense = async (req, res) => {
    const { amount, category } = req.body;

    const result = await pool.query(
        "INSERT INTO expenses (amount, category, user_id) VALUES ($1, $2, $3) RETURNING *",
        [amount, category, req.user.id]
    );

    res.json(result.rows[0]);
};

const getExpenses = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM expenses WHERE user_id = $1",
        [req.user.id]
    );

    res.json(result.rows);
};

const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, category } = req.body;

    const result = await pool.query(
        `UPDATE expenses 
         SET amount = $1, category = $2 
         WHERE id = $3 AND user_id = $4 
         RETURNING *`,
        [amount, category, id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Expense not found" });
    }

    res.json(result.rows[0]);
};

const deleteExpense = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
        [id, req.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};