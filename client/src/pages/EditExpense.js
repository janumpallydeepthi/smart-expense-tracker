import { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "./AddExpense.css";

const predefinedCategories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other",
];

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    customCategory: "",
    date: "",
  });

  const [showCustomInput, setShowCustomInput] = useState(false);

  // ---------------- FETCH EXPENSE ----------------
  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const res = await axios.get("/expenses");

      const expense = res.data.find(
        (e) => e.id === Number(id)
      );

      if (!expense) return;

      const isPredefined = predefinedCategories.includes(
        expense.category
      );

      const formattedDate = expense.created_at
        ? new Date(expense.created_at)
            .toISOString()
            .split("T")[0]
        : new Date().toISOString().split("T")[0];

      setFormData({
        amount: expense.amount,
        category: isPredefined ? expense.category : "Other",
        customCategory: isPredefined ? "" : expense.category,
        date: formattedDate,
      });

      setShowCustomInput(!isPredefined);
    } catch (err) {
      console.error(err);
      alert("Failed to load expense");
    }
  };

  // ---------------- CATEGORY CHANGE ----------------
  const handleCategoryChange = (e) => {
    const selected = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: selected,
      customCategory:
        selected === "Other" ? prev.customCategory : "",
    }));

    setShowCustomInput(selected === "Other");
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Enter valid amount");
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

      console.log("Updating expense:", payload);

      await axios.put(`/expenses/${id}`, payload);

      alert("Expense updated successfully");
      navigate("/expenses");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Update failed"
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
          <h2>Edit Expense</h2>
          <p>Modify your transaction details</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">

          {/* AMOUNT */}
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
              required
            />
          </div>

          {/* DATE */}
          <div className="form-group">
            <label>📅 Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value,
                })
              }
              required
            />
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
            {loading ? "Updating..." : "Update Expense"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditExpense;