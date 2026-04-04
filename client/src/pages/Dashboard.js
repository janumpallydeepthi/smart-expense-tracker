import { useEffect, useState } from "react";
import axios from "axios";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3001/api/expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch expenses");
    }
  };

  // ADD EXPENSE
  const addExpense = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/expenses",
        { amount, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAmount("");
      setCategory("");
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  // DELETE EXPENSE
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3001/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // GROUP BY CATEGORY
    const categoryData = {};

    expenses.forEach((exp) => {
    if (categoryData[exp.category]) {
        categoryData[exp.category] += Number(exp.amount);
    } else {
        categoryData[exp.category] = Number(exp.amount);
    }
    });

    // CHART DATA
    const data = {
    labels: Object.keys(categoryData),
    datasets: [
        {
        data: Object.values(categoryData),
        backgroundColor: ["red", "blue", "green", "orange"],
        },
    ],
    };

  useEffect(() => {
    fetchExpenses();
  }, []);

return (
  <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
    
    {/* LOGOUT */}
    <button onClick={handleLogout}>Logout</button>

    <h2>Dashboard</h2>

    {/* ADD EXPENSE */}
    <h3>Add Expense</h3>

    <input
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
    />

    <br /><br />

    <input
      type="text"
      placeholder="Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    <br /><br />

    <button onClick={addExpense}>Add Expense</button>

    <hr />

    {/* TOTAL */}
    <h3>Total: ₹{total}</h3>

    {/* CHART */}
    <h3>Expense Breakdown</h3>
    <Pie data={data} />

    <hr />

    {/* EXPENSE LIST */}
    {expenses.length === 0 ? (
      <p>No expenses found</p>
    ) : (
      expenses.map((exp) => (
        <div key={exp.id}>
          <p><b>Amount:</b> {exp.amount}</p>
          <p><b>Category:</b> {exp.category}</p>

          <button onClick={() => deleteExpense(exp.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))
    )}
  </div>
);
}

export default Dashboard;