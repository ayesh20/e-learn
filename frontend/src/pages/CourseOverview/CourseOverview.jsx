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

  // Get current user info from localStorage
  const currentStudent = localStorage.getItem('studentId') || 
                        localStorage.getItem('studentName') || 
                        localStorage.getItem('currentUser') || 
                        'guest';
  
  const studentEmail = localStorage.getItem('studentEmail') || 
                      localStorage.getItem('userEmail') || 
                      'student@example.com';

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
    if (currentStudent === 'guest') {
      alert('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    if (course.priceValue > 0) {
      // Navigate to checkout page with course data
      navigate('/checkout', {
        state: {
          courseData: course,
          studentEmail: studentEmail,
          studentName: currentStudent
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
      
      const enrollmentData = {
        courseName: course.title,
        studentName: currentStudent,
        studentEmail: studentEmail,
        enrollmentStatus: 'ENROLLED',
        enrollmentDate: new Date(),
        progress: 0
      };

      await enrollmentAPI.createEnrollment(enrollmentData);
      
      alert('Successfully enrolled in the course!');
      navigate('/courses');
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
      if (error.message.includes('already enrolled')) {
        alert('You are already enrolled in this course!');
      } else {
        alert('Failed to enroll in course. Please try again.');
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className={styles.tabContent}>
            <div className={styles.descriptionSection}>
              <h3>About This Course</h3>
              <div className={styles.description}>
                <p>
                  {showFullDescription 
                    ? course.description 
                    : course.description.length > 300 
                      ? `${course.description.substring(0, 300)}...`
                      : course.description
                  }
                </p>
                {course.description.length > 300 && (
                  <button 
                    className={styles.readMoreBtn}
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            </div>

            {course.objectives && course.objectives.length > 0 && (
              <div className={styles.objectivesSection}>
                <h3>What You'll Learn</h3>
                <ul className={styles.objectivesList}>
                  {course.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}

            {course.requirements && course.requirements.length > 0 && (
              <div className={styles.requirementsSection}>
                <h3>Requirements</h3>
                <ul className={styles.requirementsList}>
                  {course.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      
      
      case 'instructor':
        return (
          <div className={styles.tabContent}>
            <div className={styles.instructorSection}>
              <div className={styles.instructorCard}>
                <img 
                  src={course.authorImg} 
                  alt={course.author}
                  className={styles.instructorImage}
                />
                <div className={styles.instructorInfo}>
                  <h3>{course.author}</h3>
                  <p className={styles.instructorTitle}>Course Instructor</p>
                  <p className={styles.instructorBio}>
                    Experienced professional in {course.category} with extensive knowledge 
                    in teaching and practical applications. Committed to helping students 
                    achieve their learning goals through comprehensive and engaging instruction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
      
      <div className={styles.courseContent}>
        <div className={styles.tabNavigation}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
         
          <button 
            className={`${styles.tabBtn} ${activeTab === 'instructor' ? styles.active : ''}`}
            onClick={() => setActiveTab('instructor')}
          >
            Instructor
          </button>
        </div>
        
        {renderTabContent()}
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseOverview;