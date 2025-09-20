import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCourses.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { enrollmentAPI, courseAPI } from "../../services/api";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current student name from localStorage or context
  // You might want to replace this with your actual authentication method
  const currentStudent = localStorage.getItem('studentName') || localStorage.getItem('currentUser') || 'Lina';

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (enrolledCourses.length >= 0) {
      fetchRecommendedCourses();
    }
  }, [enrolledCourses]);

  useEffect(() => {
    filterCourses();
  }, [enrolledCourses, selectedCategory]);

  const fetchRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      // Fetch published courses that the student is not enrolled in
      const courseData = await courseAPI.getAllCourses({ 
        status: 'Published',
        limit: 8 // Get more courses to filter out enrolled ones
      });
      
      const enrolledCourseNames = enrolledCourses.map(course => course.title);
      
      // Filter out already enrolled courses and limit to 4
      const filteredRecommended = courseData.courses
        .filter(course => !enrolledCourseNames.includes(course.title))
        .slice(0, 4)
        .map(course => ({
          id: course._id,
          title: course.title,
          description: course.description,
          instructor: course.instructorId ? 
            `${course.instructorId.firstName} ${course.instructorId.lastName}` : 
            'Instructor',
          category: course.category,
          duration: course.duration,
          price: course.price,
          level: course.level,
          image: course.thumbnail || getCourseImage(course.title),
          rating: course.rating?.average || 0,
          students: course.enrollmentCount || 0
        }));
      
      setRecommendedCourses(filteredRecommended);
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
      setRecommendedCourses([]);
    } finally {
      setRecommendedLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const data = await enrollmentAPI.getEnrollmentsByStudent(currentStudent);
      
      // Filter only active enrollments and map to course format
      const activeCourses = data.enrollments
        .filter(enrollment => 
          enrollment.enrollmentStatus === 'ENROLLED' || 
          enrollment.enrollmentStatus === 'IN PROGRESS'
        )
        .map(enrollment => ({
          id: enrollment._id,
          title: enrollment.courseName,
          instructor: 'Lina', // You can modify this based on your data structure
          progress: enrollment.progress || 0,
          totalLessons: 7, // You can modify this based on your course structure
          currentLesson: Math.ceil((enrollment.progress / 100) * 7) || 1,
          image: getCourseImage(enrollment.courseName),
          category: getCourseCategory(enrollment.courseName),
          enrollmentData: enrollment
        }));
      
      setEnrolledCourses(activeCourses);
      setError(null);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('Failed to load your courses. Please try again.');
      // Fallback to demo data if API fails or no enrollments found
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getCourseImage = (courseName) => {
    // Map course names to images - you can customize this based on your needs
    const imageMap = {
      'AWS Certified Solutions Architect': '/images/course1.png',
      'UI/UX Design Basics': '/images/course3.jpg',
      'Graphic Design Advanced': '/images/course7.jpg',
      'Full Stack Development': '/images/img1.jpg',
      'React for Beginners': '/images/img2.jpg',
      'Digital Marketing Basics': '/images/img3.jpg'
    };
    return imageMap[courseName] || '/images/course1.png';
  };

  const getCourseCategory = (courseName) => {
    // Map course names to categories
    const categoryMap = {
      'AWS Certified Solutions Architect': 'AWS',
      'Azure Fundamentals': 'Azure',
      'Google Cloud Platform': 'Google Cloud',
      'UI/UX Design Basics': 'Design',
      'Graphic Design Advanced': 'Design',
      'Full Stack Development': 'Development',
      'React for Beginners': 'Development'
    };
    return categoryMap[courseName] || 'All';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Design': 'fa-solid fa-paint-brush',
      'Development': 'fa-solid fa-laptop-code',
      'Business': 'fa-solid fa-chart-line',
      'Marketing': 'fa-solid fa-bullhorn',
      'AWS': 'fa-solid fa-cloud',
      'Azure': 'fa-solid fa-cloud',
      'Google Cloud': 'fa-solid fa-cloud',
      'General': 'fa-solid fa-book'
    };
    return iconMap[category] || 'fa-solid fa-book';
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} mins`;
    if (hours === 1) return '1 hour';
    return `${Math.round(hours)} hours`;
  };

  const handleRecommendedCourseClick = (course) => {
    // Navigate to course enrollment or details page
    navigate(`/course/${course.id}`, {
      state: {
        courseId: course.id,
        courseName: course.title,
        courseData: course
      }
    });
  };

  const filterCourses = () => {
    if (selectedCategory === "All") {
      setFilteredCourses(enrolledCourses);
    } else {
      const filtered = enrolledCourses.filter(course => 
        course.category === selectedCategory
      );
      setFilteredCourses(filtered);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleCourseClick = (course) => {
    // Navigate to course details page with course data
    navigate(`/course-details/${course.id}`, {
      state: {
        courseId: course.id,
        courseName: course.title,
        enrollmentData: course.enrollmentData,
        courseImage: course.image,
        instructor: course.instructor,
        progress: course.progress,
        currentLesson: course.currentLesson,
        totalLessons: course.totalLessons
      }
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main>
          <div className="section_1">
            <header>
              <h2>Loading your courses...</h2>
            </header>
            <div className="loading-spinner">
              <p>Please wait while we fetch your enrolled courses.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main>
        {/* ---------------- Section 1 - My Enrolled Courses ---------------- */}
        <div className="section_1">
          <header>
            <h2>Welcome back, ready for your next lesson?</h2>
            <div className="dropdown">
              <label htmlFor="category">Category </label>
              <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="All">All</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
                <option value="Google Cloud">Google Cloud</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
              </select>
            </div>
          </header>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchEnrolledCourses}>Retry</button>
            </div>
          )}

          <div className="course-container">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="card" 
                  onClick={() => handleCourseClick(course)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{course.title}</h3>
                    <div className="author">
                      <img src="https://randomuser.me/api/portraits/women/65.jpg" alt={course.instructor} />
                      {course.instructor}
                    </div>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="lesson-info">
                      Lesson {course.currentLesson} of {course.totalLessons} • {course.progress}% Complete
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">
                <p>You haven't enrolled in any courses yet.</p>
                <p>Browse our recommended courses below to get started!</p>
              </div>
            )}
          </div>

          {filteredCourses.length > 0 && (
            <div className="more-btn">
              <button onClick={() => navigate('/browse-courses')}>Browse More Courses</button>
            </div>
          )}
        </div>

        {/* ---------------- Section 2 - Recommended Courses ---------------- */}
        <div className="section_2">
          <div className="section2-header">
            <h2>Recommended For You</h2>
            <span onClick={() => navigate('/browse-courses')} style={{ cursor: 'pointer' }}>See All</span>
          </div>

          {recommendedLoading ? (
            <div className="loading-spinner">
              <p>Loading recommended courses...</p>
            </div>
          ) : (
            <div className="cardsection">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course) => (
                  <div key={course.id} className="card" onClick={() => handleRecommendedCourseClick(course)} style={{ cursor: 'pointer' }}>
                    <img src={course.image} alt={course.title} />
                    <div className="card-body">
                      <div className="card-meta">
                        <span>
                          <i className={getCategoryIcon(course.category)}></i> {course.category}
                        </span>
                        <span>
                          <i className="fa-regular fa-clock"></i> {formatDuration(course.duration)}
                        </span>
                      </div>
                      <h3 className="card-title">{course.title}</h3>
                      <p className="card-text">{course.description.substring(0, 80)}...</p>
                      <div className="card-footer">
                        <div className="author">
                          <img src="https://randomuser.me/api/portraits/women/65.jpg" alt={course.instructor} />
                          {course.instructor}
                        </div>
                        <div className="price">
                          {course.price > 0 ? (
                            <>
                              <span className="old">${course.price + 20}</span>
                              <span className="new">${course.price}</span>
                            </>
                          ) : (
                            <span className="new">Free</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-courses">
                  <p>No recommended courses available at the moment.</p>
                  <p>Check back later for new course recommendations!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---------------- Section 3 - CTA Section ---------------- */}
        <div className="section_3">
          <div className="section3-content">
            <div className="section3-text">
              <h2>Enhance Your Learning Journey</h2>
              <p>Join our community of learners and access a wide range of courses designed to help you achieve your goals.</p>
              <button>Get Started</button>
            </div>
            <div className="section3-image">
              <img src="/images/elearning.png" alt="E-Learning Illustration" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyCourses;