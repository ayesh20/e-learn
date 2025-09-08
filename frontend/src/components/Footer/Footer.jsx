import React from "react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      {/* Top Section */}
      <div className={styles.top}>
        <h2 className={styles.logo}>EduFlex</h2>
        <span className={styles.tagline}>Virtual Class <br /> for Zoom</span>
      </div>

      {/* Social Icons */}
      <div className={styles.social}>
        <a href="#"><FaFacebookF /></a>
        <a href="#"><FaGithub /></a>
        <a href="#"><FaLinkedinIn /></a>
        <a href="#"><FaGoogle /></a>
      </div>

      {/* Links */}
      <div className={styles.links}>
        <a href="#">Contact us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
      </div>

      {/* Bottom */}
      <div className={styles.bottom}>
        <p>© 2025 EduFlex Technologies Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
