import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const LoginPage = ({onLogin}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Log to check this line runs
  
    try {
      
      const response = await axios.post("http://localhost:8081/api/users/login", formData);
      console.log("Response from API:", response.data); // Log the API response
      if (response.data.success) {
        console.log("Navigating to welcome page with message:", response.data.message);
        localStorage.setItem("token", response.data.token);
         onLogin(); // Notify parent about login
        navigate("/welcome", { state: { message: response.data.message } });
      }else{
        setErrorMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your email"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </form>
      <button style={styles1.registerButton} onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  button: {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  
};

const styles1 = {
  // Existing styles...
  registerButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
};




export default LoginPage;
