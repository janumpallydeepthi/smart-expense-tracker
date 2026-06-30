import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import "./Dashboard.css";
import { FaWallet, FaChartLine, FaTrophy, FaList } from 'react-icons/fa';

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
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        '#a5b4fc', // light indigo
        '#fcd34d', // light amber
        '#6ee7b7', // light emerald
        '#fca5a5', // light red
        '#fdba74', // light orange
        '#c4b5fd', // light purple
        '#f9a8d4', // light pink
        '#67e8f9', // light cyan
      ],
      borderWidth: 0,
    }],
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
    <div className="dashboard fade-in">
      <div className="mb-4">
        <h2 className="fw-bold" style={{ fontSize: '28px', color: 'var(--slate-900)' }}>
          Financial Dashboard
        </h2>
        <p className="text-secondary">Track and analyze your spending patterns</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-lg-6 col-md-6 col-6">
          <div className="card border-0 shadow-soft rounded-xl h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary-gradient rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, flexShrink: 0 }}>
                <FaWallet className="text-white" size={20} />
              </div>
              <div>
                <span className="text-secondary fw-medium d-block">Total Expenses</span>
                <h4 className="fw-bold m-0">₹{total.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-soft rounded-xl h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary-gradient rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, flexShrink: 0 }}>
                <FaChartLine className="text-white" size={20} />
              </div>
              <div>
                <span className="text-secondary fw-medium d-block">Average Expense</span>
                <h4 className="fw-bold m-0">₹{average.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6 col-6">
          <div className="card border-0 shadow-soft rounded-xl h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary-gradient rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, flexShrink: 0 }}>
                <FaTrophy className="text-white" size={20} />
              </div>
              <div>
                <span className="text-secondary fw-medium d-block">Highest Expense</span>
                <h4 className="fw-bold m-0">₹{highest.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-md-6 col-6">
          <div className="card border-0 shadow-soft rounded-xl h-100">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary-gradient rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, flexShrink: 0 }}>
                <FaList className="text-white" size={20} />
              </div>
              <div>
                <span className="text-secondary fw-medium d-block">Transactions</span>
                <h4 className="fw-bold m-0">{expenses.length}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        {Object.keys(categoryData).length > 0 && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-soft rounded-xl h-100">
              <div className="card-body">
                <h6 className="fw-semibold">Expense Distribution</h6>
                <div style={{ height: 280 }}>
                  <Pie data={pieChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
        {Object.keys(monthlyData).length > 0 && (
          <>
            <div className="col-lg-6">
              <div className="card border-0 shadow-soft rounded-xl h-100">
                <div className="card-body">
                  <h6 className="fw-semibold">Monthly Trend</h6>
                  <div style={{ height: 280 }}>
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card border-0 shadow-soft rounded-xl">
                <div className="card-body">
                  <h6 className="fw-semibold">Spending Pattern</h6>
                  <div style={{ height: 280 }}>
                    <Line data={lineChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="card border-0 shadow-soft rounded-xl">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold m-0">Recent Transactions</h6>
            <a href="/expenses" className="text-primary text-decoration-none small fw-semibold">View All →</a>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-center text-secondary my-4">No transactions yet.</p>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <div>
                  <div className="fw-semibold">{expense.category}</div>
                  <small className="text-secondary">{new Date(expense.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                </div>
                <div className="text-end">
                  <div className="fw-bold" style={{ color: 'var(--slate-900)' }}>₹{expense.amount}</div>
                  <small className="text-secondary">{new Date(expense.created_at).toLocaleTimeString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Account */}
      <div className="text-center mt-4">
        <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete My Account</button>
      </div>
    </div>
  );
}

export default Dashboard;