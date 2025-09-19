import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuizSection.module.css";

const QuizSection = () => {
  const navigate = useNavigate(); // Add this
  const [quizzes, setQuizzes] = useState([{ id: 1, name: "Quiz 1" }]);
  const [activeQuiz, setActiveQuiz] = useState(1);
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState(Array.from({ length: 24 }, (_, i) => i + 1));

  const addQuiz = () => {
    const nextId = quizzes.length + 1;
    const newQuiz = { id: nextId, name: `Quiz ${nextId}` };
    setQuizzes([...quizzes, newQuiz]);
    setActiveQuiz(nextId);
    setPage(1);
  };

  const addQuestion = () => {
    setQuestions([...questions, questions.length + 1]);
    setPage(questions.length + 1);
  };

  const handleSaveAll = () => {
    // You can add saving logic here (API call, localStorage, etc.)
    // After saving, navigate back to the dashboard
    navigate("/instructordashboard");
  };

  return (
    <div className={styles.quiz}>
      <h3>Add Quiz</h3>

      <div className={styles.top}>
        {quizzes.map((q) => (
          <button
            key={q.id}
            className={`${styles.quizBtn} ${activeQuiz === q.id ? styles.activeQuiz : ""}`}
            onClick={() => setActiveQuiz(q.id)}
          >
            {q.name}
          </button>
        ))}
        <button className={styles.addBtn} onClick={addQuiz}>+</button>
      </div>

      <div className={styles.main}>
        <div className={styles.pagination}>
          {questions.map((num) => (
            <button
              key={num}
              className={`${styles.pageBtn} ${page === num ? styles.active : ""}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button className={styles.addPageBtn} onClick={addQuestion}>+</button>
        </div>

        <div className={styles.questionBox}>
          <input type="text" placeholder="Question" className={styles.inputField} />
          {[1, 2, 3, 4].map((num) => (
            <input key={num} type="text" placeholder={`Answer ${num}`} className={styles.inputField} />
          ))}
          <input type="text" placeholder="Correct Answer" className={styles.inputField} />

          <div className={styles.actions}>
            <button>Previous</button>
            <button className={styles.reset}>Reset</button>
            <button className={styles.save}>Save</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      <button className={styles.bigSave} onClick={handleSaveAll}>Save All</button>
    </div>
  );
};

export default QuizSection;
