import React, { useState, useEffect } from "react";
import styles from "./QuizSection.module.css";

const QuizSection = ({ quizzes = [], onChange }) => {
  const [activeQuiz, setActiveQuiz] = useState(0);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState(Array.from({ length: 15 }, (_, i) => i + 1));
  const [error, setError] = useState(null);
  
  // Current question data
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: ''
  });

  // Initialize quizzes if empty
  useEffect(() => {
    if (quizzes.length === 0) {
      onChange([{ 
        id: 1, 
        name: "Quiz 1",
        description: "",
        timeLimit: 30,
        attempts: 3,
        passingScore: 70,
        questions: [],
        isActive: true
      }]);
    }
  }, []);

  // Load current question data when page or quiz changes
  useEffect(() => {
    if (quizzes[activeQuiz]?.questions[page - 1]) {
      const q = quizzes[activeQuiz].questions[page - 1];
      setCurrentQuestion({
        question: q.question,
        answer1: q.options[0] || '',
        answer2: q.options[1] || '',
        answer3: q.options[2] || '',
        answer4: q.options[3] || '',
        correctAnswer: q.correctAnswer
      });
    } else {
      setCurrentQuestion({
        question: '',
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        correctAnswer: ''
      });
    }
  }, [activeQuiz, page, quizzes]);

  const handleInputChange = (field, value) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const addQuiz = () => {
    const newQuiz = { 
      id: quizzes.length + 1, 
      name: `Quiz ${quizzes.length + 1}`,
      description: "",
      timeLimit: 30,
      attempts: 3,
      passingScore: 70,
      questions: [],
      isActive: true
    };
    onChange([...quizzes, newQuiz]);
    setActiveQuiz(quizzes.length);
    setPage(1);
  };

  const addQuestion = () => {
    setQuestions([...questions, questions.length + 1]);
    setPage(questions.length + 1);
  };

  const saveCurrentQuestion = () => {
    // Validate question data
    if (!currentQuestion.question.trim()) {
      setError('Question text is required');
      return false;
    }
    
    if (!currentQuestion.answer1.trim() || !currentQuestion.answer2.trim() || 
        !currentQuestion.answer3.trim() || !currentQuestion.answer4.trim()) {
      setError('All four answers are required');
      return false;
    }
    
    if (!currentQuestion.correctAnswer.trim()) {
      setError('Correct answer is required');
      return false;
    }

    // Check if correct answer matches one of the provided answers
    const answers = [
      currentQuestion.answer1, 
      currentQuestion.answer2, 
      currentQuestion.answer3, 
      currentQuestion.answer4
    ];
    if (!answers.includes(currentQuestion.correctAnswer)) {
      setError('Correct answer must match one of the provided answers');
      return false;
    }

    // Update quiz data
    const updatedQuizzes = [...quizzes];
    const quiz = updatedQuizzes[activeQuiz];
    
    const questionData = {
      questionNumber: page,
      question: currentQuestion.question,
      type: 'multiple-choice',
      options: [
        currentQuestion.answer1,
        currentQuestion.answer2,
        currentQuestion.answer3,
        currentQuestion.answer4
      ],
      correctAnswer: currentQuestion.correctAnswer,
      points: 1
    };

    // Update or add question
    const existingIndex = quiz.questions.findIndex(q => q.questionNumber === page);
    if (existingIndex >= 0) {
      quiz.questions[existingIndex] = questionData;
    } else {
      quiz.questions.push(questionData);
    }

    onChange(updatedQuizzes);
    setError(null);
    return true;
  };

  const resetCurrentQuestion = () => {
    setCurrentQuestion({
      question: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      correctAnswer: ''
    });
  };

  const goToPrevious = () => {
    if (page > 1) {
      saveCurrentQuestion();
      setPage(page - 1);
    }
  };

  const goToNext = () => {
    if (saveCurrentQuestion()) {
      if (page < questions.length) {
        setPage(page + 1);
      } else {
        addQuestion();
      }
    }
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.quizHeader}>
        <h2>Add Quiz</h2>
        <p className={styles.info}>
          Total Quizzes: {quizzes.length} | 
          Questions in current quiz: {quizzes[activeQuiz]?.questions.length || 0}
        </p>
      </div>

      {/* Error Messages */}
      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className={styles.top}>
        {quizzes.map((q, index) => (
          <button
            key={q.id}
            type="button"
            className={`${styles.quizBtn} ${activeQuiz === index ? styles.activeQuiz : ""}`}
            onClick={() => setActiveQuiz(index)}
          >
            {q.name}
            <span className={styles.questionCount}>
              ({q.questions.length} questions)
            </span>
          </button>
        ))}
        <button type="button" className={styles.addBtn} onClick={addQuiz}>+</button>
      </div>

      <div className={styles.main}>
        <div className={styles.pagination}>
          {questions.map((num) => {
            const hasContent = quizzes[activeQuiz]?.questions.some(q => q.questionNumber === num);
            return (
              <button
                key={num}
                type="button"
                className={`${styles.pageBtn} ${page === num ? styles.active : ""} ${
                  hasContent ? styles.hasContent : ''
                }`}
                onClick={() => {
                  if (saveCurrentQuestion()) {
                    setPage(num);
                  }
                }}
              >
                {num}
              </button>
            );
          })}
          <button type="button" className={styles.addPageBtn} onClick={addQuestion}>+</button>
        </div>

        <div className={styles.questionBox}>
          <div className={styles.questionHeader}>
            <h4>Question {page} - {quizzes[activeQuiz]?.name}</h4>
          </div>

          <input 
            type="text" 
            placeholder="Enter your question here..." 
            className={styles.inputField}
            value={currentQuestion.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
          />
          
          <div className={styles.answersGrid}>
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className={styles.answerInputGroup}>
                <label>Option {num}:</label>
                <input 
                  type="text" 
                  placeholder={`Answer ${num}`} 
                  className={styles.inputField}
                  value={currentQuestion[`answer${num}`]}
                  onChange={(e) => handleInputChange(`answer${num}`, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className={styles.correctAnswerSection}>
            <label>Correct Answer:</label>
            <select 
              className={styles.selectField}
              value={currentQuestion.correctAnswer}
              onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
            >
              <option value="">Select correct answer</option>
              <option value={currentQuestion.answer1}>{currentQuestion.answer1 || 'Option 1'}</option>
              <option value={currentQuestion.answer2}>{currentQuestion.answer2 || 'Option 2'}</option>
              <option value={currentQuestion.answer3}>{currentQuestion.answer3 || 'Option 3'}</option>
              <option value={currentQuestion.answer4}>{currentQuestion.answer4 || 'Option 4'}</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button 
              type="button"
              onClick={goToPrevious}
              disabled={page === 1}
              className={styles.navBtn}
            >
              Previous
            </button>
            <button 
              type="button"
              className={styles.reset} 
              onClick={resetCurrentQuestion}
            >
              Reset
            </button>
            <button 
              type="button"
              className={styles.save} 
              onClick={saveCurrentQuestion}
            >
              Save Question
            </button>
            <button 
              type="button"
              onClick={goToNext}
              className={styles.navBtn}
            >
              Next
            </button>
          </div>

          {/* Question Preview */}
          {currentQuestion.question && (
            <div className={styles.questionPreview}>
              <h5>Preview:</h5>
              <div className={styles.previewContent}>
                <p className={styles.previewQuestion}>{currentQuestion.question}</p>
                <div className={styles.previewOptions}>
                  {[1, 2, 3, 4].map((num) => (
                    currentQuestion[`answer${num}`] && (
                      <div 
                        key={num} 
                        className={`${styles.previewOption} ${
                          currentQuestion[`answer${num}`] === currentQuestion.correctAnswer 
                            ? styles.correctOption 
                            : ''
                        }`}
                      >
                        {String.fromCharCode(64 + num)}. {currentQuestion[`answer${num}`]}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSection;