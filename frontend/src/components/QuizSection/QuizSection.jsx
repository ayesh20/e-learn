import React, { useState } from "react";
import styles from "./QuizSection.module.css";

const QuizSection = () => {
  const [page, setPage] = useState(1);

  return (
    <div className={styles.quiz}>
      <h3>Add Quiz</h3>

      <div className={styles.top}>
        <button className={styles.quizBtn}>Quiz 1</button>
        <button className={styles.addBtn}>+</button>
      </div>

      <div className={styles.main}>
        {/* Pagination grid */}
        <div className={styles.pagination}>
          {Array.from({ length: 12 }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? styles.active : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question form */}
        <div className={styles.questionBox}>
          <input type="text" placeholder="Question" />
          {[1, 2, 3, 4].map((num) => (
            <input key={num} type="text" placeholder={`Answer ${num}`} />
          ))}
          <input type="text" placeholder="Correct Answer" />

          <div className={styles.actions}>
            <button>Previous</button>
            <button className={styles.reset}>Reset</button>
            <button className={styles.save}>Save</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      <button className={styles.bigSave}>Save</button>
    </div>
  );
};

export default QuizSection;
