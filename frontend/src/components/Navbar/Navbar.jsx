import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser } from "react-icons/fa";
import { profileAPI, instructorAPI } from "../../services/api.js";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    profileImage: null,
    imageUrl: null,
    hasImage: false,
    userType: null // Track user type
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get stored user data to determine user type
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userType = userData.role || userData.userType || 'student'; // Check what field stores user type
        
        console.log('Navbar: User type detected:', userType);
        console.log('Navbar: Stored user data:', userData);

        let response;
        let profileData = {};

        if (userType === 'instructor') {
          // Fetch instructor profile
          try {
            // Use getProfile method for instructor (not getInstructor which needs ID)
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
            // Fallback to stored data
            profileData = {
              firstName: userData.firstName || userData.name || 'Instructor',
              profileImage: null,
              imageUrl: null,
              hasImage: false,
              userType: 'instructor'
            };
          }
        } else {
          // Fetch student profile (default)
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
            // Fallback to stored data
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
        // Final fallback
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

    // Only fetch if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Reset user profile state
    setUserProfile({
      firstName: '',
      profileImage: null,
      imageUrl: null,
      hasImage: false,
      userType: null
    });
    
    // Redirect to login
    navigate("/");
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
            // Try fallback URL construction
            if (userProfile.profileImage && !e.target.src.includes('/uploads/profiles/')) {
              e.target.src = `http://localhost:5000/uploads/profiles/${userProfile.profileImage}`;
            } else {
              // Final fallback to default image
              e.target.src = "/images/user.jpg";
            }
            e.target.onerror = null; // Prevent infinite loop
          }}
          onLoad={() => console.log('Navbar: Image loaded successfully')}
        />
      );
    }

    // Default profile image
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
        <>
          
          <Link
            to="/InstructorDashboard"
            className={styles.dropdownItem}
            onClick={() => setDropdownOpen(false)}
          >
            Dashboard
          </Link>
        </>
      );
    } else {
      return (
        <>
          
          <Link
            to="/profileedit"
            className={styles.dropdownItem}
            onClick={() => setDropdownOpen(false)}
          >
            Edit Profile
          </Link>
        </>
      );
    }
  };

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
      </div>
      
      
    </header>
  );
};

export default Navbar;