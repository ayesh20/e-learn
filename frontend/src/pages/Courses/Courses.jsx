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
  const [categories, setCategories] = useState([]);
  const coursesPerPage = 9;
  const navigate = useNavigate();

  const currentStudent = localStorage.getItem('studentId') || 
                        localStorage.getItem('studentName') || 
                        localStorage.getItem('currentUser') || 
                        'guest';

  useEffect(() => {
    fetchCourses();
    if (currentStudent !== 'guest') {
      fetchEnrolledCourses();
    }
  }, [selectedCategory, currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('=== DEBUGGING COURSE FETCH ===');
      
      // Try different API call approaches
      let data;
      let coursesArray = [];
      
      try {
        // Method 1: Try with params (your current approach)
        const params = {
          page: currentPage,
          limit: coursesPerPage,
          // Remove status filter initially to get all courses
          // status: 'Published'
        };

        if (selectedCategory && selectedCategory !== "") {
          params.category = selectedCategory;
        }

        console.log('Calling API with params:', params);
        data = await courseAPI.getAllCourses(params);
        console.log('API Response (Method 1):', data);
        
      } catch (apiError) {
        console.error('Method 1 failed:', apiError);
        
        // Method 2: Try without any parameters
        try {
          console.log('Trying Method 2: No parameters');
          data = await courseAPI.getAllCourses();
          console.log('API Response (Method 2):', data);
        } catch (apiError2) {
          console.error('Method 2 failed:', apiError2);
          
          // Method 3: Direct API call with axios
          try {
            console.log('Trying Method 3: Direct axios call');
            const response = await fetch('http://localhost:5000/api/courses', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
              }
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            data = await response.json();
            console.log('API Response (Method 3):', data);
          } catch (fetchError) {
            console.error('Method 3 failed:', fetchError);
            throw fetchError;
          }
        }
      }

      // Handle different response structures
      if (data) {
        console.log('Processing data:', data);
        
        // Check various possible response structures
        if (data.courses && Array.isArray(data.courses)) {
          coursesArray = data.courses;
          console.log('Found courses in data.courses:', coursesArray.length);
        } else if (data.data && Array.isArray(data.data)) {
          coursesArray = data.data;
          console.log('Found courses in data.data:', coursesArray.length);
        } else if (Array.isArray(data)) {
          coursesArray = data;
          console.log('Data is array:', coursesArray.length);
        } else if (data.result && Array.isArray(data.result)) {
          coursesArray = data.result;
          console.log('Found courses in data.result:', coursesArray.length);
        } else {
          console.error('Unexpected data structure:', data);
          throw new Error('Unexpected API response structure');
        }
        
        // Log first course for debugging
        if (coursesArray.length > 0) {
          console.log('First course structure:', coursesArray[0]);
        }
        
        // Format courses for display
        const formattedCourses = coursesArray.map((course, index) => {
          console.log(`Formatting course ${index}:`, course);
          
          // Handle instructor information
          let instructorName = 'Unknown Instructor';
          if (course.instructorId) {
            if (typeof course.instructorId === 'object' && course.instructorId !== null) {
              instructorName = `${course.instructorId.firstName || ''} ${course.instructorId.lastName || ''}`.trim() || 'Instructor';
            } else if (typeof course.instructorId === 'string') {
              instructorName = course.instructorId;
            }
          } else if (course.instructor) {
            instructorName = course.instructor;
          }

          const formattedCourse = {
            id: course._id || course.id || `course_${index}`,
            title: course.title || 'Untitled Course',
            description: course.description || 'No description available',
            author: instructorName,
            authorImg: course.instructorImage || `https://i.pravatar.cc/40?img=${(index % 20) + 1}`,
            price: course.price > 0 ? `${course.price} LKR` : 'Free',
            priceValue: course.price || 0,
            image: course.thumbnail || course.image || getDefaultImage(course.category),
            category: course.category || 'General',
            level: course.level || 'Beginner',
            duration: course.duration || 0,
            enrollmentCount: course.enrollmentCount || course.studentsEnrolled || 0,
            rating: course.rating?.average || course.rating || 0,
            status: course.status || 'Published',
            createdAt: course.createdAt,
            updatedAt: course.updatedAt
          };
          
          console.log(`Formatted course ${index}:`, formattedCourse);
          return formattedCourse;
        });

        setCourses(formattedCourses);
        
        // Set total count
        const totalCount = data.pagination?.totalCourses || 
                          data.total || 
                          data.totalCount || 
                          formattedCourses.length;
        setTotalCourses(totalCount);

        // Extract unique categories
        const uniqueCategories = [...new Set(formattedCourses.map(course => course.category))];
        setCategories(uniqueCategories.filter(cat => cat && cat !== ''));

        console.log('Final processed data:');
        console.log('- Courses:', formattedCourses.length);
        console.log('- Total:', totalCount);
        console.log('- Categories:', uniqueCategories);
        
      } else {
        throw new Error('No data received from API');
      }
      
    } catch (error) {
      console.error('=== FETCH COURSES ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setError(`Failed to load courses: ${error.message}`);
      setCourses([]);
      setTotalCourses(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const data = await enrollmentAPI.getEnrollmentsByStudent(currentStudent);
      const enrolledCourseData = {};
      
      if (data && data.enrollments) {
        data.enrollments.forEach(enrollment => {
          const courseKey = enrollment.courseId || enrollment.courseName;
          enrolledCourseData[courseKey] = {
            progress: enrollment.progress || 0,
            status: enrollment.enrollmentStatus || enrollment.status,
            enrollmentId: enrollment._id
          };
        });
      }
      
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
      'Programming': '/images/course2.jpg',
      'Marketing': '/images/course5.jpg',
      'Data Science': '/images/course9.jpg',
      'Data': '/images/course9.jpg',
      'AWS': '/images/course1.png',
      'Azure': '/images/course6.jpg',
      'Google Cloud': '/images/course8.jpg',
      'Business': '/images/course4.jpg',
      'Technology': '/images/course1.png',
      'Literature': '/images/course4.jpg',
      'General': '/images/course4.jpg'
    };
    return imageMap[category] || '/images/course1.png';
  };

  const handlePrev = () => { 
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => { 
    if (currentPage < Math.ceil(totalCourses / coursesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCategoryChange = (e) => {
    console.log('Category changed to:', e.target.value);
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleCourseClick = (course) => {
    console.log('Course clicked:', course);
    const enrollmentInfo = enrolledCourses[course.id] || enrolledCourses[course.title];
    
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
    const enrollmentInfo = enrolledCourses[course.id] || enrolledCourses[course.title];
    if (enrollmentInfo) {
      const totalLessons = 7;
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

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  // Debug information display
  const DebugInfo = () => (
    <div style={{ 
      background: '#f0f0f0', 
      padding: '10px', 
      margin: '10px 0', 
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      <strong>Debug Info:</strong><br/>
      Loading: {loading.toString()}<br/>
      Error: {error || 'None'}<br/>
      Courses Length: {courses.length}<br/>
      Total Courses: {totalCourses}<br/>
      Categories: {categories.join(', ') || 'None'}<br/>
      Selected Category: {selectedCategory || 'All'}<br/>
      Current Page: {currentPage}<br/>
      API Base URL: http://localhost:5000/api<br/>
      Auth Token: {localStorage.getItem('authToken') ? 'Present' : 'Missing'}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.coursesPage}>
        <Navbar />
        <div className={styles.coursesContainer}>
          <DebugInfo />
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
       
        
        <div className={styles.coursesHeader}>
          <h1><center>All Courses</center></h1>
          <p><center>Discover and learn new skills with our comprehensive course catalog</center></p>
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.categoryWrapper}>
            <h2>Filter by Category</h2>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={styles.categorySelect}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.coursesCount}>
            <span>Showing {courses.length} of {totalCourses} courses</span>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={fetchCourses} className={styles.retryBtn}>
              Retry Loading Courses
            </button>
          </div>
        )}

        <main className={styles.coursesGrid}>
          {courses.length > 0 ? (
            courses.map((course) => {
              const progressInfo = getProgressInfo(course);
              return (
                <div
                  key={course.id}
                  className={`${styles.courseCard} ${progressInfo.isEnrolled ? styles.enrolled : ''}`}
                  onClick={() => handleCourseClick(course)}
                >
                  <div className={styles.courseImageContainer}>
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className={styles.courseImage}
                      onError={(e) => {
                        e.target.src = getDefaultImage(course.category);
                      }}
                    />
                    {progressInfo.isEnrolled && (
                      <div className={styles.enrolledBadge}>
                        Enrolled
                      </div>
                    )}
                    <div className={styles.courseCategory}>
                      {course.category}
                    </div>
                  </div>

                  <div className={styles.courseDetails}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <p className={styles.courseDescription}>
                      {course.description.length > 100 
                        ? `${course.description.substring(0, 100)}...` 
                        : course.description
                      }
                    </p>
                    
                    <div className={styles.courseMeta}>
                      <div className={styles.author}>
                       
                      </div>
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
                        <div className={styles.courseStats}>
                          <span className={styles.courseLevel}>
                            📊 {course.level}
                          </span>
                          <span className={styles.courseDuration}>
                            ⏱️ {course.duration > 0 ? `${course.duration}h` : 'Self-paced'}
                          </span>
                          <span className={styles.enrollmentCount}>
                            👥 {course.enrollmentCount} students
                          </span>
                        </div>
                        
                        <div className={styles.priceContainer}>
                          <span className={styles.price}>{course.price}</span>
                          {course.rating > 0 && (
                            <span className={styles.rating}>
                              ⭐ {course.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : !loading && (
            <div className={styles.noCourses}>
              <div className={styles.noCoursesContent}>
                <h3>No courses found</h3>
                <p>
                  {selectedCategory 
                    ? `No courses available in the "${selectedCategory}" category.`
                    : 'No courses are currently available.'
                  }
                </p>
                <button onClick={fetchCourses} className={styles.retryBtn}>
                  Refresh Courses
                </button>
              </div>
            </div>
          )}
        </main>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={handlePrev} 
              disabled={currentPage === 1} 
              className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : ''}`}
            >
              ← Previous
            </button>
            
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={handleNext} 
              disabled={currentPage === totalPages} 
              className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;