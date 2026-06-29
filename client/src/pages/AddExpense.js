import { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AddExpense.css";

const predefinedCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
];

function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    customCategory: "",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });

  const [showCustomInput, setShowCustomInput] = useState(false);

  // ---------------- HANDLE CATEGORY ----------------
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      customCategory: selectedCategory === "Other" ? prev.customCategory : "",
    }));

    setShowCustomInput(selectedCategory === "Other");
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      let finalCategory = formData.category;

      if (
        formData.category === "Other" &&
        formData.customCategory.trim()
      ) {
        finalCategory = formData.customCategory.trim();
      }

      const payload = {
        amount: formData.amount,
        category: finalCategory,
        date: formData.date,
      };

      console.log("Submitting expense:", payload);

      await axios.post("/expenses", payload);

      alert("Expense added successfully");
      navigate("/expenses");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="add-expense-container">
      <div className="expense-form-card">
        <div className="form-header">
          <h2>Record New Expense</h2>
          <p>Enter the details of your transaction</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">

          {/* AMOUNT */}
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              step="0.01"
              autoFocus
            />
          </div>

          {/* DATE */}
          <div className="form-group">
            <label>📅 Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            />
            <small>Choose expense date (defaults to today)</small>
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
            >
              {predefinedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* CUSTOM CATEGORY */}
          {showCustomInput && (
            <div className="form-group">
              <label>Custom Category</label>
              <input
                type="text"
                placeholder="Enter custom category"
                value={formData.customCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customCategory: e.target.value,
                  })
                }
              />
              <small>
                Example: Medical, Education, Subscription
              </small>
            </div>
          )}

          {/* SUBMIT */}
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;