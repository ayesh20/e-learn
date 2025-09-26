// InstructorDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CourseCard from "../../components/CourseCard/CourseCard";
import { courseAPI } from "../../services/api";
import styles from "./InstructorDashboard.module.css";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get instructor ID from localStorage
  const instructorId = localStorage.getItem('instructorId');

  // Default images based on category - same as CourseForm
  const getDefaultImage = (category) => {
    const imageMap = {
      'Design': '/images/course3.jpg',
      'Business': '/images/course9.jpg',
      'Technology': '/images/course1.png',
      'Web': '/images/course2.jpg',
      'Literature': '/images/course4.jpg',
      'Science': '/images/course9.jpg',
      'Math': '/images/course8.jpg'
    };
    return imageMap[category] || '/images/course1.png';
  };

  // Fetch courses on component mount
  useEffect(() => {
    if (instructorId) {
      fetchInstructorCourses();
    } else {
      setError('No instructor ID found. Please login again.');
      setLoading(false);
    }
  }, [instructorId]);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await courseAPI.getCoursesByInstructor(instructorId);
      
      if (response && response.courses) {
        // Transform the API data to match the expected format
        const transformedCourses = response.courses.map(course => {
          console.log('Processing course:', course.title, 'Category:', course.category);
          console.log('Course image fields:', {
            thumbnail: course.thumbnail,
            imageUrl: course.imageUrl,
            image: course.image
          });
          
          // Handle image URL - prioritize database image, fallback to default
          let imageUrl = "";
          
          // Check for stored images first
          if (course.imageUrl && course.imageUrl.startsWith('http')) {
            imageUrl = course.imageUrl;
          } else if (course.imageUrl && course.imageUrl.startsWith('/images/')) {
            imageUrl = course.imageUrl; // It's already a path to default image
          } else if (course.thumbnail && course.thumbnail.startsWith('/images/')) {
            imageUrl = course.thumbnail; // It's a path to default image
          } else if (course.image && course.image.startsWith('/images/')) {
            imageUrl = course.image; // It's a path to default image
          } else if (course.thumbnailUrl) {
            // If thumbnailUrl exists and is a URL
            imageUrl = course.thumbnailUrl.startsWith('http') 
              ? course.thumbnailUrl 
              : `http://localhost:5000${course.thumbnailUrl}`;
          } else if (course.thumbnail && !course.thumbnail.startsWith('/images/')) {
            // It's a filename, construct the full path for uploaded file
            imageUrl = `http://localhost:5000/uploads/courses/${course.thumbnail.split('/').pop()}`;
          } else {
            // No image found, use default based on category
            imageUrl = getDefaultImage(course.category);
          }
          
          console.log('Final imageUrl for', course.title, ':', imageUrl);
          
          return {
            id: course._id,
            title: course.title,
            category: course.category,
            description: course.description,
            price: course.price ? `${course.price}` : 'Free',
            level: course.level,
            status: course.status,
            imageUrl: imageUrl,
            benefits: `Level: ${course.level}`,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            instructorId: course.instructorId,
            // Store original data for editing
            originalData: course
          };
        });
        
        setCourses(transformedCourses);
        console.log('Transformed courses:', transformedCourses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses: ' + error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshCourses = async () => {
    setRefreshing(true);
    await fetchInstructorCourses();
    setRefreshing(false);
  };

  // Filter by category
  const filteredCourses = selectedCategory 
    ? courses.filter((c) => c.category === selectedCategory) 
    : courses;

  // Pagination
  const coursesPerPage = 3;
  const indexOfLastCourse = activePage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handlers
  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      await courseAPI.deleteCourse(courseId);
      
      // Remove from local state
      setCourses(courses.filter((c) => c.id !== courseId));
      
      // Show success message
      alert('Course deleted successfully!');
      
      // Refresh the list to ensure consistency
      await refreshCourses();
      
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Failed to delete course: ' + error.message);
      alert('Failed to delete course. Please try again.');
    }
  };

  const handleAdd = () => {
    // Navigate to add new course
    navigate("/lectureoverview");
  };

  const handleCardClick = (courseId) => {
    // Navigate to course details/view mode
    navigate(`/course-details/${courseId}`);
  };

  const handleUpdate = (courseId) => {
    // Find the course data
    const courseToUpdate = courses.find(course => course.id === courseId);
    
    if (courseToUpdate) {
      // Navigate to lecture overview with course data for editing
      navigate(`/lectureoverview/${courseId}`, {
        state: {
          courseData: courseToUpdate.originalData,
          isEditing: true,
          courseId: courseId
        }
      });
    } else {
      setError('Course not found');
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      setError(null);
      
      await courseAPI.updateCourseStatus(courseId, newStatus);
      
      // Update local state
      setCourses(courses.map(course => 
        course.id === courseId 
          ? { ...course, status: newStatus }
          : course
      ));
      
      alert(`Course status updated to ${newStatus}!`);
      
    } catch (error) {
      console.error('Error updating course status:', error);
      setError('Failed to update course status: ' + error.message);
      alert('Failed to update course status. Please try again.');
    }
  };

  const handlePrev = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNext = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setActivePage(1);
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}>Loading courses...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Header />

      <main className={styles.mainContent}>
        <div className={styles.topBanner}>
          <img src="/images/banner.png" alt="Course Banner" className={styles.bannerImage} />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className={styles.coursesHeader}>
          <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
              <button className={styles.courseBtn}>
                Courses ({courses.length})
              </button>
              <button className={styles.addBtn} onClick={handleAdd}>
                Add New
              </button>
              {refreshing && (
                <span className={styles.refreshing}>Refreshing...</span>
              )}
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
                  <option value="Web">Web Development</option>
                  <option value="Design">Design</option>
                  <option value="Literature">Literature</option>
                  <option value="Science">Science</option>
                  <option value="Math">Mathematics</option>
                </select>
              </div>
              <button 
                className={styles.addBtn}
                onClick={refreshCourses}
                disabled={refreshing}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.contentArea}>
          <section className={styles.courseSection}>
            <div className={styles.sectionContainer}>
              {filteredCourses.length === 0 ? (
                <div className={styles.noCourses}>
                  <p>No courses found. {selectedCategory && `Try a different category or `}Create your first course!</p>
                  <button className={styles.addBtn} onClick={handleAdd}>
                    Create Course
                  </button>
                </div>
              ) : (
                <div className={styles.courseGrid}>
                  {currentCourses.map((course) => (
                    <div key={course.id} className={styles.courseCardWrapper}>
                      {/* Custom Course Card with Image Error Handling */}
                      <div className={styles.courseCard}>
                        <div className={styles.courseImageContainer}>
                          <img 
                            src={course.imageUrl} 
                            alt={course.title}
                            onError={(e) => {
                              console.error('Image failed to load:', course.imageUrl);
                              // Try the default image for this category
                              const defaultImg = getDefaultImage(course.category);
                              console.log('Falling back to:', defaultImg);
                              e.target.src = defaultImg;
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', course.imageUrl);
                            }}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className={styles.courseContent}>
                          <h3>{course.title}</h3>
                          <p>{course.description}</p>
                          <p>Level: {course.level}</p>
                          <p>Price: {course.price}</p>
                          <p>Status: {course.status}</p>
                        </div>
                        <div className={styles.courseActions1}>
                    
                          <button className={styles.courseActions} onClick={() => handleDelete(course.id)}>Delete</button>
                        </div>
                      </div>
                     
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Pagination - Only show if there are courses */}
          {filteredCourses.length > 0 && totalPages > 1 && (
            <div className={styles.paginationSection}>
              <div className={styles.paginationContainer}>
                <div className={styles.pagination}>
                  <button 
                    className={styles.pageBtn} 
                    onClick={handlePrev} 
                    disabled={activePage === 1}
                  >
                    &lt;
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`${styles.pageBtn} ${activePage === i + 1 ? styles.activePage : ""}`}
                      onClick={() => setActivePage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    className={styles.pageBtn} 
                    onClick={handleNext} 
                    disabled={activePage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
                
                <div className={styles.paginationInfo}>
                  Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorDashboard;