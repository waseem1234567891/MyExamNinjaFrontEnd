import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ExamPage = () => {
  const { examId } = useParams(); // Get the exam ID from the URL
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  // Fetch exam details
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8081/api/user/exams/${examId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExam(response.data);
      } catch (error) {
        console.error("Failed to fetch exam details:", error.response?.data?.message || error.message);
      }
    };

    fetchExam();
  }, [examId]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);

    // Move to the next question or finish
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishExam();
    }
  };

  // Handle exam submission
  const handleFinishExam = () => {
    console.log("Exam finished, answers submitted:", answers);
    // Send answers to backend if required
    navigate("/dashboard"); // Redirect back to dashboard after submission
  };

  if (!exam) return <div>Loading...</div>;

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div>
      <h2>{exam.title}</h2>
      <div>
        <h3>Question {currentQuestionIndex + 1} of {exam.questions.length}</h3>
        <p>{currentQuestion.text}</p>
        <ul>
          {currentQuestion.options.map((option, index) => (
            <li key={index}>
              <button onClick={() => handleAnswer(option)}>{option}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExamPage;
