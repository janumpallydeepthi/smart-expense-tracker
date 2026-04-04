import { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./AddExpense.css";

const predefinedCategories = ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Other"];

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    customCategory: "",
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [originalCategory, setOriginalCategory] = useState("");

  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const res = await axios.get(`/expenses`);
      const expense = res.data.find((e) => e.id === Number(id));

      if (expense) {
        // Check if category is predefined or custom
        const isPredefined = predefinedCategories.includes(expense.category);
        
        if (isPredefined) {
          setFormData({
            amount: expense.amount,
            category: expense.category,
            customCategory: "",
          });
          setShowCustomInput(false);
        } else {
          setFormData({
            amount: expense.amount,
            category: "Other",
            customCategory: expense.category,
          });
          setShowCustomInput(true);
        }
        setOriginalCategory(expense.category);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load expense");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, category: selectedCategory });
    setShowCustomInput(selectedCategory === "Other");
    
    if (selectedCategory !== "Other") {
      setFormData({ ...formData, category: selectedCategory, customCategory: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalCategory = formData.category;
      if (formData.category === "Other" && formData.customCategory.trim()) {
        finalCategory = formData.customCategory.trim();
      }

      await axios.put(`/expenses/${id}`, {
        amount: formData.amount,
        category: finalCategory,
      });
      
      alert("Expense updated successfully");
      navigate("/expenses");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <div className="expense-form-card">
        <div className="form-header">
          <h2>Edit Expense</h2>
          <p>Modify your transaction details</p>
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
            {loading ? "Updating..." : "Update Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;