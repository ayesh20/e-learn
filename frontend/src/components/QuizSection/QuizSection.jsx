import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "../../pages/LectureOverview/LectureOverview";
import { courseAPI } from "../../services/api";
import styles from "./QuizSection.module.css";

const QuizSection = () => {
  const navigate = useNavigate();
  const { courseData, updateCourseData, setLoading, setError, setSuccess } = useCourseContext();
  
  const [quizzes, setQuizzes] = useState([{ id: 1, name: "Quiz 1", questions: {} }]);
  const [activeQuiz, setActiveQuiz] = useState(1);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState(Array.from({ length: 15 }, (_, i) => i + 1));
  
  // Current question data
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: ''
  });

  // Load current question data when page or quiz changes
  useEffect(() => {
    const currentQuiz = quizzes.find(q => q.id === activeQuiz);
    if (currentQuiz && currentQuiz.questions[page]) {
      setCurrentQuestion(currentQuiz.questions[page]);
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
    const nextId = quizzes.length + 1;
    const newQuiz = { 
      id: nextId, 
      name: `Quiz ${nextId}`, 
      questions: {} 
    };
    setQuizzes([...quizzes, newQuiz]);
    setActiveQuiz(nextId);
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
      return;
    }
    
    if (!currentQuestion.answer1.trim() || !currentQuestion.answer2.trim() || 
        !currentQuestion.answer3.trim() || !currentQuestion.answer4.trim()) {
      setError('All four answers are required');
      return;
    }
    
    if (!currentQuestion.correctAnswer.trim()) {
      setError('Correct answer is required');
      return;
    }

    // Check if correct answer matches one of the provided answers
    const answers = [currentQuestion.answer1, currentQuestion.answer2, currentQuestion.answer3, currentQuestion.answer4];
    if (!answers.includes(currentQuestion.correctAnswer)) {
      setError('Correct answer must match one of the provided answers');
      return;
    }

    // Update quiz data
    setQuizzes(prev => prev.map(quiz => {
      if (quiz.id === activeQuiz) {
        return {
          ...quiz,
          questions: {
            ...quiz.questions,
            [page]: { ...currentQuestion }
          }
        };
      }
      return quiz;
    }));

    setError(null);
    console.log('Question saved successfully');
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
    saveCurrentQuestion();
    if (page < questions.length) {
      setPage(page + 1);
    } else {
      // Add new question if at the end
      addQuestion();
    }
  };

  const saveAllQuizzes = async () => {
    try {
      setLoading(true);
      
      // Save current question first
      saveCurrentQuestion();
      
      // Prepare quiz data for storage
      const quizData = quizzes.map(quiz => ({
        id: quiz.id,
        name: quiz.name,
        questions: Object.keys(quiz.questions).map(qNum => ({
          questionNumber: parseInt(qNum),
          question: quiz.questions[qNum].question,
          options: [
            quiz.questions[qNum].answer1,
            quiz.questions[qNum].answer2,
            quiz.questions[qNum].answer3,
            quiz.questions[qNum].answer4
          ],
          correctAnswer: quiz.questions[qNum].correctAnswer,
          points: 1 // Default points per question
        })).filter(q => q.question.trim() !== '') // Only include questions with content
      })).filter(quiz => quiz.questions.length > 0); // Only include quizzes with questions

      // Update course context
      updateCourseData({ quizzes: quizData });

      // If course exists, update it on server
      if (courseData.courseId) {
        // Note: You may need to extend your course model to include quizzes
        // For now, we'll store it as additional data
        await courseAPI.updateCourse(courseData.courseId, {
          quizzes: quizData,
          // You might want to add this to your course schema
          additionalData: {
            ...courseData.additionalData,
            quizzes: quizData
          }
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      console.log('All quizzes saved successfully:', quizData);
      
    } catch (error) {
      console.error('Failed to save quizzes:', error);
      setError('Failed to save quizzes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    await saveAllQuizzes();
    // Navigate back to dashboard after saving
    navigate("/instructordashboard");
  };

  const exportQuizData = () => {
    // Export current quiz data as JSON for backup
    const dataToExport = {
      courseId: courseData.courseId,
      courseTitle: courseData.title,
      quizzes: quizzes,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz-data-${courseData.title || 'course'}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.quizHeader}>
        <h3>Add Quiz</h3>
        <div className={styles.quizActions}>
          <button className={styles.exportBtn} onClick={exportQuizData}>
            Export Quiz Data
          </button>
          <button className={styles.saveAllBtn} onClick={saveAllQuizzes}>
            Save All Quizzes
          </button>
        </div>
      </div>

      <div className={styles.top}>
        {quizzes.map((q) => (
          <button
            key={q.id}
            className={`${styles.quizBtn} ${activeQuiz === q.id ? styles.activeQuiz : ""}`}
            onClick={() => setActiveQuiz(q.id)}
          >
            {q.name}
            <span className={styles.questionCount}>
              ({Object.keys(q.questions).length} questions)
            </span>
          </button>
        ))}
        <button className={styles.addBtn} onClick={addQuiz}>+</button>
      </div>

      <div className={styles.main}>
        <div className={styles.pagination}>
          {questions.map((num) => (
            <button
              key={num}
              className={`${styles.pageBtn} ${page === num ? styles.active : ""} ${
                quizzes.find(q => q.id === activeQuiz)?.questions[num] ? styles.hasContent : ''
              }`}
              onClick={() => {
                saveCurrentQuestion();
                setPage(num);
              }}
            >
              {num}
            </button>
          ))}
          <button className={styles.addPageBtn} onClick={addQuestion}>+</button>
        </div>

        <div className={styles.questionBox}>
          <div className={styles.questionHeader}>
            <h4>Question {page} - {quizzes.find(q => q.id === activeQuiz)?.name}</h4>
            <div className={styles.questionMeta}>
              <span>Total Questions: {Object.keys(quizzes.find(q => q.id === activeQuiz)?.questions || {}).length}</span>
            </div>
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
              onClick={goToPrevious}
              disabled={page === 1}
              className={styles.navBtn}
            >
              Previous
            </button>
            <button 
              className={styles.reset} 
              onClick={resetCurrentQuestion}
            >
              Reset
            </button>
            <button 
              className={styles.save} 
              onClick={saveCurrentQuestion}
            >
              Save Question
            </button>
            <button 
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

      <div className={styles.finalActions}>
        <button className={styles.bigSave} onClick={handleSaveAll}>
          Save All & Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizSection;