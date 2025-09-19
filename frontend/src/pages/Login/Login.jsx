import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [activeTab, setActiveTab] = useState('login');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted:', { username, password, rememberMe });
        navigate('/home');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Left image */}
                <div className={styles.imageSection}>
                    <img src="/login.jpg" alt="Login" className={styles.loginImage}/>
                </div>

                {/* Right form */}
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        <h1 className={styles.welcomeTitle}>Welcome to EduFlex!</h1>
                        <p className={styles.subtitle}>Log in to continue your learning journey</p>
                        
                        {/* Tabs */}
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
                                onClick={() => navigate('/register')}
                                type="button"
                            >
                                Register
                            </button>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username" className={styles.label}>User name</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    className={styles.input}
                                    placeholder="Enter your user name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                            
                            <div className={styles.formOptions}>
                                <label className={styles.rememberMe}>
                                    <input 
                                        type="checkbox" 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
                            </div>
                            
                            <button type="submit" className={styles.loginBtn}>Login</button>
                            
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
