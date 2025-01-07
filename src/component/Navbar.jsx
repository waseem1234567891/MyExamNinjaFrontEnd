import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/");

    
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Exam Ninja</h2>
      <ul style={styles.navLinks}>
        {!isLoggedIn ? (
          <>
            <li>
              <NavLink to="/" style={styles.link}>Login</NavLink>
            </li>
            <li>
              <NavLink to="/register" style={styles.link}>Signup</NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/welcome" style={styles.link}>Dashboard</NavLink>
            </li>
            <li>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "#fff",
  },
  logo: {
    fontSize: "1.5em",
  },
  navLinks: {
    display: "flex",
    listStyleType: "none",
    gap: "15px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  
  logoutButton: {
    background: "none",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "1em",
  },
  
};

export default Navbar;
