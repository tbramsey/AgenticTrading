import React from "react";
import { NavLink } from "react-router-dom";
import BerryLogo from "../assets/berry_logo.png";

const NavBar = () => {
  // components/NavBar.js

    const navStyle = {
        width: "100%",     // 100% of viewport width
        borderRadius: 0,    // Sharp corners
        
        // ... your other styles ...
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent", // Transparent background
        padding: "15px 30px",
        color: "white",
        boxSizing: "border-box", // Ensures padding doesn't make it wider than 100%
    };

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    marginRight: "20px",
  };

  const activeStyle = {
    textDecoration: "underline",
    color: "#3498db", // Highlight color for the active page
  };

  return (
    <nav style={navStyle}>
      {/* Logo or App Name */}
      <img src={BerryLogo} alt="Logo" height="60" width="60" />

      {/* Navigation Links */}
      <div>
        <NavLink 
          to="/dashboard" 
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/stocks" 
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Stocks
        </NavLink>
        
        <NavLink 
          to="/trading" 
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Trading
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;