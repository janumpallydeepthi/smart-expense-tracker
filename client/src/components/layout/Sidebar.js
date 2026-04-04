import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">💰</div>
        <div className="logo-text">
          <h2>SmartTracker</h2>
          <p>Expense Manager</p>
        </div>
      </div>

      <nav>
        <NavLink to="/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-label">Dashboard</span>
        </NavLink>
        
        <NavLink to="/expenses" className="nav-item">
          <span className="nav-icon">💳</span>
          <span className="nav-label">Expenses</span>
        </NavLink>
        
        <NavLink to="/add-expense" className="nav-item">
          <span className="nav-icon">➕</span>
          <span className="nav-label">Add Expense</span>
          <span className="nav-badge">NEW</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <p>Save 20% by tracking daily expenses!</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;