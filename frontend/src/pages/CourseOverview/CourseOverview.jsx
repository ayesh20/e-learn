import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import React, { useState } from 'react';
import styles from './CourseOverview.module.css'; // Using CSS Modules

const CourseOverview = () => {
  const [activeTab, setActiveTab] = useState('overview'); // State for Overview/Curriculum tabs
  const navigate = useNavigate();
  const { id } = useParams(); // Get course ID from URL if needed

  const curriculumData = [
    {
      id: 1,
      title: 'Lessons With Video Content',
      lessons: '5 Lessons',
      duration: '45 Mins',
      subLessons: [
        { id: 1.1, title: 'Lessons with video content', duration: '12:30', status: 'preview' },
        { id: 1.2, title: 'Lessons with video content', duration: '10:05', status: 'preview' },
        { id: 1.3, title: 'Lessons with video content', duration: '2:25', status: 'locked' },
      ],
    },
    { id: 2, title: 'Lessons With Video Content', lessons: '5 Lessons', duration: '45 Mins', subLessons: [] },
    { id: 3, title: 'Lessons With Video Content', lessons: '5 Lessons', duration: '45 Mins', subLessons: [] },
    { id: 4, title: 'Lessons With Video Content', lessons: '5 Lessons', duration: '45 Mins', subLessons: [] },
  ];

  const handleStartNow = () => {
    navigate(`/course-details`); // Navigate to checkout page; default course ID = 1
  };

  return (
    <>
      <Navbar />
      <div className={styles.courseOverviewPage}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.tags}>
              <span className={styles.tag}>Photography</span>
              <span className={styles.author}>by DeterminedPoitras</span>
            </div>
            <h1>The Ultimate Guide To The Best WordPress LMS Plugin</h1>
            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <i className="fas fa-calendar-alt"></i>
                <span>2 Weeks</span>
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-users"></i>
                <span>156 Students</span>
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-signal"></i>
                <span>All levels</span>
              </div>
              <div className={styles.metaItem}>
                <i className="fas fa-question-circle"></i>
                <span>3 Quizzes</span>
              </div>
            </div>
          </div>

          {/* Promo Card */}
          <div className={styles.promoCard}>
            <img src="https://picsum.photos/250/150" alt="Promo" className={styles.promoImage} />
            <p className={styles.promoTitle}>Create an LMS website</p>
            <div className={styles.promoPricing}>
              <span className={styles.oldPrice}>$59.0</span>
              <span className={styles.newPrice}>$49.0</span>
            </div>
            {/* Start Now Button */}
            <button className={styles.startNowButton} onClick={handleStartNow}>
              Start Now
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            {/* Tabs for Overview/Curriculum */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'curriculum' ? styles.active : ''}`}
                onClick={() => setActiveTab('curriculum')}
              >
                Curriculum
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className={styles.overviewContent}>
                <p>
                  LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress
                  LMS Plugins which can be used to easily create & sell courses online.
                </p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className={styles.curriculumContent}>
                {curriculumData.map(section => (
                  <div key={section.id} className={styles.curriculumSection}>
                    <div className={styles.sectionHeader}>
                      <i className="fas fa-chevron-right"></i>
                      <h4>{section.title}</h4>
                      <span className={styles.sectionMeta}>{section.lessons}</span>
                      <span className={styles.sectionMeta}>{section.duration}</span>
                    </div>
                    <div className={styles.subLessons}>
                      {section.subLessons.map(lesson => (
                        <div key={lesson.id} className={styles.subLessonItem}>
                          <i className="fas fa-file-video"></i>
                          <span>{lesson.title}</span>
                          <div className={styles.subLessonActions}>
                            {lesson.status === 'preview' ? (
                              <button className={styles.previewButton}>Preview</button>
                            ) : (
                              <i className="fas fa-lock"></i>
                            )}
                            <span>{lesson.duration}</span>
                            <i className="fas fa-check"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leave a Comment Section */}
            <div className={styles.commentSection}>
              <h3>Leave A Comment</h3>
              <p>Your email address will not be published. Required fields are marked *</p>

              <form className={styles.commentForm}>
                <div className={styles.formRow}>
                  <input type="text" placeholder="Name*" required />
                  <input type="email" placeholder="Email*" required />
                </div>
                <textarea placeholder="Comment" rows="5"></textarea>
                <div className={styles.checkboxRow}>
                  <input type="checkbox" id="saveCommentInfo" />
                  <label htmlFor="saveCommentInfo">
                    Save my name, email in this browser for the next time I comment
                  </label>
                </div>
                <button type="submit" className={styles.postCommentButton}>
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseOverview;
