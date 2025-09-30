import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CourseForm from "../../components/CourseForm/CourseForm";
import AddContent from "../../components/AddContent/AddContent";
import QuizSection from "../../components/QuizSection/QuizSection";
import Footer from "../../components/Footer/Footer";
import styles from "./LectureOverview.module.css";
import { courseAPI } from "../../services/api";

const LectureOverview = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    instructorId: localStorage.getItem('instructorId') || "",
    category: "General",
    price: 0,
    level: "Beginner",
    status: "Draft",
    content: [],
    quizzes: [],
  });

  const [createdCourseId, setCreatedCourseId] = useState(null);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  const handleCourseFormChange = (formData) => {
    setCourseData(prev => ({ ...prev, ...formData }));
  };

  const handleContentChange = (content) => {
    setCourseData(prev => ({ ...prev, content }));
  };

  const handleQuizzesChange = (quizzes) => {
    setCourseData(prev => ({ ...prev, quizzes }));
  };

  const handleSaveCourse = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ type: "", text: "" });

      console.log("Saving course with data:", courseData);

      let response;
      if (createdCourseId) {
        response = await courseAPI.updateCourse(createdCourseId, courseData);
        setSaveMessage({ 
          type: "success", 
          text: `Course updated! Content: ${response.course?.content?.length || 0} pages, Quizzes: ${response.course?.quizzes?.length || 0}` 
        });
      } else {
        response = await courseAPI.createCourse(courseData);
        setCreatedCourseId(response.course._id);
        setSaveMessage({ 
          type: "success", 
          text: `Course created! ID: ${response.course._id}, Content: ${response.summary?.contentPages || 0} pages, Quizzes: ${response.summary?.quizzes || 0}` 
        });
      }

      console.log("Course saved successfully:", response);
    } catch (error) {
      setSaveMessage({ type: "error", text: error.message });
      console.error("Error saving course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      {saveMessage.text && (
        <div className={`${styles.alert} ${styles[saveMessage.type]}`}>
          {saveMessage.text}
        </div>
      )}

      <CourseForm 
        courseData={courseData}
        onChange={handleCourseFormChange}
      />

      <AddContent 
        content={courseData.content}
        onChange={handleContentChange}
      />

      <QuizSection 
        quizzes={courseData.quizzes}
        onChange={handleQuizzesChange}
      />

      <div className={styles.saveSection}>
        <button 
          onClick={handleSaveCourse}
          disabled={isSaving}
          className={styles.saveButton}
        >
          {isSaving ? "Saving..." : createdCourseId ? "Update Course" : "Save Course"}
        </button>
        {createdCourseId && (
          <p className={styles.courseIdDisplay}>Course ID: {createdCourseId}</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default LectureOverview;