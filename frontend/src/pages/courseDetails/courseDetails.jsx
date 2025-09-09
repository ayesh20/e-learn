import React, { useState } from 'react';
import { Play, Pause, Download, ChevronLeft, ChevronRight, FileText, MessageCircle } from 'lucide-react';
import styles from './courseDetails.module.css';
import Footer from '../../components/Footer/Footer.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';

const CourseDetails = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(3);
  const [progress] = useState(35);

  const chapters = [1, 2, 3, 4, 5, 6, 7];
  
  const materials = [
    { name: 'Advance Patterns Guid.pdf', size: '2.4 MB' },
    { name: 'Advance Patterns Guid.pdf', size: '1.8 MB' },
    { name: 'Advance Patterns Guid.pdf', size: '3.2 MB' }
  ];

  const assignments = [
    { name: 'Assignment 1', type: 'check' },
    { name: 'Quiz 1', type: 'attempt' }
  ];

  const getChapterClassName = (chapter) => {
    if (chapter < currentChapter) return `${styles.chapterCircle} ${styles.chapterCompleted}`;
    if (chapter === currentChapter) return `${styles.chapterCircle} ${styles.chapterActive}`;
    return `${styles.chapterCircle} ${styles.chapterDefault}`;
  };

  return (

   <div className={styles.courseDetailsPage}>
<Navbar />
     <div className={styles.container1}>
<img src="/heroimg1.png" alt="Course Banner" className={styles.courseBanner} />
  
      </div>
    <div className={styles.container}>
     
     
      {/* Course Info Section */}
      <div className={styles.courseInfoSection}>
        <img src="/course1.png" alt="Course Banner" className={styles.heroSection } />
        <h1 className={styles.courseTitle}>AWS Certified Solutions Architect</h1>
        
        <div className={styles.courseStats}>
          <div className={styles.statItem}>
            <span>👥 884 students</span>
          </div>
          <div className={styles.statItem}>
            <span>⏱️ 2 hours</span>
          </div>
          <div className={styles.statItem}>
            <span>Instructor: Dr Sarah Johnson</span>
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
        <button className={styles.navArrow}>
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
        
        <button className={styles.navArrow}>
          <ChevronRight size={20} color="#666" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainContent}>
        {/* Left Column - Video Section */}
        <div className={styles.videoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{currentChapter} Basics of AWS</h2>
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
                <button className={styles.videoNavBtn}>
                  <ChevronLeft size={14} />
                  Previous Video
                </button>
                <button className={styles.videoNavBtn}>
                  Next Video
                  <ChevronRight size={14} />
                </button>
              </div>
              <span className={styles.videoTitle}>Video title</span>
            </div>
          </div>

          <div className={styles.courseDescription}>
            Amazon Web Services offers a broad set of global cloud-based products including compute, storage, 
            databases, analytics, networking, mobile, developer tools, management tools, IoT, security, and 
            enterprise applications: on-demand, available in seconds, with pay-as-you-go pricing.
          </div>
        </div>

        {/* Right Column - Sidebar */}
        

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
          <span className={styles.certificateText}>End All tasks to earn your certificate</span>
          <button className={styles.certificateBtn}>Earn your certificate</button>
          <button className={styles.nextChapterBtn}>
            Next Chapter
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default CourseDetails;