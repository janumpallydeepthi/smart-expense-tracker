const pool = require('../config/db');

const addExpense = async (req, res) => {
    let client;
    try {
        console.log("Add expense request received");
        console.log("Request body:", req.body);
        console.log("User from token:", req.user);

        const { amount, category } = req.body;
        
        // Validation
        if (!amount || !category) {
            console.log("Validation failed: missing fields");
            return res.status(400).json({ 
                success: false,
                message: "Amount and category are required" 
            });
        }

        // Convert amount to number
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            console.log("Validation failed: invalid amount");
            return res.status(400).json({ 
                success: false,
                message: "Amount must be a valid positive number" 
            });
        }

        // Get user_id from token
        const userId = req.user.id;
        if (!userId) {
            console.log("No user ID in token");
            return res.status(401).json({ 
                success: false,
                message: "User not authenticated" 
            });
        }

        console.log(`Inserting expense: amount=${amountNum}, category=${category}, user_id=${userId}`);

        // Insert into database
        const result = await pool.query(
            "INSERT INTO expenses (amount, category, user_id) VALUES ($1, $2, $3) RETURNING *",
            [amountNum, category, userId]
        );

        console.log("Expense inserted successfully:", result.rows[0]);
        
        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: result.rows[0]
        });
        
    } catch (err) {
        console.error("Detailed error in addExpense:", err);
        console.error("Error stack:", err.stack);
        
        // Send detailed error for debugging
        res.status(500).json({ 
            success: false,
            message: "Server error while adding expense",
            error: err.message,
            details: err.stack
        });
    }
};

const getExpenses = async (req, res) => {
    try {
        console.log("Fetching expenses for user:", req.user.id);
        
        const result = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        
        console.log(`Found ${result.rows.length} expenses`);
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching expenses",
            error: err.message 
        });
    }
};

const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category } = req.body;

        console.log(`Updating expense ${id} for user ${req.user.id}`);

        if (!amount || !category) {
            return res.status(400).json({ 
                message: "Amount and category are required" 
            });
        }

        const amountNum = parseFloat(amount);
        
        const result = await pool.query(
            `UPDATE expenses 
             SET amount = $1, category = $2 
             WHERE id = $3 AND user_id = $4 
             RETURNING *`,
            [amountNum, category, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        console.log("Expense updated successfully");
        res.json(result.rows[0]);
        
    } catch (err) {
        console.error("Error updating expense:", err);
        res.status(500).json({ 
            message: "Server error while updating expense",
            error: err.message 
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Deleting expense ${id} for user ${req.user.id}`);

        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        console.log("Expense deleted successfully");
        res.json({ message: "Expense deleted successfully" });
        
    } catch (err) {
        console.error("Error deleting expense:", err);
        res.status(500).json({ 
            message: "Server error while deleting expense",
            error: err.message 
        });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};