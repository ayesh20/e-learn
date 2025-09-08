import React from 'react';
import styles from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.branding}>
                    <h2 className={styles.logo}>EduFlex</h2>
                    <p className={styles.tagline}>
                        Virtual Class<br />
                        for Zoom
                    </p>
                </div>

                <div className={styles.socialMedia}>
                    <a href="#" className={styles.socialLink} aria-label="Facebook">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className={styles.socialLink} aria-label="GitHub">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className={styles.socialLink} aria-label="Google">
                        <i className="fab fa-google"></i>
                    </a>
                </div>

                <div className={styles.links}>
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) =>
                            isActive ? `${styles['footer-link']} ${styles.active}` : styles['footer-link']
                        }
                    >
                        Contact us
                    </NavLink>
                    <span className={styles.separator}>|</span>
                    <NavLink 
                        to="/privacy" 
                        className={({ isActive }) =>
                            isActive ? `${styles['footer-link']} ${styles.active}` : styles['footer-link']
                        }
                    >
                        Privacy Policy
                    </NavLink>
                    <span className={styles.separator}>|</span>
                    <NavLink 
                        to="/terms" 
                        className={({ isActive }) =>
                            isActive ? `${styles['footer-link']} ${styles.active}` : styles['footer-link']
                        }
                    >
                        Terms & Conditions
                    </NavLink>
                </div>

                <div className={styles.copyright}>
                    <p>© 2025 EduFlex Technologies Inc.</p>
                </div>
            </div>
        </footer>
    );
}