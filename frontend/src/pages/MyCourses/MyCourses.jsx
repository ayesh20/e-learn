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

  // Get current student info from localStorage
  const currentStudent = localStorage.getItem('studentName') || 
                         localStorage.getItem('currentUser') || 
                         localStorage.getItem('studentId') || 
                         'guest';

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    fetchRecommendedCourses();
  }, [enrolledCourses]);

  useEffect(() => {
    filterCourses();
  }, [enrolledCourses, selectedCategory]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching enrollments for student:', currentStudent);

      // Fetch enrollments for the current student
      const enrollmentData = await enrollmentAPI.getEnrollmentsByStudent(currentStudent);
      
      console.log('Enrollment API response:', enrollmentData);

      if (!enrollmentData || !enrollmentData.enrollments) {
        console.log('No enrollments found');
        setEnrolledCourses([]);
        return;
      }

      // Filter active enrollments and fetch course details
      const activeEnrollments = enrollmentData.enrollments.filter(enrollment => 
        enrollment.enrollmentStatus === 'ENROLLED' || 
        enrollment.enrollmentStatus === 'IN PROGRESS' ||
        enrollment.enrollmentStatus === 'COMPLETED'
      );

      console.log('Active enrollments:', activeEnrollments);

      // Map enrollments to course format with proper data
      const coursesWithDetails = await Promise.all(
        activeEnrollments.map(async (enrollment) => {
          try {
            // Try to get course details if courseId exists
            let courseDetails = null;
            if (enrollment.courseId) {
              try {
                courseDetails = await courseAPI.getCourseById(enrollment.courseId);
              } catch (courseError) {
                console.log('Could not fetch course details for:', enrollment.courseId);
              }
            }

            return {
              id: enrollment._id,
              enrollmentId: enrollment._id,
              title: enrollment.courseName,
              instructor: courseDetails?.instructorId ? 
                `${courseDetails.instructorId.firstName} ${courseDetails.instructorId.lastName}` : 
                'Instructor',
              progress: enrollment.progress || 0,
              totalLessons: courseDetails?.content?.length || 7, // Use actual content length or default
              currentLesson: Math.ceil(((enrollment.progress || 0) / 100) * (courseDetails?.content?.length || 7)) || 1,
              image: courseDetails?.thumbnail || getCourseImage(enrollment.courseName),
              category: courseDetails?.category || getCourseCategory(enrollment.courseName),
              enrollmentData: enrollment,
              courseData: courseDetails,
              enrollmentStatus: enrollment.enrollmentStatus,
              enrollmentDate: enrollment.enrollmentDate,
              completionDate: enrollment.completionDate
            };
          } catch (error) {
            console.error('Error processing enrollment:', error);
            // Return basic course info even if details fetch fails
            return {
              id: enrollment._id,
              enrollmentId: enrollment._id,
              title: enrollment.courseName,
              instructor: 'Instructor',
              progress: enrollment.progress || 0,
              totalLessons: 7,
              currentLesson: Math.ceil(((enrollment.progress || 0) / 100) * 7) || 1,
              image: getCourseImage(enrollment.courseName),
              category: getCourseCategory(enrollment.courseName),
              enrollmentData: enrollment,
              enrollmentStatus: enrollment.enrollmentStatus,
              enrollmentDate: enrollment.enrollmentDate,
              completionDate: enrollment.completionDate
            };
          }
        })
      );

      setEnrolledCourses(coursesWithDetails);
      console.log('Processed enrolled courses:', coursesWithDetails);

    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setError('Failed to load your enrolled courses. Please try again.');
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      
      // Fetch all courses (remove status filter to get Draft courses too)
      const courseData = await courseAPI.getAllCourses({ 
        limit: 20 // Get more courses to filter out enrolled ones
      });
      
      console.log('Fetched courses for recommendations:', courseData);
      console.log('Raw API response structure:', JSON.stringify(courseData, null, 2));

      // Get enrolled course names to filter them out
      const enrolledCourseNames = enrolledCourses.map(course => course.title.toLowerCase());
      
      // Get courses array from response with detailed logging
      let coursesArray = [];
      
      if (courseData.courses && Array.isArray(courseData.courses)) {
        coursesArray = courseData.courses;
        console.log('Using courseData.courses - Length:', coursesArray.length);
      } else if (courseData.data && Array.isArray(courseData.data)) {
        coursesArray = courseData.data;
        console.log('Using courseData.data - Length:', coursesArray.length);
      } else if (Array.isArray(courseData)) {
        coursesArray = courseData;
        console.log('Using courseData directly - Length:', coursesArray.length);
      } else {
        console.error('No valid courses array found in response:', courseData);
        coursesArray = [];
      }

      console.log('All courses before filtering:', coursesArray.map(c => ({ 
        id: c._id, 
        title: c.title, 
        status: c.status 
      })));

      console.log('Enrolled course names to exclude:', enrolledCourseNames);
      
      // Filter out already enrolled courses and limit to 3 for recommendations
      const availableCourses = coursesArray
        .filter(course => {
          const isNotEnrolled = !enrolledCourseNames.includes(course.title?.toLowerCase());
          console.log(`Course "${course.title}" - Not enrolled: ${isNotEnrolled}`);
          return isNotEnrolled;
        });

      console.log('Available courses after filtering out enrolled:', availableCourses.length);

      const filteredRecommended = availableCourses
        .slice(0, 3) // Show only 3 courses in recommendations
        .map(course => {
          console.log('Processing course for recommendation:', course.title, course.status);
          return {
            id: course._id || course.id,
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
            rating: course.rating?.average || course.rating || 0,
            students: course.enrollmentCount || 0,
            status: course.status // Include status for debugging
          };
        });
      
      setRecommendedCourses(filteredRecommended);
      console.log('Recommended courses:', filteredRecommended);
      
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
      setRecommendedCourses([]);
    } finally {
      setRecommendedLoading(false);
    }
  };

  const getCourseImage = (courseName) => {
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
    const categoryMap = {
      'AWS Certified Solutions Architect': 'AWS',
      'Azure Fundamentals': 'Azure',
      'Google Cloud Platform': 'Google Cloud',
      'UI/UX Design Basics': 'Design',
      'Graphic Design Advanced': 'Design',
      'Full Stack Development': 'Development',
      'React for Beginners': 'Development'
    };
    return categoryMap[courseName] || 'General';
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
    if (!hours || hours < 1) return 'Self-paced';
    if (hours === 1) return '1 hour';
    return `${Math.round(hours)} hours`;
  };

  const handleRecommendedCourseClick = (course) => {
    navigate(`/course-overview/${course.id}`, {
      state: {
        courseData: course
      }
    });
  };

  const handleSeeAllCourses = () => {
    navigate('/courses'); // Navigate to the Courses.jsx page
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
    navigate(`/course-details/${course.enrollmentId}`, {
      state: {
        courseId: course.enrollmentId,
        courseName: course.title,
        enrollmentData: course.enrollmentData,
        courseImage: course.image,
        instructor: course.instructor,
        progress: course.progress,
        currentLesson: course.currentLesson,
        totalLessons: course.totalLessons,
        courseData: course.courseData
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
                <option value="General">General</option>
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
                    <div className="enrollment-status">
                      <span className={`status-badge ${course.enrollmentStatus.toLowerCase().replace(' ', '-')}`}>
                        {course.enrollmentStatus}
                      </span>
                    </div>
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
                    <div className="course-meta">
                      <small>Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}</small>
                      {course.completionDate && (
                        <small>Completed: {new Date(course.completionDate).toLocaleDateString()}</small>
                      )}
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
              <button onClick={handleSeeAllCourses}>Browse More Courses</button>
            </div>
          )}
        </div>

        {/* ---------------- Section 2 - Recommended Courses (Limited to 3) ---------------- */}
        <div className="section_2">
          <div className="section2-header">
            <h2>Recommended For You</h2>
            <span onClick={handleSeeAllCourses} style={{ cursor: 'pointer' }}>See All</span>
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
                      <p className="card-text">
                        {course.description && course.description.length > 80 
                          ? `${course.description.substring(0, 80)}...` 
                          : course.description || 'Course description not available'
                        }
                      </p>
                      <div className="card-footer">
                        
                        <div className="price">
                          {course.price > 0 ? (
                            <>
                              <span className="old">LKR {course.price + 500}</span>
                              <span className="new">LKR {course.price}</span>
                            </>
                          ) : (
                            <span className="new">Free</span>
                          )}
                        </div>
                      </div>
                      {course.rating > 0 && (
                        <div className="rating">
                          <span>★ {course.rating.toFixed(1)}</span>
                          <span>({course.students} students)</span>
                        </div>
                      )}
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

          {/* See More Button for Recommendations */}
          {recommendedCourses.length > 0 && (
            <div className="more-btn">
              
            </div>
          )}
        </div>

        {/* ---------------- Section 3 - CTA Section ---------------- */}
        <div className="section_3">
          <div className="section3-content">
            <div className="section3-text">
              <h2>Everything you can do in a physical classroom,<div className="section3-text1">you can do with EduFlex</div></h2>
              <p>Join our community of learners and access a wide range of courses designed to help you achieve your goals.</p>
            </div>
            <div className="section3-image">
              <img src="/images/mycourse.png" alt="E-Learning Illustration" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyCourses;