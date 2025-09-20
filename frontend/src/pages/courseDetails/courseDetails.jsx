import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Download, ChevronLeft, ChevronRight, FileText, MessageCircle } from 'lucide-react';
import styles from './courseDetails.module.css';
import Footer from '../../components/Footer/Footer.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { enrollmentAPI } from '../../services/api';

const CourseDetails = () => {
  const location = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(3);
  const [courseData, setCourseData] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const chapters = [1, 2, 3, 4, 5, 6, 7];
  
  const materials = [
    { name: 'Advance Patterns Guide.pdf', size: '2.4 MB' },
    { name: 'Course Workbook.pdf', size: '1.8 MB' },
    { name: 'Practice Exercises.pdf', size: '3.2 MB' }
  ];

  const assignments = [
    { name: 'Assignment 1', type: 'check' },
    { name: 'Quiz 1', type: 'attempt' }
  ];

  useEffect(() => {
    initializeCourseData();
  }, [courseId, location.state]);

  const initializeCourseData = async () => {
    try {
      // Check if data was passed via navigation state
      if (location.state) {
        const {
          courseName,
          enrollmentData: passedEnrollmentData,
          courseImage,
          instructor,
          progress,
          currentLesson,
          totalLessons
        } = location.state;

        setCourseData({
          title: courseName,
          image: courseImage,
          instructor: instructor,
          totalLessons: totalLessons,
          duration: '2 hours', // You can make this dynamic
          students: '884 students' // You can make this dynamic
        });

        setEnrollmentData(passedEnrollmentData);
        setCurrentChapter(currentLesson || Math.ceil((progress / 100) * 7) || 1);
      } else if (courseId) {
        // If no state passed, try to fetch enrollment data
        await fetchEnrollmentData(courseId);
      }
    } catch (error) {
      console.error('Error initializing course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollmentData = async (enrollmentId) => {
    try {
      const enrollment = await enrollmentAPI.getEnrollment(enrollmentId);
      setEnrollmentData(enrollment);
      
      setCourseData({
        title: enrollment.courseName,
        image: '/course1.png', // Default image
        instructor: 'Dr Sarah Johnson',
        totalLessons: 7,
        duration: '2 hours',
        students: '884 students'
      });
      
      setCurrentChapter(Math.ceil((enrollment.progress / 100) * 7) || 1);
    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      // Fallback to default course data
      setCourseData({
        title: 'AWS Certified Solutions Architect',
        image: '/course1.png',
        instructor: 'Dr Sarah Johnson',
        totalLessons: 7,
        duration: '2 hours',
        students: '884 students'
      });
    }
  };

  const updateProgress = async (newProgress) => {
    if (!enrollmentData) return;

    try {
      await enrollmentAPI.updateEnrollment(enrollmentData._id, {
        ...enrollmentData,
        progress: newProgress,
        enrollmentStatus: newProgress >= 100 ? 'COMPLETED' : 'IN PROGRESS'
      });
      
      setEnrollmentData(prev => ({
        ...prev,
        progress: newProgress,
        enrollmentStatus: newProgress >= 100 ? 'COMPLETED' : 'IN PROGRESS'
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < chapters.length) {
      const nextChapter = currentChapter + 1;
      setCurrentChapter(nextChapter);
      
      // Update progress based on chapter completion
      const newProgress = Math.round((nextChapter / chapters.length) * 100);
      updateProgress(newProgress);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const getChapterClassName = (chapter) => {
    if (chapter < currentChapter) return `${styles.chapterCircle} ${styles.chapterCompleted}`;
    if (chapter === currentChapter) return `${styles.chapterCircle} ${styles.chapterActive}`;
    return `${styles.chapterCircle} ${styles.chapterDefault}`;
  };

  if (loading) {
    return (
      <div className={styles.courseDetailsPage}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <p>Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progress = enrollmentData?.progress || 0;

  return (
    <div className={styles.courseDetailsPage}>
      <Navbar />
      
      <div className={styles.container1}>
        <img src="/heroimg1.png" alt="Course Banner" className={styles.courseBanner} />
      </div>
      
      <div className={styles.container}>
        {/* Course Info Section */}
        <div className={styles.courseInfoSection}>
          <img src={courseData?.image || "/course1.png"} alt="Course Banner" className={styles.heroSection} />
          <h1 className={styles.courseTitle}>{courseData?.title || 'Course Title'}</h1>
          
          <div className={styles.courseStats}>
            <div className={styles.statItem}>
              <span>👥 {courseData?.students || '884 students'}</span>
            </div>
            <div className={styles.statItem}>
              <span>⏱️ {courseData?.duration || '2 hours'}</span>
            </div>
            <div className={styles.statItem}>
              <span>Instructor: {courseData?.instructor || 'Dr Sarah Johnson'}</span>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>Course Progress {progress}%</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Chapters Navigation */}
        <div className={styles.chaptersSection}>
          <button className={styles.navArrow} onClick={handlePreviousChapter}>
            <ChevronLeft size={20} color="#666" />
          </button>
          
          {chapters.map(chapter => (
            <div
              key={chapter}
              className={getChapterClassName(chapter)}
              onClick={() => setCurrentChapter(chapter)}
            >
              {chapter}
            </div>
          ))}
          
          <button className={styles.navArrow} onClick={handleNextChapter}>
            <ChevronRight size={20} color="#666" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainContent}>
          {/* Left Column - Video Section */}
          <div className={styles.videoSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Chapter {currentChapter}: Basics of {courseData?.title?.split(' ')[0] || 'AWS'}</h2>
              <p className={styles.sectionSubtitle}>Lecture Videos</p>
            </div>

            <div className={styles.videoContainer}>
              <button 
                className={styles.videoPlayer} 
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <div className={styles.playButtonLarge}>
                  {isPlaying ? <Pause size={28} color="#333" /> : <Play size={28} color="#333" />}
                </div>
              </button>
              
              <div className={styles.videoControls}>
                <div className={styles.videoNavButtons}>
                  <button className={styles.videoNavBtn} onClick={handlePreviousChapter}>
                    <ChevronLeft size={14} />
                    Previous Video
                  </button>
                  <button className={styles.videoNavBtn} onClick={handleNextChapter}>
                    Next Video
                    <ChevronRight size={14} />
                  </button>
                </div>
                <span className={styles.videoTitle}>Chapter {currentChapter} - Video {currentChapter}</span>
              </div>
            </div>

            <div className={styles.courseDescription}>
              {courseData?.title?.includes('AWS') && 
                'Amazon Web Services offers a broad set of global cloud-based products including compute, storage, databases, analytics, networking, mobile, developer tools, management tools, IoT, security, and enterprise applications: on-demand, available in seconds, with pay-as-you-go pricing.'
              }
              {courseData?.title?.includes('UI/UX') &&
                'User Interface and User Experience design focuses on creating intuitive, accessible, and engaging digital experiences. Learn the principles of design thinking, wireframing, prototyping, and user research.'
              }
              {courseData?.title?.includes('Design') &&
                'Master the fundamentals of graphic design including color theory, typography, composition, and visual hierarchy. Create compelling visual communications for digital and print media.'
              }
              {!courseData?.title?.includes('AWS') && !courseData?.title?.includes('UI/UX') && !courseData?.title?.includes('Design') &&
                'This comprehensive course covers all the essential topics you need to master. Follow along with hands-on exercises and real-world projects to build practical skills.'
              }
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          {/* Course Materials */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionTitle}>Course Materials</h3>
            
            {materials.map((material, index) => (
              <div key={index} className={styles.materialItem}>
                <div className={styles.materialInfo}>
                  <div className={styles.fileIcon}>
                    <FileText size={18} color="#666" />
                  </div>
                  <div className={styles.materialDetails}>
                    <div className={styles.materialName}>{material.name}</div>
                    <div className={styles.materialSize}>{material.size} PDF</div>
                  </div>
                </div>
                <button className={styles.downloadBtn}>
                  <Download size={14} />
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Assignments */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sectionTitle}>Available Assignments & Quiz's</h3>
            
            {assignments.map((assignment, index) => (
              <div key={index} className={styles.assignmentItem}>
                <span className={styles.assignmentName}>{assignment.name}</span>
                <button 
                  className={`${styles.assignmentBtn} ${
                    assignment.type === 'check' ? styles.checkBtn : styles.attemptBtn
                  }`}
                >
                  {assignment.type === 'check' ? 'Check' : 'Attempt Quiz'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.chatSection}>
          <span className={styles.chatText}>Chat with instructor</span>
          <button className={styles.chatBtn}>
            <MessageCircle size={16} />
            Chat
          </button>
        </div>

        <div className={styles.rightSection}>
          <span className={styles.certificateText}>
            {progress >= 100 ? 'Congratulations! You can now earn your certificate' : 'End All tasks to earn your certificate'}
          </span>
          <button 
            className={styles.certificateBtn}
            disabled={progress < 100}
          >
            {progress >= 100 ? 'Download Certificate' : 'Earn your certificate'}
          </button>
          <button 
            className={styles.nextChapterBtn}
            onClick={handleNextChapter}
            disabled={currentChapter >= chapters.length}
          >
            {currentChapter >= chapters.length ? 'Course Complete' : 'Next Chapter'}
            {currentChapter < chapters.length && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default CourseDetails;