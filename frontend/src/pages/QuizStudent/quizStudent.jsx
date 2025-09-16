import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Quiz1Student.module.css';
import Footer from '../../components/Footer/Footer.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';

const QuizStudent = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(7);

  const questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  
  const answers = [
    { id: 1, text: 'Amazon S3' },
    { id: 2, text: 'Amazon S3' },
    { id: 3, text: 'Amazon S3' },
    { id: 4, text: 'Amazon S3' }
  ];

  const getQuestionClassName = (questionNum) => {
    if (questionNum < currentQuestion) return `${styles.questionNumber} ${styles.questionCompleted}`;
    if (questionNum === currentQuestion) return `${styles.questionNumber} ${styles.questionCurrent}`;
    return `${styles.questionNumber} ${styles.questionUpcoming}`;
  };

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleNext = () => {
    if (currentQuestion < 20) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
  };

  const handleSave = () => {
    console.log('Answer saved:', selectedAnswer);
  };

  const handleQuestionClick = (questionNum) => {
    setCurrentQuestion(questionNum);
    setSelectedAnswer(null);
  };

  return (
    <div className={styles.quizStudentPage}>
      <Navbar />
      
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
          
          <button className={styles.finishedButton}>
            Finished
          </button>
        </div>

        {/* Quiz Content Section */}
        <div className={styles.quizContent}>
          <div className={styles.questionHeader}>
            <span className={styles.questionLabel}>Question</span>
            <span className={styles.questionNumberDisplay}>{currentQuestion}</span>
          </div>
          
          <div className={styles.questionContent}>
            <h2>Which AWS service is used to launch and manage virtual servers in the cloud?</h2>
          </div>

          <div className={styles.answersSection}>
            <h3 className={styles.sectionTitle}>Answers</h3>
            
            <div className={styles.answerOptions}>
              {answers.map(answer => (
                <label 
                  key={answer.id}
                  className={`${styles.answerOption} ${
                    selectedAnswer === answer.id ? styles.answerSelected : ''
                  }`}
                >
                  <input 
                    type="radio" 
                    name="answer" 
                    value={answer.id}
                    checked={selectedAnswer === answer.id}
                    onChange={() => handleAnswerSelect(answer.id)}
                  />
                  <span className={styles.answerNumber}>{answer.id}</span>
                  <span className={styles.answerText}>{answer.text}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.quizNavigation}>
            <button 
              className={styles.previousButton}
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className={styles.actionButtons}>
              <button className={styles.resetButton} onClick={handleReset}>
                Reset
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                Save
              </button>
            </div>

            <button 
              className={styles.nextButton} 
              onClick={handleNext}
              disabled={currentQuestion === 20}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizStudent;