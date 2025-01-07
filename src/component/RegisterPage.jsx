import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password } = formData;

    // Simple validation
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("All fields are required.");
      setSuccessMessage("");
      return;
    }

    try {
      // Send a POST request to the backend
      const response = await axios.post("http://localhost:8081/api/users/register", formData);

      // Extract the success message from the JSON response
      setSuccessMessage(response.data.message); // Assuming `message` is in the response
      setErrorMessage("");

      // Reset the form fields
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your first name"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter your last name"
          />
        </div>
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
          Register
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
      </form>
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
  success: {
    color: "green",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default RegisterPage;
