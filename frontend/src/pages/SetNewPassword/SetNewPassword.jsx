import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SetNewPassword.module.css';

const SetNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    
    // Handle password update logic here
    console.log('Updating password...');
    
    // After successful password update, navigate to SuccessfulReset
    navigate('/SuccessfulReset');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set a new password</h1>
        <p className={styles.subtitle}>
          Create a new password. Ensure it differs from previous ones for security
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                placeholder="Enter your new password"
                required
              />
              <div className={styles.passwordDots}>
                {password.length > 0 && (showPassword ? password : '•'.repeat(password.length))}
              </div>
              <button
                type="button"
                className={styles.visibilityToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99742 11.1892 8.99742 12C8.99742 13.6569 10.3406 15 11.9974 15C12.8137 15 13.5536 14.6727 14.0957 14.144M6.49902 6.64715C4.59971 7.90034 3.15305 9.78394 2.45703 12C3.73593 16.0571 7.58187 19 11.9974 19C14.0611 19 15.9743 18.3217 17.547 17.1474M12.0034 5C14.6889 5 17.0548 6.23805 18.7087 8.11095" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
                placeholder="Confirm your new password"
                required
              />
              <div className={styles.passwordDots}>
                {confirmPassword.length > 0 && (showConfirmPassword ? confirmPassword : '•'.repeat(confirmPassword.length))}
              </div>
              <button
                type="button"
                className={styles.visibilityToggle}
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99742 11.1892 8.99742 12C8.99742 13.6569 10.3406 15 11.9974 15C12.8137 15 13.5536 14.6727 14.0957 14.144M6.49902 6.64715C4.59971 7.90034 3.15305 9.78394 2.45703 12C3.73593 16.0571 7.58187 19 11.9974 19C14.0611 19 15.9743 18.3217 17.547 17.1474M12.0034 5C14.6889 5 17.0548 6.23805 18.7087 8.11095" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <button type="submit" className={styles.updateButton}>
            Update Password
          </button>
        </form>

        <Link to="/login" className={styles.backLink}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default SetNewPassword;