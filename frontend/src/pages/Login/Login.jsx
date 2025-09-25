import React, { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { studentAPI, instructorAPI } from '../../services/api';
import { useAuth } from "../../context/AuthContext.jsx"; // <- use AuthContext
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
    const { login } = useAuth(); // <- get login function

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            if (location.state?.email) setEmail(location.state.email);
            window.history.replaceState(null, '');
        }
    }, [location]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
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

            // Student login
            try {
                response = await studentAPI.login(credentials);
                userType = 'student';
            } catch {
                // Instructor login
                response = await instructorAPI.loginInstructor(credentials);
                userType = 'instructor';
            }

            if (!response || !response.token) throw new Error('Login failed');

            // Save auth data
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userType', userType);
            login(userType === 'student' ? response.student : response.instructor); // <- update AuthContext

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('lastEmail', email);
            } else {
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('lastEmail');
            }

            toast.success(`Welcome! Logged in as ${userType}`);
            navigate(userType === 'student' ? '/Home' : '/InstructorDashboard');

        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Login failed');
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('lastEmail');
        if (rememberedEmail && localStorage.getItem('rememberMe')) setEmail(rememberedEmail);
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <div className={styles.imageSection}>
                    <img src="/login.jpg" alt="Login" className={styles.loginImage}/>
                </div>
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        <h1 className={styles.welcomeTitle}>Welcome to EduFlex!</h1>
                        <p className={styles.subtitle}>Log in to continue your learning journey</p>

                        <div className={styles.tabButtons}>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.active : styles.inactive}`}
                                onClick={() => setActiveTab('login')} type="button"
                            >
                                Login
                            </button>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'register' ? styles.active : styles.inactive}`}
                                onClick={() => navigate('/register')} type="button"
                            >
                                Register
                            </button>
                        </div>

                        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>Email Address</label>
                                <input 
                                    type="email" id="email" className={styles.input}
                                    placeholder="Enter your email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <div className={styles.inputContainer}>
                                    <input 
                                        type={showPassword ? 'text' : 'password'} id="password" className={styles.input}
                                        placeholder="Enter password" value={password}
                                        onChange={(e) => setPassword(e.target.value)} required
                                    />
                                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} ${styles.passwordToggle}`}
                                       onClick={() => setShowPassword(!showPassword)}></i>
                                </div>
                            </div>

                            <div className={styles.formOptions}>
                                <label className={styles.rememberMe}>
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> Remember me
                                </label>
                                <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
                            </div>

                            <button type="submit" className={styles.loginBtn} disabled={loading}>
                                {loading ? 'Signing In...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
