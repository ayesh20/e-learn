import React, { useState } from 'react';
import { Mail, User } from 'lucide-react';
import styles from './QuizInstructor.module.css';
import Footer from '../../components/Footer/Footer.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';

const QuizResults = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  
  const results = {
    1: 'correct',
    2: 'correct', 
    3: 'incorrect',
    4: 'correct',
    5: 'correct',
    6: 'correct',
    7: 'correct',
    8: 'correct',
    9: 'correct',
    10: 'incorrect',
    11: 'correct',
    12: 'correct',
    13: 'correct',
    14: 'correct',
    15: 'correct',
    16: 'correct',
    17: 'correct',
    18: 'correct',
    19: 'correct',
    20: 'incorrect'
  };

  const getQuestionClassName = (questionNum) => {
    const result = results[questionNum];
    if (result === 'correct') return `${styles.questionNumber} ${styles.questionCorrect}`;
    if (result === 'incorrect') return `${styles.questionNumber} ${styles.questionIncorrect}`;
    return `${styles.questionNumber} ${styles.questionDefault}`;
  };

  const handleQuestionClick = (questionNum) => {
    setSelectedQuestion(questionNum);
  };

  const handleExit = () => {
    // Handle exit logic
    console.log('Exiting quiz results');
  };

  const correctAnswers = Object.values(results).filter(result => result === 'correct').length;
  const totalQuestions = questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className={styles.quizResultsPage}>
      <Navbar />
      
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Question Grid Section */}
          <div className={styles.questionGrid}>
            {questions.map(questionNum => (
              <div
                key={questionNum}
                className={getQuestionClassName(questionNum)}
                onClick={() => handleQuestionClick(questionNum)}
              >
                {questionNum}
              </div>
            ))}
          </div>

          {/* Results Section */}
          <div className={styles.resultsSection}>
            <div className={styles.marksContainer}>
              <h2 className={styles.marksTitle}>Marks</h2>
              <div className={styles.percentageCard}>
                <span className={styles.percentageText}>{percentage}%</span>
              </div>
            </div>

            <button className={styles.exitButton} onClick={handleExit}>
              Exit
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizResults;