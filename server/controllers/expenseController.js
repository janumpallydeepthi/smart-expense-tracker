const pool = require("../config/db");

// ---------------- ADD EXPENSE ----------------
const addExpense = async (req, res) => {
  try {
    console.log("Add expense request received");
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);

    const { amount, category, date } = req.body;

    // Validation
    if (!amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Amount and category are required",
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Handle date (optional)
    let finalDate = new Date();
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }
      finalDate = parsedDate;
    }

    const result = await pool.query(
      `INSERT INTO expenses (amount, category, user_id, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [amountNum, category, userId, finalDate]
    );

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error in addExpense:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding expense",
      error: err.message,
    });
  }
};

// ---------------- GET EXPENSES ----------------
const getExpenses = async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching expenses",
      error: err.message,
    });
  }
};

// ---------------- UPDATE EXPENSE ----------------
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date } = req.body;

    if (!amount || !category) {
      return res.status(400).json({
        message: "Amount and category are required",
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    let query;
    let params;

    // If date provided → update it
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      query = `
        UPDATE expenses
        SET amount = $1, category = $2, created_at = $3
        WHERE id = $4 AND user_id = $5
        RETURNING *;
      `;

      params = [amountNum, category, parsedDate, id, req.user.id];
    } else {
      // No date update
      query = `
        UPDATE expenses
        SET amount = $1, category = $2
        WHERE id = $3 AND user_id = $4
        RETURNING *;
      `;

      params = [amountNum, category, id, req.user.id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({
      message: "Server error while updating expense",
      error: err.message,
    });
  }
};

// ---------------- DELETE EXPENSE ----------------
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({
      message: "Server error while deleting expense",
      error: err.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};