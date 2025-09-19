import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneno, setPhoneno] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register submitted:', { email, fullName, phoneno, password, confirmPassword });
        navigate('/home');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Left Image */}
                <div className={styles.imageSection}>
                    <img src="/signup.jpg" alt="Register" className={styles.loginImage}/>
                </div>

                {/* Right Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        
                        {/* 🔥 Header Section (always at top) */}
                        <div className={styles.headerSection}>
                            <h1 className={styles.welcomeTitle}>Welcome to EduFlex!</h1>
                            <p className={styles.subtitle}>Log in to continue your learning journey</p>

                            {/* Tabs */}
                            <div className={styles.tabButtons}>
                                <button 
                                    className={`${styles.tabBtn} ${styles.inactive}`}
                                    type="button"
                                    onClick={() => navigate('/')}
                                >
                                    Login
                                </button>
                                <button 
                                    className={`${styles.tabBtn} ${styles.active}`}
                                    type="button"
                                >
                                    Register
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="fullName" className={styles.label}>Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    className={styles.input}
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phoneno" className={styles.label}>Phone Number</label>
                                <input
                                    type="text"
                                    id="phoneno"
                                    className={styles.input}
                                    placeholder="Enter your phone number"
                                    value={phoneno}
                                    onChange={(e) => setPhoneno(e.target.value)}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className={styles.input}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <i
                                        className={`${styles.passwordToggle} fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                                <div className={styles.inputContainer}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className={styles.input}
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <i
                                        className={`${styles.passwordToggle} fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    ></i>
                                </div>
                            </div>

                            <button type="submit" className={styles.loginBtn}>Register</button>

                            <div className={styles.divider}>OR</div>

                            <button type="button" className={styles.googleBtn}>
                                <div className={styles.googleIcon}></div>
                                Continue with Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
