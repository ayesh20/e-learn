// InstructorDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import styles from "./InstructorDashboard.module.css";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);

  const initialCourses = [
    { id: 1, title: "Build Your Dream Network", category: "Business", benefits: "All Benefits of PLUS", price: "$24", imageUrl: "/images/course1.png" },
    { id: 2, title: "Learning Interact", category: "Business", benefits: "All Benefits of PLUS", price: "$24", imageUrl: "/images/course2.jpg" },
    { id: 3, title: "The New Rules of Work", category: "Business", benefits: "All Benefits of PLUS", price: "$24", imageUrl: "/images/course3.jpg" },
    { id: 4, title: "Your Real Movie Matters", category: "Literature", benefits: "All Benefits of PLUS", price: "$24", imageUrl: "/images/course4.jpg" },
    { id: 5, title: "Learning & Development", category: "Technology", benefits: "All Benefits of PLUS", price: "$24", imageUrl: "/images/course5.jpg" },
    { id: 6, title: "Updates", category: "Technology", benefits: "All Benefits of PLUS", price: "$24", imageUrl: "/images/course6.jpg" },
    { id: 7, title: "Advanced React", category: "Web", benefits: "All Benefits of PLUS", price: "$30", imageUrl: "/images/course7.jpg" },
    { id: 8, title: "UI/UX Design", category: "Design", benefits: "All Benefits of PLUS", price: "$28", imageUrl: "/images/course8.jpg" },
  ];

  const [courses, setCourses] = useState(initialCourses);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter by category
  const filteredCourses = selectedCategory ? courses.filter((c) => c.category === selectedCategory) : courses;

  // Pagination
  const coursesPerPage = 3;
  const indexOfLastCourse = activePage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handlers
  const handleDelete = (id) => setCourses(courses.filter((c) => c.id !== id));
  const handleAdd = () => navigate("/lectureoverview");
  const handleCardClick = (id) => navigate(`/lectureoverview/${id}`);
  const handlePrev = () => activePage > 1 && setActivePage(activePage - 1);
  const handleNext = () => activePage < totalPages && setActivePage(activePage + 1);

  return (
    <div className={styles.dashboard}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.topBanner}>
          <img src="/images/banner.png" alt="Course Banner" className={styles.bannerImage} />
        </div>

        <div className={styles.coursesHeader}>
          <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
              <button className={styles.courseBtn}>Courses</button>
              <button className={styles.addBtn} onClick={handleAdd}>Add</button>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.filterContainer}>
                <select
                  className={styles.filterDropdown}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                  <option value="Web">Web</option>
                  <option value="Design">Design</option>
                  <option value="Literature">Literature</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentArea}>
          <section className={styles.courseSection}>
            <div className={styles.sectionContainer}>
              <div className={styles.courseGrid}>
                {currentCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    onClick={() => handleCardClick(course.id)}
                    onDelete={() => handleDelete(course.id)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Pagination */}
          <div className={styles.paginationSection}>
            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>
                <button className={styles.pageBtn} onClick={handlePrev} disabled={activePage === 1}>&lt;</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`${styles.pageBtn} ${activePage === i + 1 ? styles.activePage : ""}`}
                    onClick={() => setActivePage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className={styles.pageBtn} onClick={handleNext} disabled={activePage === totalPages}>&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorDashboard;
