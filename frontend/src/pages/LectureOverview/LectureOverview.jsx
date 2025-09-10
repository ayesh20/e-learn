import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import CourseForm from "../../components/CourseForm/CourseForm";
import AddContent from "../../components/AddContent/AddContent";
import QuizSection from "../../components/QuizSection/QuizSection";
import Footer from "../../components/Footer/Footer";
import styles from "./LectureOverview.module.css";

const LectureOverview = () => {
  return (
    <div className={styles.container}>
      <Navbar />

    

      {/* Course Form */}
      <CourseForm />

      {/* Add Content */}
      <AddContent />

     

      {/* Quiz Section */}
      <QuizSection />

      <Footer />
    </div>
  );
};

export default LectureOverview;
