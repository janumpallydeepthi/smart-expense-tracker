import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "./Dashboard.css";

import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [highest, setHighest] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ---------------- FETCH EXPENSES ----------------
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/expenses");
      setExpenses(res.data);
      calculateStats(res.data);
      processCategoryData(res.data);
      processMonthlyData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- STATS ----------------
  const calculateStats = (data) => {
    const totalAmount = data.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const avgAmount = data.length ? totalAmount / data.length : 0;
    const highestAmount = data.length
      ? Math.max(...data.map((exp) => Number(exp.amount)))
      : 0;

    setTotal(totalAmount);
    setAverage(avgAmount);
    setHighest(highestAmount);
  };

  // ---------------- CATEGORY DATA ----------------
  const processCategoryData = (data) => {
    const categories = {};
    data.forEach((exp) => {
      categories[exp.category] =
        (categories[exp.category] || 0) + Number(exp.amount);
    });
    setCategoryData(categories);
  };

  // ---------------- MONTHLY DATA ----------------
  const processMonthlyData = (data) => {
    const months = {};
    data.forEach((exp) => {
      const date = new Date(exp.created_at || Date.now());
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      months[monthYear] =
        (months[monthYear] || 0) + Number(exp.amount);
    });
    setMonthlyData(months);
  };

  // ---------------- DELETE ACCOUNT ----------------
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete your account and ALL your expenses. This cannot be undone!"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete("/users/me");
      alert("Account deleted successfully");

      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Failed to delete account. Please try again.");
    }
  };

  // ---------------- CHART DATA ----------------
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f59e0b",
          "#10b981",
          "#ef4444",
          "#06b6d4",
        ],
        borderWidth: 0,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Expenses (₹)",
        data: Object.values(monthlyData),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "#6366f1",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(monthlyData).slice(-6),
    datasets: [
      {
        label: "Spending Trend (₹)",
        data: Object.values(monthlyData).slice(-6),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const recentExpenses = [...expenses]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 12 } },
      },
    },
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  // ---------------- UI ----------------
  return (
    <div className="dashboard">

      <div className="welcome-section">
        <h2>Financial Dashboard</h2>
        <p>Track and analyze your spending patterns</p>
      </div>

      {/* ---------------- STATS ---------------- */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Expenses</span>
          <div className="stat-value">₹{total.toFixed(2)}</div>
        </div>

        <div className="stat-card">
          <span>Average Expense</span>
          <div className="stat-value">₹{average.toFixed(2)}</div>
        </div>

        <div className="stat-card">
          <span>Highest Expense</span>
          <div className="stat-value">₹{highest.toFixed(2)}</div>
        </div>

        <div className="stat-card">
          <span>Total Transactions</span>
          <div className="stat-value">{expenses.length}</div>
        </div>
      </div>

      {/* ---------------- CHARTS ---------------- */}
      <div className="charts-grid">
        {Object.keys(categoryData).length > 0 && (
          <div className="chart-card">
            <div className="chart-title">Expense Distribution</div>
            <div className="chart-container">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {Object.keys(monthlyData).length > 0 && (
          <>
            <div className="chart-card">
              <div className="chart-title">Monthly Trend</div>
              <div className="chart-container">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-title">Spending Pattern</div>
              <div className="chart-container">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------------- RECENT EXPENSES (FIXED) ---------------- */}
      <div className="recent-transactions">
        <h3>Recent Transactions</h3>

        {recentExpenses.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          recentExpenses.map((expense) => (
            <div key={expense.id} className="transaction-item">
              <div className="transaction-info">
                <div className="category-details">
                  <h4>{expense.category}</h4>
                  <p>
                    {new Date(expense.created_at).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="transaction-amount">
                <div className="amount">₹{expense.amount}</div>
                <div className="date">
                  {new Date(expense.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---------------- DELETE ACCOUNT ---------------- */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={handleDeleteAccount}
          style={{
            padding: "12px 30px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}

export default Dashboard;