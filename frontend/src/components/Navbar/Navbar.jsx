import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/"); // redirect to login
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>EduFlex</div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/Home" className={styles.navLink}>Home</Link>
          <Link to="/courses" className={styles.navLink}>Courses</Link>
          <Link to="/aboutus" className={styles.navLink}>About Us</Link>
          <Link to="/contactus" className={styles.navLink}>Contact</Link>
          <Link to="/messagingstudent1" className={styles.navLink}>
            <FaEnvelope className={styles.icon} />
          </Link>
        </nav>

        {/* User Section */}
        <div className={styles.userSection} ref={dropdownRef}>
          <div
            className={styles.userBox}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="images/user.png"
              alt="User"
              className={styles.avatar}
            />
            <span className={styles.userName}>Lina</span>
          </div>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <Link
                to="/profileedit"
                className={styles.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className={styles.dropdownItem}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
