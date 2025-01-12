import React, { useState, useEffect } from 'react';
import { getQuestionsByExamId, submitExamResult, saveExamProgress, getExamProgress, deleteExamProgress, getQuestionsByExamId_Exam, calculateAndSaveResult } from '../services/QuestionService'; // Import submitExamResult API
import { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
const QuestionList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { examId } = useParams(); // Extract examId from the URL
    const [questions, setQuestions] = useState([]);
    const [questions1, setQuestions1] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(1); // Display one question per page
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false); // To show a loading state
    const [selectedOptions, setSelectedOptions] = useState({}); // Store selected options for each question
    const [submitted, setSubmitted] = useState(false); // Track if the exam has been submitted
    const [totelQuestion,setTotelQuestion]=useState(0)  //number of question
    const [totelCorrectAnswer,setTotelCorrectAnswer]=useState(0)// totel correct answers
    const [userId,setUserId]=useState(1)
    const [examProgressId,setExamProId]=useState(0)
    
    
    const [isPassed,setIsPassed]=useState(false)

    useEffect(() => {
        loadProgress();
    }, [examId]);

    useEffect(() => {
        fetchQuestions();
    }, [page, examId]);
//getting all questuins of an exam
    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await getQuestionsByExamId(examId, page, size);
            setQuestions(data.content);
            setQuestions1([...questions1,...data.content])
            
            setTotalPages(data.totalPages || 0);
            console.log(questions)
        } catch (error) {
            console.error('Error fetching questions:', error);
            setQuestions([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, option) => {
        const updatedOptions = { ...selectedOptions, [questionId]: option };
        setSelectedOptions((prev) => ({
            ...prev,
            [questionId]: option,
        }));
        console.log(page)
        saveProgress(updatedOptions);
        
    };

    //saving the exam progress
    const saveProgress = async (updatedOptions) => {
        try {
            await saveExamProgress({
                examId,
                userAnswers: updatedOptions,
                currentPage: page,
                userId: 1,
            });
            const progress = await getExamProgress(userId,examId);
            if (progress) {
                setExamProId(progress.id)
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    //loading if the exam have any progress
    const loadProgress = async () => {
        try {
            const progress = await getExamProgress(userId,examId);
            console.log(progress)
            if (progress) {
                setSelectedOptions(progress.userAnswers || {});
                setPage(progress.currentPage || 0);
                setExamProId(progress.id)
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };


    const handleNext = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePrevious = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    //we calculate the result
    const calculateResult = () => {
        let totalQuestions = questions1.length; // Total number of questions
        //const userAnswerFromProgress = await getExamProgress(userId,examId);
        //const questionAnswerFromQuestion= await getQuestionsByExamId_Exam(examId);
        //console.log(userAnswerFromProgress);
        //console.log(questionAnswerFromQuestion);
        let correctAnswers = 0;
        let incorrectAnswers = 0;
    
        questions1.forEach((question,index) => {
            const userAnswer = selectedOptions[question.id];
            console.log(question.correct_option)
            if (userAnswer === question.correct_option) {
                correctAnswers += 1;
            } else {
                incorrectAnswers += 1;
            }
        });
    
        const passThreshold = 0.5; // Define a pass threshold (e.g., 50%)
        const isPassed = correctAnswers / totalQuestions >= passThreshold;
    
        // Update the state with calculated results
        setTotelQuestion(totalQuestions);
        setTotelCorrectAnswer(correctAnswers);
        setIsPassed(isPassed);
    
        return {
            totalQuestions,
            correctAnswers,
            isPassed,
        };
    };
    

    const handleSubmit = async () => {
      
        try {
            console.log('submit exam and calculate result')
           
           const result= await calculateAndSaveResult(examProgressId)
           const resultId=result.data
            setSubmitted(true);
            console.log(resultId)
            navigate(`/result/${resultId}`);
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Failed to submit exam. Please try again.');
        }
         //deleting progress
        try {
            console.log("deleting existed progress")
            console.log("deleted")
            await deleteExamProgress(examProgressId); //API call to delete the existing progress
            
        } catch (error) {
            console.error('Error submitting Deleting', error);
            alert('Failed to to delete the existed exam progress.');
        }

    };
    
    

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Questions for Exam ID: {examId}</h1>

            {loading && <p style={styles.loading}>Loading questions...</p>}

            {!loading && questions.length > 0 && !submitted ? (
                <div>
                    {questions.map((question, index) => (
                        <div key={index} style={styles.questionCard}>
                            <h3 style={styles.questionContent}>{question.content}</h3>
                            <ul style={styles.optionsList}>
                                {[1, 2, 3, 4].map((num) => {
                                    const option = question[`option_${num}`];
                                    if (option) {
                                        return (
                                            <li
                                                key={num}
                                                style={
                                                    selectedOptions[question.id] === option
                                                        ? styles.selectedOption
                                                        : styles.option
                                                }
                                                onClick={() =>
                                                    handleOptionSelect(question.id, option)
                                                }
                                            >
                                                {option}
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                            <p style={styles.detail}>
                                <strong>Correct Answer:</strong> {question.correct_option}
                            </p>
                            <p style={styles.detail}>
                                <strong>Difficulty:</strong> {question.difficulty}
                            </p>
                            <p style={styles.detail}>
                                <strong>Topic:</strong> {question.topic}
                            </p>
                        </div>
                    ))}

                    <div style={styles.pagination}>
                        <button
                            onClick={handlePrevious}
                            disabled={page === 0}
                            style={page === 0 ? styles.disabledButton : styles.button}
                        >
                            Previous
                        </button>
                        <span style={styles.pageInfo}>
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={page >= totalPages - 1}
                            style={page >= totalPages - 1 ? styles.disabledButton : styles.button}
                        >
                            Next
                        </button>
                    </div>

                    {page === totalPages - 1 && ( // Show only on the last page
                       <div style={styles.submitContainer}>
                       <button style={styles.submitButton} onClick={handleSubmit}>
                         Submit Exam
                      </button>
    </div>
)}

                </div>
            ) : !loading && !submitted ? (
                <p style={styles.noQuestions}>No questions found.</p>
            ) : (
                <p style={styles.submitted}>Exam submitted successfully. Thank you!</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    loading: {
        textAlign: 'center',
        color: '#555',
        fontSize: '16px',
    },
    questionCard: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    questionContent: {
        color: '#222',
        marginBottom: '10px',
    },
    optionsList: {
        listStyleType: 'none',
        padding: 0,
        margin: '10px 0',
    },
    option: {
        padding: '8px',
        backgroundColor: '#e8e8e8',
        marginBottom: '5px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    selectedOption: {
        padding: '8px',
        backgroundColor: '#007BFF',
        color: '#fff',
        marginBottom: '5px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    detail: {
        margin: '5px 0',
        color: '#555',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    disabledButton: {
        padding: '10px 20px',
        backgroundColor: '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'not-allowed',
    },
    pageInfo: {
        fontSize: '14px',
        color: '#555',
    },
    submitContainer: {
        textAlign: 'center',
        marginTop: '20px',
    },
    submitButton: {
        padding: '12px 24px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    submitted: {
        textAlign: 'center',
        color: '#007BFF',
    },
    noQuestions: {
        textAlign: 'center',
        color: '#777',
    },
};

export default QuestionList; 