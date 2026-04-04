import { useEffect, useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  // Get unique categories (including custom ones)
  const allCategories = ["All", ...new Set(expenses.map(exp => exp.category))];

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterAndSortExpenses();
  }, [expenses, searchTerm, categoryFilter, sortField, sortOrder]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortExpenses = () => {
    let filtered = [...expenses];

    if (searchTerm) {
      filtered = filtered.filter(exp => 
        exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.amount.toString().includes(searchTerm)
      );
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(exp => exp.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "amount") {
        aVal = Number(a.amount);
        bVal = Number(b.amount);
      } else if (sortField === "category") {
        aVal = a.category;
        bVal = b.category;
      } else {
        aVal = new Date(a.created_at || Date.now());
        bVal = new Date(b.created_at || Date.now());
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredExpenses(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`/expenses/${id}`);
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete expense");
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (loading) {
    return <div className="loading-container">Loading expenses...</div>;
  }

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Expense Management</h2>
        <div className="total-badge">
          <span>Total Amount</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by category or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-input"
            >
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("category")}>
                Category {getSortIcon("category")}
              </th>
              <th onClick={() => handleSort("amount")}>
                Amount {getSortIcon("amount")}
              </th>
              <th onClick={() => handleSort("date")}>
                Date {getSortIcon("date")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-state">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense.id} className="expense-row">
                  <td>
                    <span className="category-badge">
                      {expense.category}
                      {!["Food", "Travel", "Shopping", "Entertainment", "Bills", "Other"].includes(expense.category) && (
                        <span className="custom-badge">Custom</span>
                      )}
                    </span>
                  </td>
                  <td className="amount-cell">₹{expense.amount}</td>
                  <td>{new Date(expense.created_at || Date.now()).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-expense/${expense.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;