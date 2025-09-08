import React, { useState } from "react";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import styles from "./InstructorDashboard.module.css";

const InstructorDashboard = () => {
  const [activePage, setActivePage] = useState(3);

  const literatureCourses = [
    {
      id: 1,
      title: "build your dream network",
      benefits: "All Benefits of PLUS",
      price: "$24",
      imageUrl: "/images/book1.png",
    },
    {
      id: 2,
      title: "LEARNING INTERACT",
      benefits: "All Benefits of PLUS",
      price: "$24",
      imageUrl: "/images/book2.png",
    },
    {
      id: 3,
      title: "THE NEW RULES of WORK",
      benefits: "All Benefits of PLUS",
      price: "$24",
      imageUrl: "/images/book3.png",
    },
    {
      id: 4,
      title: "THE ONLY MOVIE THAT MATTERS IS YOUR REAL ONE",
      benefits: "All Benefits of PLUS",
      price: "$24",
      imageUrl: "/images/book4.png",
    },
    {
      id: 5,
      title: "Learning & Development",
      benefits: "All Benefits of PLUS",
      price: "$24",
      imageUrl: "/images/book5.png",
    },
    {
      id: 6,
      title: "Updates",
      description: "USED MORE AND ALLOWING THEY GET DEEP AND INTEGRATED",
      benefits: "All Benefits of PLUS",
      price: "$24",
      imageUrl: "/images/book6.png",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <Header />

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Banner with spacing and rounded corners */}
        <div className={styles.topBanner}>
          <img src="/images/banner.png" alt="Course Banner" className={styles.bannerImage} />
        </div>

        {/* Courses Header */}
        <div className={styles.coursesHeader}>
          <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
              <button className={styles.courseBtn}>Courses</button>
              <button className={styles.addBtn}>Add</button>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.filterContainer}>
                <select className={styles.filterDropdown}>
                  <option>Category</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* White Background Content Area */}
        <div className={styles.contentArea}>
          {/* Literature Course Section */}
          <section className={styles.courseSection}>
            <div className={styles.sectionContainer}>
              <h2 className={styles.sectionTitle}>Literature course</h2>
              <div className={styles.courseGrid}>
                {literatureCourses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>
          </section>

          {/* Second Course Section */}
          <section className={styles.courseSection}>
            <div className={styles.sectionContainer}>
              <div className={styles.courseGrid}>
                {literatureCourses.slice(3).map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>
          </section>

          {/* Pagination */}
          <div className={styles.paginationSection}>
            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>
                <button className={styles.pageBtn}>&lt;</button>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`${styles.pageBtn} ${activePage === num ? styles.activePage : ""}`}
                    onClick={() => setActivePage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button className={styles.pageBtn}>&gt;</button>
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