import React from "react";
import styles from "./Aboutus.module.css";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

const About = () => {
  return (
    <>
      <Navbar />
      <div className={styles.aboutContainer}>
        <h2 className={styles.title}>About EduFlex</h2>
      <p className={styles.text}>
        At EduFlex, we believe learning should be flexible, engaging, and
        accessible to everyone. Our platform is designed to empower students,
        educators, and institutions with modern tools that make online education
        simple, interactive, and effective.
      </p>

      <p className={styles.text}>
        From personalized courses to collaborative learning spaces, EduFlex
        provides a seamless experience that adapts to different learning styles
        and goals. Whether you’re a student aiming to boost your skills, a
        teacher sharing knowledge, or an organization building training
        programs, EduFlex is here to support your journey.
      </p>

      <p className={styles.text}>
        Our mission is to bridge the gap between technology and education,
        making knowledge more reachable and learning more enjoyable. With
        EduFlex, education truly bends to fit your future.
      </p>
    </div>
    <Footer />
  </>
  );
}

export default About;
