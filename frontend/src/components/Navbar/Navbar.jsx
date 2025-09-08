import React from "react";
import { FaEnvelope } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>EduFlex</div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>Home</a>
          <a href="#" className={styles.navLink}>Course</a>
          <a href="#" className={styles.navLink}>About Us</a>
          <FaEnvelope className={styles.icon} />
        </nav>

        {/* User Section */}
        <div className={styles.userSection}>
          <div className={styles.userBox}>
            <img
              src="images/user.png"
              alt="User"
              className={styles.avatar}
            />
            <span className={styles.userName}>Lina</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;