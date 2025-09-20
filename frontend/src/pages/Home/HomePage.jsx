import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import styles from './Home.module.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function HomePage() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('');

    // Get userType from localStorage on component mount
    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    const statsData = [
        { number: '15K+', label: 'Students' },
        { number: '75%', label: 'Total success' },
        { number: '35', label: 'Main questions' },
        { number: '26', label: 'Lectures' }
    ];

    const handleInstructorAccess = () => {
        if (userType === 'instructor' || userType === '') {
            navigate('/InstructorDashboard');
        } else {
            alert('Access denied: This feature is only available for instructors');
            // Or you could use a more sophisticated notification system
        }
    };

    const handleStudentAccess = () => {
        if (userType === 'student' || userType === '') {
            navigate("/mycourses");
        } else {
            alert('Access denied: This feature is only available for students');
        }
    };

    return (
        <div className={styles.homePage}>
            <Navbar />
            
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            <span className={styles.studying}>Studying</span>
                            <span className={styles.online}> Online is now<br />much easier</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            TOTC is an interesting platform that will teach<br />
                            you in a more interactive way
                        </p>
                        <button className={styles.joinBtn} onClick={() => navigate("/register")}>Join for free</button>
                    </div>
                    <div className={styles.heroImage}>
                        <img 
                            src="/heroimg.png" 
                            alt="Student with books"
                            className={styles.studentImage}
                        />
                    </div>
                </div>
                <div className={styles.waveBottom}></div>
            </section>

            {/* Success Section */}
            <section className={styles.successSection}>
                <div className={styles.container}>
                    <h2 className={styles.successTitle}>Our Success</h2>
                    <p className={styles.successSubtitle}>
                        Ornare id fames interdum porttitor nulla turpis etiam. Duis vitae sollicitudin et nec<br />
                        urna ut tincidunt. Adipiscing at nunc lorem elit leo tellus mollis mauris tellus dui orci.
                    </p>
                    
                    <div className={styles.statsContainer}>
                        {statsData.map((stat, index) => (
                            <div key={index} className={styles.statItem}>
                                <div className={styles.statNumber}>{stat.number}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.featuresSection}>
                <div className={styles.container}>
                    <h2 className={styles.featuresTitle}>
                        All-In-One <span className={styles.cloudSoftware}>Cloud Software.</span>
                    </h2>
                    <p className={styles.featuresSubtitle}>
                        TOTC is one powerful online software suite that combines all the tools<br />
                        needed to run a successful school or office.
                    </p>
                    
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <i className='fas fa-file-alt'></i>
                            </div>
                            <h3 className={styles.featureTitle}>Well Prepared lecture readings, Downloads & Assignments</h3>
                            <p className={styles.featureDescription}>Well-prepared lectures with detailed readings, reference, first reading assignments help students with clear, structured, and accessible learning resources.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon1}>
                                <i className='fas fa-calendar-alt'></i>
                            </div>
                            <h3 className={styles.featureTitle}>Easy Scheduling & Conducting Courses</h3>
                            <p className={styles.featureDescription}>Easy scheduling and conducting of courses allows instructors to plan lessons without restriction, ensuring a smooth learning experience for students.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon2}>
                                <i className='fas fa-users'></i>
                            </div>
                            <h3 className={styles.featureTitle}>User Tracking</h3>
                            <p className={styles.featureDescription}>User tracking enables instructors of student activities and progress, helping improve student learning performance and engagement for better support and improvement.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is TOTC Section */}
            <section className={styles.totcSection}>
                <div className={styles.container}>
                    <h2 className={styles.totcTitle}>
                        What is <span className={styles.totcHighlight}>TOTC?</span>
                    </h2>
                    <p className={styles.totcDescription}>
                        TOTC is a platform that allows educators to create online classes whereby they can<br />
                        store the course materials online; manage assignments, quizzes and exams; monitor<br />
                        due dates; grade results and provide students with feedback all in one place.
                    </p>
                    
                    <div className={styles.totcCards}>
                        <div className={styles.totcCard}>
                            <div className={styles.cardOverlay}>
                                <h3 className={styles.cardTitle}>FOR INSTRUCTORS</h3>
                                <button 
                                    className={styles.cardBtn} 
                                    onClick={handleInstructorAccess}
                                >
                                    Access to course
                                </button>
                            </div>
                            <img 
                                src="/instructor.png" 
                                alt="For Instructors"
                                className={styles.cardImage}
                            />
                        </div>
                        
                        <div className={styles.totcCard}>
                            <div className={styles.cardOverlay}>
                                <h3 className={styles.cardTitle}>FOR STUDENTS</h3>
                                <button 
                                    className={styles.cardBtn} 
                                    onClick={handleStudentAccess}
                                >
                                    Access to course
                                </button>
                            </div>
                            <img 
                                src="/student.png" 
                                alt="For Students"
                                className={styles.cardImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Section */}
            <section className={styles.testimonialSection}>
                <div className={styles.container}>
                    <div className={styles.testimonialContent}>
                        <div className={styles.testimonialText}>
                            <div className={styles.testimonialLabel}>TESTIMONIAL</div>
                            <h2 className={styles.testimonialTitle}>What They Say?</h2>
                            <p className={styles.testimonialQuote}>
                                TOTC has got more than 100k positive ratings<br />
                                from our users around the world.
                            </p>
                            <p className={styles.testimonialDetail}>
                                Some of the students and teachers were<br />
                                greatly helped by the Skilline.
                            </p>
                            <p className={styles.testimonialQuestion}>
                                Are you too? Please give your assessment
                            </p>
                        </div>
                        <div className={styles.testimonialImage}>
                            <img 
                                src="/testimonial.png" 
                                alt="Happy student"
                                className={styles.happyStudent}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}