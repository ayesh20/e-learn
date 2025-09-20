import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { studentAPI, instructorAPI } from '../../services/api'; // Import your API functions
import styles from './Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // Handle success message from registration
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            if (location.state?.email) {
                setEmail(location.state.email);
            }
            // Clear the state
            window.history.replaceState(null, '');
        }
    }, [location]);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const credentials = { email, password };
            let response = null;
            let userType = null;

            // Try student login first
            try {
                response = await studentAPI.login(credentials);
                userType = 'student';
            } catch (studentError) {
                // If student login fails, try instructor login
                try {
                    response = await instructorAPI.loginInstructor(credentials);
                    userType = 'instructor';
                } catch (instructorError) {
                    throw new Error('Invalid email or password');
                }
            }

            if (response && response.token) {
                // Store authentication data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userType', userType);
                localStorage.setItem('userData', JSON.stringify(
                    userType === 'student' ? response.student : response.instructor
                ));

                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('lastEmail', email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('lastEmail');
                }

                console.log('Login successful:', response);

                // Navigate based on user type
                if (userType === 'student') {
                    navigate('/Home');
                } else {
                    navigate('/InstructorDashboard');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load remembered email on component mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('lastEmail');
        const rememberMeFlag = localStorage.getItem('rememberMe');
        
        if (rememberedEmail && rememberMeFlag) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

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
                        
                        {/* Success Message */}
                        {successMessage && (
                            <div className={styles.successMessage}>
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className={styles.input}
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                        required
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
                                <Link to="/forgot-password" className={styles.forgotPassword}>
                                    Forgot Password?
                                </Link>
                            </div>
                            
                            <button 
                                type="submit" 
                                className={styles.loginBtn}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Login'}
                            </button>
                            
                            <div className={styles.divider}>OR</div>
                            
                            <button type="button" className={styles.googleBtn}>
                                <div className={styles.googleIcon}></div>
                                Continue with Google
                            </button>
                        </form>

                        {/* Additional Links */}
                        <div className={styles.additionalLinks}>
                            <p className={styles.signupPrompt}>
                                Don't have an account? 
                                <Link to="/register" className={styles.signupLink}>
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}