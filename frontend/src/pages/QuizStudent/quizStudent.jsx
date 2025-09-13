import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import React, { useState } from 'react';
import styles from './QuizStudent.modules.css'; 

const QuizStudent = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(7);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
  };

  const handleSave = () => {
    // Save logic here
    console.log('Answer saved:', selectedAnswer);
  };

  return (
    <>
      <Navbar />
      <div className={styles.quizStudentPage}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.tags}>
              <span className={styles.tag}>Photography</span>
              <span className={styles.author}>by DeterminedPoitras</span>
            </div>
            <h1>The Ultimate Guide To The Best WordPress LMS Plugin</h1>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <i className="fas fa-calendar-alt"></i>
                <span>2 Weeks</span>
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-users"></i>
                <span>156 Students</span>
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-signal"></i>
                <span>All levels</span>
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-question-circle"></i>
                <span>3 Quizzes</span>
              </div>
            </div>
          </div>
          <div className={styles.promoCard}>
            <img src="https://picsum.photos/250/150" alt="Promo" className={styles.promoImage} />
            <p className={styles.promoTitle}>Create an LMS website</p>
            <div className={styles.promoPricing}>
              <span className={styles.oldPrice}>$59.0</span>
              <span className={styles.newPrice}>$49.0</span>
            </div>
            <button className={styles.startNowButton}>Start Now</button>
          </div>
        </div>

        {/* Main Quiz Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.quizContainer}>
            {/* Question Section */}
            <div className={styles.questionSection}>
              <div className={styles.questionHeader}>
                <span className={styles.questionLabel}>Question</span>
                <span className={styles.questionNumber}>{currentQuestion}</span>
              </div>
              
              <div className={styles.questionContent}>
                <h2>Which AWS service is used to launch and manage virtual servers in the cloud?</h2>
              </div>

              <div className={styles.answersSection}>
                <h3>Answers</h3>
                
                <div className={styles.answerOptions}>
                  <label className={styles.answerOption}>
                    <input 
                      type="radio" 
                      name="answer" 
                      value="1"
                      checked={selectedAnswer === 1}
                      onChange={() => handleAnswerSelect(1)}
                    />
                    <span className={styles.answerNumber}>1</span>
                    <span className={styles.answerText}>Amazon S3</span>
                  </label>

                  <label className={styles.answerOption}>
                    <input 
                      type="radio" 
                      name="answer" 
                      value="2"
                      checked={selectedAnswer === 2}
                      onChange={() => handleAnswerSelect(2)}
                    />
                    <span className={styles.answerNumber}>2</span>
                    <span className={styles.answerText}>Amazon S3</span>
                  </label>

                  <label className={styles.answerOption}>
                    <input 
                      type="radio" 
                      name="answer" 
                      value="3"
                      checked={selectedAnswer === 3}
                      onChange={() => handleAnswerSelect(3)}
                    />
                    <span className={styles.answerNumber}>3</span>
                    <span className={styles.answerText}>Amazon S3</span>
                  </label>

                  <label className={styles.answerOption}>
                    <input 
                      type="radio" 
                      name="answer" 
                      value="4"
                      checked={selectedAnswer === 4}
                      onChange={() => handleAnswerSelect(4)}
                    />
                    <span className={styles.answerNumber}>4</span>
                    <span className={styles.answerText}>Amazon S3</span>
                  </label>
                </div>
              </div>

              {/* Navigation and Action Buttons */}
              <div className={styles.quizNavigation}>
                <button 
                  className={styles.previousButton}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 1}
                >
                  &lt; Previous
                </button>
                
                <div className={styles.actionButtons}>
                  <button className={styles.resetButton} onClick={handleReset}>
                    Reset
                  </button>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Save
                  </button>
                </div>

                <button className={styles.nextButton} onClick={handleNext}>
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizStudent;