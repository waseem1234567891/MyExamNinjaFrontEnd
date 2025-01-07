import axios from 'axios';

const API_BASE_URL = "http://localhost:8081/api/user";

export const getQuestionsByExamId = async (examId, page, size) => {
    const response = await axios.get(`${API_BASE_URL}/exams/${examId}`, {
        params: { page, size }
    });
    //console.log(response)
    return response.data;
};

// API call to submit exam results
export const submitExamResult = async (submissionData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/result`, submissionData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return response from backend
    } catch (error) {
        console.error('Error submitting exam result:', error);
        throw error; // Propagate error to the caller
    }
};


/**
 * Save exam progress to the back-end.
 * @param {Object} progressData - The data to be saved.
 * @param {number} progressData.userId - The ID of the user.
 * @param {number} progressData.examId - The ID of the exam.
 * @param {Object} progressData.selectedOptions - Selected answers for each question.
 * @param {number} progressData.currentPage - The current page the user is on.
 * @returns {Promise<void>} - A promise that resolves when the progress is saved.
 */
//saving the progress
export const saveExamProgress = async (progressData) => {
    try {
        await axios.post("http://localhost:8081/api/progress/save", progressData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Progress saved successfully.');
    } catch (error) {
        console.error('Error saving progress:', error);
        throw error;
    }
};

/**
 * Fetch saved exam progress from the back-end.
 * @param {number} userId - The ID of the user.
 * @param {number} examId - The ID of the exam.
 * @returns {Promise<Object>} - A promise that resolves with the saved progress data.
 */

//getting exam
export const getExamProgress = async (userId, examId) => {
    try {
        const response = await axios.get("http://localhost:8081/api/progress/get", {
            params: { userId, examId },
        });
        return response.data; // Assume the back-end returns the progress object
    } catch (error) {
        console.error('Error fetching exam progress:', error);
        throw error;
    }
};


//delete the progress when exam is submitted
export const deleteExamProgress = async (userId, examId) => {
    const response = await fetch(`http://localhost:8081/api/progress/exam-progress?userId=${userId}&examId=${examId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete exam progress');
    }
    return await response.json();
};

