import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExamResult } from '../services/QuestionService';

const ResultPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        console.log(resultId)
        const data = await getExamResult(resultId);
        setResult(data);
      } catch (error) {
        console.error('Error fetching result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) return <p>Loading result...</p>;

  return (
    <div>
      <h1>Exam Result</h1>
      {result ? (
        <div>
          <p>Total Questions: {result.totalQuestions}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
          <p>Status: {result.passed ? 'Passed' : 'Failed'}</p>
        </div>
      ) : (
        <p>No result found.</p>
      )}
    </div>
  );
};

export default ResultPage;
