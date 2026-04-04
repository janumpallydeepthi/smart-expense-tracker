import { useEffect, useState } from "react";
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
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [highest, setHighest] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    fetchExpenses();
    return () => {
    };
  }, []);

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

  const calculateStats = (data) => {
    const totalAmount = data.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const avgAmount = data.length ? totalAmount / data.length : 0;
    const highestAmount = data.length ? Math.max(...data.map(exp => Number(exp.amount))) : 0;
    
    setTotal(totalAmount);
    setAverage(avgAmount);
    setHighest(highestAmount);
  };

  const processCategoryData = (data) => {
    const categories = {};
    data.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + Number(exp.amount);
    });
    setCategoryData(categories);
  };

  const processMonthlyData = (data) => {
    const months = {};
    data.forEach(exp => {
      const date = new Date(exp.created_at || Date.now());
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      months[monthYear] = (months[monthYear] || 0) + Number(exp.amount);
    });
    setMonthlyData(months);
  };

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'],
        borderWidth: 0,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Expenses (₹)',
        data: Object.values(monthlyData),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(monthlyData).slice(-6),
    datasets: [
      {
        label: 'Spending Trend (₹)',
        data: Object.values(monthlyData).slice(-6),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const recentExpenses = [...expenses].sort((a, b) => b.id - a.id).slice(0, 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 12 } },
      },
    },
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Financial Dashboard</h2>
        <p>Track and analyze your spending patterns</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span>Total Expenses</span>
          </div>
          <div className="stat-value">₹{total.toFixed(2)}</div>
          <div className="stat-footer trend-up">↑ 12% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Average Expense</span>
          </div>
          <div className="stat-value">₹{average.toFixed(2)}</div>
          <div className="stat-footer">Per transaction</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Highest Expense</span>
          </div>
          <div className="stat-value">₹{highest.toFixed(2)}</div>
          <div className="stat-footer trend-up">Monitor this category</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Total Transactions</span>
          </div>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-footer">All time entries</div>
        </div>
      </div>

      <div className="charts-grid">
        {Object.keys(categoryData).length > 0 && (
          <div className="chart-card">
            <div className="chart-title">Expense Distribution by Category</div>
            <div className="chart-container">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {Object.keys(monthlyData).length > 0 && (
          <div className="chart-card">
            <div className="chart-title">Monthly Expense Trend</div>
            <div className="chart-container">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {Object.keys(monthlyData).length > 0 && (
          <div className="chart-card">
            <div className="chart-title">Spending Pattern Analysis</div>
            <div className="chart-container">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        )}

        <div className="chart-card">
          <div className="chart-title">Financial Insights</div>
          <div className="insights-content">
            {total > 5000 && (
              <p className="insight-warning">Your total expenses exceed ₹5000. Consider budget optimization.</p>
            )}
            {average > 1000 && (
              <p className="insight-info">Average expense is relatively high. Review large transactions.</p>
            )}
            {Object.keys(categoryData).length > 0 && (
              <p className="insight-success">
                Highest spending category: {Object.entries(categoryData).sort((a,b) => b[1] - a[1])[0][0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <div className="section-header">
          <h3>Recent Transactions</h3>
          <a href="/expenses" className="view-all">View All →</a>
        </div>
        
        {recentExpenses.length === 0 ? (
          <div className="empty-state">
            <p>No transactions recorded yet.</p>
            <p>Add your first expense to get started.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="category-details">
                    <h4>{expense.category}</h4>
                    <p>Expense Transaction</p>
                  </div>
                </div>
                <div className="transaction-amount">
                  <div className="amount">₹{expense.amount}</div>
                  <div className="date">{new Date(expense.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;