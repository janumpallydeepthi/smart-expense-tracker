import { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AddExpense.css";

const predefinedCategories = ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Other"];

function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    customCategory: "",
  });
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Determine final category value
      let finalCategory = formData.category;
      if (formData.category === "Other" && formData.customCategory.trim()) {
        finalCategory = formData.customCategory.trim();
      }

      await axios.post("/expenses", {
        amount: formData.amount,
        category: finalCategory,
      });
      
      alert("Expense added successfully");
      navigate("/expenses");
    } catch (err) {
        if (!formData.amount || formData.amount <= 0) {
    alert("Please enter a valid amount");
    return;
}
      console.error(err);
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, category: selectedCategory });
    
    // Show custom input only when "Other" is selected
    setShowCustomInput(selectedCategory === "Other");
    
    // Reset custom category when switching from Other to something else
    if (selectedCategory !== "Other") {
      setFormData({ ...formData, category: selectedCategory, customCategory: "" });
    }
  };

  return (
    <div className="add-expense-container">
      <div className="expense-form-card">
        <div className="form-header">
          <h2>Record New Expense</h2>
          <p>Enter the details of your transaction</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              step="0.01"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {predefinedCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {showCustomInput && (
            <div className="form-group custom-category-group fade-in">
              <label>Custom Category Name</label>
              <input
                type="text"
                placeholder="Enter custom category (e.g., Medical, Education, Subscription)"
                value={formData.customCategory}
                onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                required={formData.category === "Other"}
                className="custom-input"
              />
              <small className="input-hint">
                Example: Medical, Education, Subscription, Gifts, etc.
              </small>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;