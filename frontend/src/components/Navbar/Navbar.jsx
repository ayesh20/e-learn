import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { profileAPI, instructorAPI } from "../../services/api.js";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    profileImage: null,
    imageUrl: null,
    hasImage: false,
    userType: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userType = userData.role || userData.userType || 'student';
        
        console.log('Navbar: User type detected:', userType);
        console.log('Navbar: Stored user data:', userData);

        let response;
        let profileData = {};

        if (userType === 'instructor') {
          try {
            response = await instructorAPI.getProfile();
            console.log('Navbar: Instructor profile response:', response);
            
            if (response && response.success) {
              profileData = {
                firstName: response.data.firstName || response.data.name || 'Instructor',
                profileImage: response.data.profileImage,
                imageUrl: response.data.imageUrl,
                hasImage: response.data.hasImage || !!response.data.profileImage,
                userType: 'instructor'
              };
            }
          } catch (instructorError) {
            console.error('Navbar: Error fetching instructor profile:', instructorError);
            profileData = {
              firstName: userData.firstName || userData.name || 'Instructor',
              profileImage: null,
              imageUrl: null,
              hasImage: false,
              userType: 'instructor'
            };
          }
        } else {
          try {
            response = await profileAPI.getProfile();
            console.log('Navbar: Student profile response:', response);
            
            if (response && response.success) {
              profileData = {
                firstName: response.data.firstName || 'Student',
                profileImage: response.data.profileImage,
                imageUrl: response.data.imageUrl,
                hasImage: response.data.hasImage || !!response.data.profileImage,
                userType: 'student'
              };
            }
          } catch (studentError) {
            console.error('Navbar: Error fetching student profile:', studentError);
            profileData = {
              firstName: userData.firstName || 'Student',
              profileImage: null,
              imageUrl: null,
              hasImage: false,
              userType: 'student'
            };
          }
        }

        console.log('Navbar: Setting profile data:', profileData);
        setUserProfile(profileData);
        
      } catch (error) {
        console.error('Navbar: General error:', error);
        setUserProfile({
          firstName: 'User',
          profileImage: null,
          imageUrl: null,
          hasImage: false,
          userType: null
        });
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setUserProfile({
      firstName: '',
      profileImage: null,
      imageUrl: null,
      hasImage: false,
      userType: null
    });
    
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest(`.${styles.burgerIcon}`)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderProfileImage = () => {
    if (loading) {
      return (
        <div className={styles.avatarPlaceholder}>
          <FaUser />
        </div>
      );
    }

    if (userProfile.hasImage && userProfile.imageUrl) {
      return (
        <img
          src={userProfile.imageUrl}
          alt="Profile"
          className={styles.avatar}
          onError={(e) => {
            console.log('Navbar: Image failed to load:', e.target.src);
            if (userProfile.profileImage && !e.target.src.includes('/uploads/profiles/')) {
              e.target.src = `http://localhost:5000/uploads/profiles/${userProfile.profileImage}`;
            } else {
              e.target.src = "/images/user.jpg";
            }
            e.target.onerror = null;
          }}
          onLoad={() => console.log('Navbar: Image loaded successfully')}
        />
      );
    }

    return (
      <img
        src="/images/user.jpg"
        alt="User"
        className={styles.avatar}
        onError={(e) => {
          console.log('Navbar: Default image also failed');
          e.target.style.display = 'none';
        }}
      />
    );
  };

  const getDropdownItems = () => {
    if (userProfile.userType === 'instructor') {
      return (
        <Link
          to="/InstructorDashboard"
          className={styles.dropdownItem}
          onClick={() => {
            setDropdownOpen(false);
            setMobileMenuOpen(false);
          }}
        >
          Dashboard
        </Link>
      );
    } else {
      return (
        <Link
          to="/profileedit"
          className={styles.dropdownItem}
          onClick={() => {
            setDropdownOpen(false);
            setMobileMenuOpen(false);
          }}
        >
          Edit Profile
        </Link>
      );
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>EduFlex</div>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to="/Home" className={styles.navLink}>Home</Link>
          <Link to="/courses" className={styles.navLink}>Courses</Link>
          <Link to="/aboutus" className={styles.navLink}>About Us</Link>
          <Link to="/contactus" className={styles.navLink}>Contact</Link>
          <Link to="/messagingstudent1" className={styles.navLink}>
            <FaEnvelope className={styles.icon} />
          </Link>
        </nav>

        {/* Desktop User Section */}
        <div className={`${styles.userSection} ${styles.desktopOnly}`} ref={dropdownRef}>
          <div
            className={styles.userBox}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {renderProfileImage()}
            <span className={styles.userName}>
              {loading ? 'Loading...' : userProfile.firstName || 'User'}
            </span>
          </div>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              {getDropdownItems()}
              <button
                onClick={handleLogout}
                className={styles.dropdownItem}
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Burger Icon */}
        <div 
          className={styles.burgerIcon}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <div className={styles.mobileUserInfo}>
            {renderProfileImage()}
            <span className={styles.mobileUserName}>
              {loading ? 'Loading...' : userProfile.firstName || 'User'}
            </span>
          </div>
          
          <div className={styles.mobileNavLinks}>
            <Link 
              to="/Home" 
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/courses" 
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              to="/aboutus" 
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contactus" 
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/messagingstudent1" 
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Messages
            </Link>
            
            <div className={styles.mobileDivider}></div>
            
            {getDropdownItems()}
            
            <button
              onClick={handleLogout}
              className={styles.mobileLogoutBtn}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;