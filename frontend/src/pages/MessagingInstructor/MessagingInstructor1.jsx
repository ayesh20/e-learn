import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import styles from "./MessagingInstructor1.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const initialData = [
  { id: 1, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=1", course: "React Basics" },
  { id: 2, name: "Samantha Lee", img: "https://i.pravatar.cc/100?img=2", course: "JavaScript Essentials" },
  { id: 3, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=3", course: "Python Fundamentals" },
  { id: 4, name: "Michael Scott", img: "https://i.pravatar.cc/100?img=4", course: "UI/UX Design" },
  { id: 5, name: "Linda Johnson", img: "https://i.pravatar.cc/100?img=5", course: "Node.js Basics" },
  { id: 6, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=6", course: "CSS Advanced" },
  { id: 7, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=7", course: "TypeScript Intro" },
];

export default function MessagingInstructor1() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [data] = useState(initialData);

  // Extract unique course names for dropdown
  const courseOptions = ["All Courses", ...new Set(data.map((d) => d.course))];

  // Filter based on search + course
  const filteredData = data.filter(
    (item) =>
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.course.toLowerCase().includes(search.toLowerCase())) &&
      (courseFilter === "All Courses" || item.course === courseFilter)
  );

  const handleStart = (course) => {
    // Navigate to course page using course name
    const courseSlug = course.toLowerCase().replace(/\s+/g, "-");
    navigate(`/course/${courseSlug}`);
  };

  return (
    <>
      <Navbar />
      <div className={styles.courseList}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by name or course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          </div>

          {/* Course Filter Dropdown */}
          <select
            className={styles.dropdownBtn}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className={styles.list}>
          {filteredData.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <img src={item.img} alt={item.name} className={styles.avatar} />
              <div className={styles.userInfo}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.courseName}>{item.course}</span>
              </div>
              <div className={styles.buttons}>
                <button
                  className={styles.courseBtn}
                  onClick={() => handleStart(item.course)}
                >
                  Go to Course
                </button>
                <button
                  className={styles.startBtn}
                  onClick={() => navigate(`/messaginginstructor2`)}
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className={styles.noResults}>No matching users found.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
