import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const WelcomePage = () => {
  const location = useLocation();
  const { message } = location.state || {};
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  // Fetch available exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8081/api/user/exams", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExams(response.data);
      } catch (error) {
        console.error("Failed to fetch exams:", error.response?.data?.message || error.message);
      }
    };

    fetchExams();
  }, []);

  // Navigate to the exam start page
  const handleStartExam = (examId) => {
    navigate(`/exams/${examId}`);
  };

  // Styling object
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    header: {
      textAlign: 'center',
      color: '#4CAF50',
      borderBottom: '2px solid #4CAF50',
      paddingBottom: '10px',
    },
    list: {
      listStyle: 'none',
      padding: '0',
      marginTop: '20px',
    },
    listItem: {
      marginBottom: '15px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      transition: 'transform 0.2s',
    },
    listItemHover: {
      transform: 'scale(1.02)',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Available Exams</h2>
      <ul style={styles.list}>
        {exams.map((exam) => (
          <li
            key={exam.id}
            style={styles.listItem}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <button
              style={styles.button}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
              onClick={() => handleStartExam(exam.id)}
            >
              {exam.title} (Total Questions: {exam.numberOfQuestion})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WelcomePage;