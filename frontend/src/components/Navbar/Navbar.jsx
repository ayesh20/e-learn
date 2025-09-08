import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Navbar() {
    // Mock authentication state - replace with your actual auth logic
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({
        name: 'Lina',
        avatar: '/user-avatar.jpg' // Replace with actual user avatar path
    });

    const handleLogin = () => {
        // Mock login - replace with actual login logic
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        // Mock logout - replace with actual logout logic
        setIsAuthenticated(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <NavLink to="/" className={styles.logoLink}>
                        EduFlex
                    </NavLink>
                </div>

                {/* Navigation Links */}
                <div className={styles.navLinks}>
                    <NavLink
                        to="/home"
                        className={({ isActive }) =>
                            isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/course"
                        className={({ isActive }) =>
                            isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
                        }
                    >
                        Course
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? `${styles['nav-link']} ${styles.active}` : styles['nav-link']
                        }
                    >
                        About Us
                    </NavLink>
                </div>

                {/* Message Icon */}
                <div className={styles.messageIcon}>
                    <NavLink
                        to="/messages"
                        className={({ isActive }) =>
                            isActive ? `${styles['message-link']} ${styles.active}` : styles['message-link']
                        }
                    >
                        <i className="fas fa-envelope"></i>
                    </NavLink>
                </div>

                {/* Authentication Section */}
                <div className={styles.authSection}>
                    {!isAuthenticated ? (
                        <button 
                            className={styles.loginBtn}
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    ) : (
                        <div className={styles.userProfile}>
                            <div className={styles.userInfo}>
                                <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className={styles.userAvatar}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80';
                                    }}
                                />
                                <span className={styles.userName}>{user.name}</span>
                            </div>
                            <div className={styles.dropdown}>
                                <button className={styles.dropdownBtn}>
                                    <i className="fas fa-chevron-down"></i>
                                </button>
                                <div className={styles.dropdownMenu}>
                                    <NavLink to="/profile" className={styles.dropdownItem}>
                                        <i className="fas fa-user"></i>
                                        Profile
                                    </NavLink>
                                    <NavLink to="/settings" className={styles.dropdownItem}>
                                        <i className="fas fa-cog"></i>
                                        Settings
                                    </NavLink>
                                    <button 
                                        className={styles.dropdownItem}
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className={styles.mobileToggle}>
                    <button className={styles.toggleBtn}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
}