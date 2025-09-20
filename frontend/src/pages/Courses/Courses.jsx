import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import styles from "./Courses.module.css";
import { courseAPI, enrollmentAPI } from "../../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 6;
  const navigate = useNavigate();

  
  const currentStudent = localStorage.getItem('studentName') || localStorage.getItem('currentUser') || 'Lina';

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, [selectedCategory, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: coursesPerPage,
        status: 'Published' 
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const data = await courseAPI.getAllCourses(params);
      
      const formattedCourses = data.courses.map(course => ({
        id: course._id,
        title: course.title,
        description: course.description,
        author: course.instructorId ? 
          `${course.instructorId.firstName} ${course.instructorId.lastName}` : 
          'Instructor',
        authorImg: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 20) + 1}`, // Random avatar
        price: course.price > 0 ? `${course.price} LKR` : 'Free',
        priceValue: course.price,
        image: course.thumbnail || getDefaultImage(course.category),
        category: course.category,
        level: course.level,
        duration: course.duration,
        enrollmentCount: course.enrollmentCount || 0,
        rating: course.rating?.average || 0
      }));

      setCourses(formattedCourses);
      setTotalCourses(data.pagination?.totalCourses || formattedCourses.length);
      setError(null);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const data = await enrollmentAPI.getEnrollmentsByStudent(currentStudent);
      const enrolledCourseData = {};
      
      data.enrollments.forEach(enrollment => {
        enrolledCourseData[enrollment.courseName] = {
          progress: enrollment.progress || 0,
          status: enrollment.enrollmentStatus,
          enrollmentId: enrollment._id
        };
      });
      
      setEnrolledCourses(enrolledCourseData);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses({});
    }
  };

  const getDefaultImage = (category) => {
    const imageMap = {
      'Design': '/images/course3.jpg',
      'Development': '/images/course2.jpg',
      'Marketing': '/images/course5.jpg',
      'Data': '/images/course9.jpg',
      'AWS': '/images/course1.png',
      'Azure': '/images/course6.jpg',
      'Google Cloud': '/images/course8.jpg',
      'General': '/images/course4.jpg'
    };
    return imageMap[category] || '/images/course1.png';
  };

  const getCategoryOptions = () => {
    const uniqueCategories = [...new Set(courses.map(course => course.category))];
    return uniqueCategories.filter(cat => cat && cat !== 'General');
  };

  const filteredCourses = courses.filter(course =>
    selectedCategory === "" ? true : course.category === selectedCategory
  );

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  const handlePrev = () => { 
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => { 
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleCourseClick = (course) => {
    const enrollmentInfo = enrolledCourses[course.title];
    
    if (enrollmentInfo && (enrollmentInfo.status === 'ENROLLED' || enrollmentInfo.status === 'IN PROGRESS')) {
    
      navigate(`/course-details/${enrollmentInfo.enrollmentId}`, {
        state: {
          courseId: enrollmentInfo.enrollmentId,
          courseName: course.title,
          courseImage: course.image,
          instructor: course.author,
          progress: enrollmentInfo.progress,
          currentLesson: Math.ceil((enrollmentInfo.progress / 100) * 7) || 1,
          totalLessons: 7
        }
      });
    } else {
      navigate(`/course-overview/${course.id}`, {
        state: {
          courseData: course
        }
      });
    }
  };

  const getProgressInfo = (course) => {
    const enrollmentInfo = enrolledCourses[course.title];
    if (enrollmentInfo) {
      const totalLessons = 7; // You can make this dynamic based on course syllabus length
      const completedLessons = Math.ceil((enrollmentInfo.progress / 100) * totalLessons);
      return {
        lessonsDone: completedLessons,
        totalLessons: totalLessons,
        progress: enrollmentInfo.progress,
        isEnrolled: true
      };
    }
    return {
      lessonsDone: 0,
      totalLessons: 7,
      progress: 0,
      isEnrolled: false
    };
  };

  if (loading) {
    return (
      <div className={styles.coursesPage}>
        <Navbar />
        <div className={styles.coursesContainer}>
          <div className={styles.loadingContainer}>
            <p>Loading courses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.coursesPage}>
      <Navbar />

      <div className={styles.coursesContainer}>
        
        <div className={styles.categoryWrapper}>
          <h2>Category</h2>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Courses</option>
            {getCategoryOptions().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={fetchCourses}>Retry</button>
          </div>
        )}

      
        <main className={styles.coursesGrid}>
          {courses.length > 0 ? (
            courses.map((course) => {
              const progressInfo = getProgressInfo(course);
              return (
                <div
                  key={course.id}
                  className={styles.courseCard}
                  onClick={() => handleCourseClick(course)}
                >
                  <img src={course.image} alt={course.title} className={styles.courseImage} />
                  <div className={styles.courseDetails}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <div className={styles.courseMeta}>
                      <div className={styles.author}>
                        <img src={course.authorImg} alt={course.author} className={styles.authorImg} />
                        <span>{course.author}</span>
                      </div>
                      <span className={styles.price}>{course.price}</span>
                    </div>
                    
                    {progressInfo.isEnrolled ? (
                      <div className={styles.progressContainer}>
                        <div className={styles.progressWrapper}>
                          <div
                            className={styles.progressBar}
                            style={{ width: `${progressInfo.progress}%` }}
                          ></div>
                        </div>
                        <p className={styles.lessons}>
                          Lesson {progressInfo.lessonsDone} of {progressInfo.totalLessons} • {progressInfo.progress}% Complete
                        </p>
                      </div>
                    ) : (
                      <div className={styles.courseInfo}>
                        <p className={styles.courseLevel}>Level: {course.level}</p>
                        <p className={styles.courseDuration}>
                          {course.duration > 0 ? `${course.duration} hours` : 'Self-paced'}
                        </p>
                        <p className={styles.enrollmentCount}>
                          {course.enrollmentCount} students enrolled
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {progressInfo.isEnrolled && (
                    <div className={styles.enrolledBadge}>
                      Enrolled
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className={styles.noCourses}>
              <p>No courses found for the selected category.</p>
              <p>Try selecting a different category or check back later.</p>
            </div>
          )}
        </main>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1} 
              className={styles.pageBtn}
            >
              &lt;
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages} 
              className={styles.pageBtn}
            >
              &gt;
            </button>
          </div>
        )}

        
        <div className={styles.courseSummary}>
          <p>Showing {courses.length} of {totalCourses} courses</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;