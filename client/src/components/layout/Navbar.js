import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.email?.split('@')[0] || "User");
      } catch (e) {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <h3>Financial Overview</h3>
      </div>

      <div className="search-box">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search expenses..." />
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <FiBell size={20} />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-section" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">Premium Member</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <button className="dropdown-item">
              <FiUser /> Profile
            </button>
            <button className="dropdown-item">
              <FiSettings /> Settings
            </button>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;