import React, { useState, useContext, createContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CourseForm from "../../components/CourseForm/CourseForm";
import AddContent from "../../components/AddContent/AddContent";
import QuizSection from "../../components/QuizSection/QuizSection";
import Footer from "../../components/Footer/Footer";
import styles from "./LectureOverview.module.css";

// Create context for sharing course data between components
const CourseContext = createContext();

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within CourseProvider');
  }
  return context;
};

const LectureOverview = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructorName: '',
    price: '',
    category: '',
    thumbnail: null,
    content: [],
    quizzes: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateCourseData = (newData) => {
    setCourseData(prev => ({ ...prev, ...newData }));
  };

  const contextValue = {
    courseData,
    updateCourseData,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess
  };

  return (
    <CourseContext.Provider value={contextValue}>
      <div className={styles.container}>
        <Navbar />

        {error && (
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <p>Course saved successfully!</p>
            <button onClick={() => setSuccess(false)}>×</button>
          </div>
        )}

        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}>Saving...</div>
          </div>
        )}

        {/* Course Form */}
        <CourseForm />

        {/* Add Content */}
        <AddContent />

        {/* Quiz Section */}
        <QuizSection />

        <Footer />
      </div>
    </CourseContext.Provider>
  );
};

export default LectureOverview;