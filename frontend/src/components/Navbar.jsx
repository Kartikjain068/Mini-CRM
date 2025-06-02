import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      navigate("/"); // or navigate("/login") depending on your setup
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Mini CRM</div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={({ isActive }) => isActive ? "active" : ""}>
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/campaigns" className={({ isActive }) => isActive ? "active" : ""}>
            Campaigns
          </NavLink>
        </li>
        <li>
          <NavLink to="/segments" className={({ isActive }) => isActive ? "active" : ""}>
            Segments
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
