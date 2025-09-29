import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import styles from './CourseOverview.module.css';
import { profileAPI, enrollmentAPI } from '../../services/api';

const CourseOverview = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);

  // FIXED: Better way to get current user info
  const getUserInfo = () => {
    // First check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.log('No auth token found');
      return { isAuthenticated: false, studentId: null, studentName: null, studentEmail: null };
    }

    // Get userData object (this is what's typically stored during login)
    const userDataStr = localStorage.getItem('userData');
    console.log('Raw userData from localStorage:', userDataStr);
    
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        console.log('Parsed userData:', userData);
        
        return {
          isAuthenticated: true,
          studentId: userData._id || userData.id || userData.studentId,
          studentName: userData.firstName || userData.name || userData.username || 'Student',
          studentEmail: userData.email || userData.studentEmail || 'student@example.com',
          fullUserData: userData
        };
      } catch (e) {
        console.error('Error parsing userData:', e);
      }
    }

    // Fallback: try individual keys
    const studentId = localStorage.getItem('studentId');
    const studentName = localStorage.getItem('studentName') || localStorage.getItem('currentUser');
    const studentEmail = localStorage.getItem('studentEmail') || localStorage.getItem('userEmail');

    if (studentId || studentName || studentEmail) {
      console.log('Using fallback localStorage values');
      return {
        isAuthenticated: true,
        studentId,
        studentName: studentName || 'Student',
        studentEmail: studentEmail || 'student@example.com'
      };
    }

    console.log('No user information found in localStorage');
    return { isAuthenticated: false, studentId: null, studentName: null, studentEmail: null };
  };

  const userInfo = getUserInfo();
  console.log('=== USER INFO DEBUG ===');
  console.log('Is Authenticated:', userInfo.isAuthenticated);
  console.log('Student ID:', userInfo.studentId);
  console.log('Student Name:', userInfo.studentName);
  console.log('Student Email:', userInfo.studentEmail);
  console.log('Auth Token exists:', !!localStorage.getItem('authToken'));

  useEffect(() => {
    if (location.state?.courseData) {
      setCourse(location.state.courseData);
      setLoading(false);
    } else {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await profileAPI.getCourseById(courseId);
      
      // Format course data similar to Courses.jsx
      const formattedCourse = {
        id: data._id || data.id || courseId,
        title: data.title || 'Untitled Course',
        description: data.description || 'No description available',
        author: getInstructorName(data.instructorId || data.instructor),
        authorImg: data.instructorImage || `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 20) + 1}`,
        price: data.price > 0 ? `${data.price} LKR` : 'Free',
        priceValue: data.price || 0,
        image: data.thumbnail || data.image || getDefaultImage(data.category),
        category: data.category || 'General',
        level: data.level || 'Beginner',
        duration: data.duration || 0,
        enrollmentCount: data.enrollmentCount || data.studentsEnrolled || 0,
        rating: data.rating?.average || data.rating || 0,
        status: data.status || 'Published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        syllabus: data.syllabus || [],
        requirements: data.requirements || [],
        objectives: data.objectives || []
      };
      
      setCourse(formattedCourse);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const getInstructorName = (instructor) => {
    if (typeof instructor === 'object' && instructor !== null) {
      return `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Instructor';
    }
    return instructor || 'Unknown Instructor';
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

  const handleEnrollNow = () => {
    console.log('=== ENROLL NOW CLICKED ===');
    console.log('User authenticated:', userInfo.isAuthenticated);
    console.log('User info:', userInfo);

    // FIXED: Check authentication properly
    if (!userInfo.isAuthenticated) {
      alert('Please login to enroll in courses');
      navigate('/');
      return;
    }

    if (course.priceValue > 0) {
      // Navigate to checkout page with course data
      navigate('/checkout', {
        state: {
          courseData: course,
          studentEmail: userInfo.studentEmail,
          studentName: userInfo.studentName,
          studentId: userInfo.studentId
        }
      });
    } else {
      // Handle free course enrollment directly
      handleFreeEnrollment();
    }
  };

  const handleFreeEnrollment = async () => {
    try {
      setIsEnrolling(true);
      
      console.log('=== ATTEMPTING FREE ENROLLMENT ===');
      console.log('Course:', course.title);
      console.log('Student Name:', userInfo.studentName);
      console.log('Student Email:', userInfo.studentEmail);

      // FIXED: Match backend schema - only send fields that exist
      const enrollmentData = {
        courseName: course.title,
        studentName: userInfo.studentName,
        studentEmail: userInfo.studentEmail,
        enrollmentStatus: 'ENROLLED',
        progress: 0
      };

      console.log('Enrollment data being sent:', enrollmentData);
      console.log('JSON:', JSON.stringify(enrollmentData, null, 2));

      const response = await enrollmentAPI.createEnrollment(enrollmentData);
      console.log('Enrollment response:', response);
      
      alert('Successfully enrolled in the course!');
      navigate('/courses');
      
    } catch (error) {
      console.error('=== ENROLLMENT ERROR ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      
      if (error.message.includes('already enrolled')) {
        alert('You are already enrolled in this course!');
      } else {
        alert(`Failed to enroll in course: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatDuration = (hours) => {
    if (!hours || hours === 0) return 'Self-paced';
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className={styles.courseOverviewPage}>
        <Navbar />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={styles.courseOverviewPage}>
        <Navbar />
        <div className={styles.errorContainer}>
          <h2>Course Not Found</h2>
          <p>{error || 'The requested course could not be found.'}</p>
          <button onClick={() => navigate('/courses')} className={styles.backBtn}>
            Back to Courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.courseOverviewPage}>
      <Navbar />
      
      {/* DEBUG INFO - Remove this in production */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}>
        <strong>Debug Info:</strong><br/>
        Authenticated: {userInfo.isAuthenticated ? '✅' : '❌'}<br/>
        Name: {userInfo.studentName || 'N/A'}<br/>
        Email: {userInfo.studentEmail || 'N/A'}<br/>
        ID: {userInfo.studentId || 'N/A'}<br/>
        Token: {localStorage.getItem('authToken') ? '✅' : '❌'}
      </div>
      
      <div className={styles.courseHero}>
        <div className={styles.heroContent}>
          <div className={styles.courseInfo}>
            <div className={styles.breadcrumb}>
              <span onClick={() => navigate('/courses')} className={styles.breadcrumbLink}>
                Courses
              </span>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span>{course.category}</span>
            </div>
            
            <h1 className={styles.courseTitle}>{course.title}</h1>
            
            <div className={styles.courseMetaTop}>
              <span className={styles.category}>{course.category}</span>
              <span className={styles.level}>{course.level}</span>
              <span className={styles.rating}>
                ★ {course.rating > 0 ? course.rating.toFixed(1) : '4.5'}
              </span>
              <span className={styles.students}>
                {course.enrollmentCount} students enrolled
              </span>
            </div>
            
            <p className={styles.courseInstructor}>
              Created by <strong>{course.author}</strong>
            </p>
          </div>
          
          <div className={styles.courseCard}>
            <div className={styles.courseImageContainer}>
              <img 
                src={course.image} 
                alt={course.title}
                className={styles.courseImage}
                onError={(e) => {
                  e.target.src = getDefaultImage(course.category);
                }}
              />
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.priceSection}>
                <span className={styles.price}>
                  {course.priceValue > 0 ? course.price : 'Free'}
                </span>
                {course.priceValue > 0 && (
                  <span className={styles.originalPrice}>
                    {Math.round(course.priceValue * 1.3)} LKR
                  </span>
                )}
              </div>
              
              <button 
                className={styles.enrollBtn}
                onClick={handleEnrollNow}
                disabled={isEnrolling}
              >
                {isEnrolling ? 'Processing...' : 'Enroll Now'}
              </button>
              
              <div className={styles.courseFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>⏱️</span>
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📊</span>
                  <span>{course.level} Level</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎓</span>
                  <span>Certificate of completion</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📱</span>
                  <span>Mobile friendly</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>♾️</span>
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseOverview;