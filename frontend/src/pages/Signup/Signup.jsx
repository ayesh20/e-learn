import React from 'react';
import { useState } from 'react';
import styles from './Signup.module.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('register');
    const [userType, setUserType] = useState('student');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register submitted:', { 
            email, 
            fullName, 
            password, 
            confirmPassword, 
            userType 
        });
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginImage}>
                <img src="/signup.jpg" alt="Register" className={styles.image} />
            </div>
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <h1 className={styles.welcomeTitle}>Welcome to EduFlex.!</h1>
                    
                    <div className={styles.tabButtons}>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'login' ? styles.active : styles.inactive}`}
                            onClick={() => setActiveTab('login')}
                            type="button"
                        >
                            Login
                        </button>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'register' ? styles.active : styles.inactive}`}
                            onClick={() => setActiveTab('register')}
                            type="button"
                        >
                            Register
                        </button>
                    </div>
                    
                    <div className={styles.userTypeSelection}>
                        <div className={styles.userTypeOptions}>
                            <div 
                                className={`${styles.userTypeOption} ${userType === 'student' ? styles.selected : ''}`}
                                onClick={() => setUserType('student')}
                            >
                                <div className={styles.userTypeIcon}>
                                    <i className="fas fa-user-graduate"></i>
                                </div>
                                <span className={styles.userTypeLabel}>Student</span>
                            </div>
                            <div 
                                className={`${styles.userTypeOption} ${userType === 'instructor' ? styles.selected : ''}`}
                                onClick={() => setUserType('instructor')}
                            >
                                <div className={styles.userTypeIcon}>
                                    <i className="fas fa-chalkboard-teacher"></i>
                                </div>
                                <span className={styles.userTypeLabel}>Instructor</span>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                className={styles.input}
                                placeholder="Enter your Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="fullName" className={styles.label}>Full name</label>
                            <input 
                                type="text" 
                                id="fullName" 
                                className={styles.input}
                                placeholder="Enter your User name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <div className={styles.inputContainer}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    id="password" 
                                    className={styles.input}
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i 
                                    className={`${styles.passwordToggle} fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                    onClick={togglePassword}
                                ></i>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirm password</label>
                            <div className={styles.inputContainer}>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword" 
                                    className={styles.input}
                                    placeholder="Enter your Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <i 
                                    className={`${styles.passwordToggle} fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                    onClick={toggleConfirmPassword}
                                ></i>
                            </div>
                        </div>
                        
                        <button type="submit" className={styles.registerBtn}>Register</button>
                        
                        <button type="button" className={styles.googleBtn}>
                            <div className={styles.googleIcon}></div>
                            Continue with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}