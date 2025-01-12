import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/LoginPage";
import WelcomePage from "./component/WelcomePage";
import RegisterPage from "./component/RegisterPage";
import Navbar from './component/Navbar';
import { useEffect, useState } from 'react';
import QuestionList from './component/QuestionList';
import ExamPage from './component/ExamPage';
import AdminLogin from './component/AdminLogin';
import AdminDashBoard from './component/AdminDashBoard';
import ResultPage from './component/ResultPage';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
   // Check login status on app load
   useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  return (
    <div className="App">
      
      
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Add register route */}
        <Route path="/exams/:examId" element={<QuestionList />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashBoard />} />
        <Route path="/result/:resultId" element={<ResultPage />} />
      </Routes>
     
    
    </div>
  );
}

export default App;
