import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Courses.css";

// Example data
const coursesData = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    author: "Lina",
    authorImg: "https://i.pravatar.cc/40?img=5",
    price: "1200 LKR",
    lessonsDone: 5,
    totalLessons: 7,
    image: "/images/course1.png",
    category: "Web",
  },
  {
    id: 2,
    title: "React Frontend Development",
    author: "John",
    authorImg: "https://i.pravatar.cc/40?img=6",
    price: "1500 LKR",
    lessonsDone: 3,
    totalLessons: 10,
    image: "/images/course2.jpg",
    category: "Web",
  },
  {
    id: 3,
    title: "UI/UX Design Basics",
    author: "Sophia",
    authorImg: "https://i.pravatar.cc/40?img=7",
    price: "1000 LKR",
    lessonsDone: 6,
    totalLessons: 8,
    image: "/images/course3.jpg",
    category: "Design",
  },
  {
    id: 4,
    title: "Python for Beginners",
    author: "Alice",
    authorImg: "https://i.pravatar.cc/40?img=8",
    price: "1100 LKR",
    lessonsDone: 4,
    totalLessons: 9,
    image: "/images/course4.jpg",
    category: "Web",
  },
  {
    id: 5,
    title: "Digital Marketing Essentials",
    author: "Mark",
    authorImg: "https://i.pravatar.cc/40?img=9",
    price: "1300 LKR",
    lessonsDone: 2,
    totalLessons: 6,
    image: "/images/course5.jpg",
    category: "Marketing",
  },
  {
    id: 6,
    title: "Java Backend Development",
    author: "Emma",
    authorImg: "https://i.pravatar.cc/40?img=10",
    price: "1400 LKR",
    lessonsDone: 5,
    totalLessons: 10,
    image: "/images/course6.jpg",
    category: "Web",
  },
  {
    id: 7,
    title: "Graphic Design Advanced",
    author: "David",
    authorImg: "https://i.pravatar.cc/40?img=11",
    price: "1200 LKR",
    lessonsDone: 6,
    totalLessons: 8,
    image: "/images/course7.jpg",
    category: "Design",
  },
  {
    id: 8,
    title: "Fullstack Web Development",
    author: "Olivia",
    authorImg: "https://i.pravatar.cc/40?img=12",
    price: "1600 LKR",
    lessonsDone: 3,
    totalLessons: 12,
    image: "/images/course8.jpg",
    category: "Web",
  },
  {
    id: 9,
    title: "Data Science & Machine Learning",
    author: "Ethan",
    authorImg: "https://i.pravatar.cc/40?img=13",
    price: "1800 LKR",
    lessonsDone: 4,
    totalLessons: 11,
    image: "/images/course9.jpg",
    category: "Data",
  },
  {
    id: 10,
    title: "Mobile App Development",
    author: "Sophia",
    authorImg: "https://i.pravatar.cc/40?img=14",
    price: "1500 LKR",
    lessonsDone: 7,
    totalLessons: 10,
    image: "/images/course10.jpg",
    category: "Web",
  },
  {
    id: 11,
    title: "Photography Basics",
    author: "Liam",
    authorImg: "https://i.pravatar.cc/40?img=15",
    price: "1000 LKR",
    lessonsDone: 2,
    totalLessons: 5,
    image: "/images/course11.jpg",
    category: "Design",
  },
  {
    id: 12,
    title: "Cybersecurity Fundamentals",
    author: "Mia",
    authorImg: "https://i.pravatar.cc/40?img=16",
    price: "1700 LKR",
    lessonsDone: 5,
    totalLessons: 9,
    image: "/images/course12.jpg",
    category: "Data",
  },
  {
    id: 13,
    title: "Artificial Intelligence Basics",
    author: "Noah",
    authorImg: "https://i.pravatar.cc/40?img=17",
    price: "2000 LKR",
    lessonsDone: 6,
    totalLessons: 12,
    image: "/images/course13.jpg",
    category: "Data",
  },
  {
    id: 14,
    title: "Video Editing Essentials",
    author: "Ava",
    authorImg: "https://i.pravatar.cc/40?img=18",
    price: "1200 LKR",
    lessonsDone: 3,
    totalLessons: 8,
    image: "/images/course14.jpg",
    category: "Design",
  },
  {
    id: 15,
    title: "3D Modeling & Animation",
    author: "James",
    authorImg: "https://i.pravatar.cc/40?img=19",
    price: "1900 LKR",
    lessonsDone: 5,
    totalLessons: 10,
    image: "/images/course15.jpg",
    category: "Design"
  },
];

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // 1️⃣ Filter courses by category
  const filteredCourses = coursesData.filter(course =>
    selectedCategory === "" ? true : course.category === selectedCategory
  );

  // 2️⃣ Calculate which courses to show for current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // 3️⃣ Pagination handlers
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="courses-page font-sans min-h-screen bg-gray-50">
      <Navbar />

      <div className="courses-container">
        {/* Category Filter */}
        <div className="category-wrapper">
          <h2>Category</h2>
          <div className="select-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1); // Reset page to 1 when category changes
              }}
            >
              <option value="">All</option>
              <option value="Web">Web Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data">Data</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <main className="courses-grid">
          {currentCourses.map((course) => (
            <div key={course.id} className="course-card">
              <img src={course.image} alt={course.title} className="course-image" />

              <div className="course-details">
                <h3 className="course-title">{course.title}</h3>

                <div className="course-meta">
                  <div className="author">
                    <img src={course.authorImg} alt={course.author} className="author-img" />
                    <span>{course.author}</span>
                  </div>
                  <span className="price">{course.price}</span>
                </div>

                <div className="progress-container">
                  <div className="progress-wrapper">
                    <div
                      className="progress-bar"
                      style={{ width: `${(course.lessonsDone / course.totalLessons) * 100}%` }}
                    ></div>
                  </div>
                  <p className="lessons">
                    Lesson {course.lessonsDone} of {course.totalLessons}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </main>

{/* Pagination Buttons */}
<div className="pagination">
  <button onClick={handlePrev} disabled={currentPage === 1} className="page-btn">
    &lt;  {/* less than symbol */}
  </button>
  <button onClick={handleNext} disabled={currentPage === totalPages} className="page-btn">
    &gt;  {/* greater than symbol */}
  </button>
</div>

      </div>

      <Footer />
    </div>
  );
};

export default Courses;
