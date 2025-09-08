import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import styles from './OTPVerification.module.css';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [email] = useState(localStorage.getItem('resetEmail') || 'contact@dscode.com');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate(); // Added navigate function

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Timer for resend button
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input if current input has a value
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // If it's the last input and has a value, focus stays there
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1].focus();
      }
      
      // Clear current input
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
    
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    else if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleInput = (index, e) => {
    // Handle when user types in an already filled input
    const value = e.target.value;
    if (value.length > 1) {
      // If user pastes or types multiple digits, take the last one
      const lastDigit = value.slice(-1);
      const newOtp = [...otp];
      newOtp[index] = lastDigit;
      setOtp(newOtp);
      
      // Move to next input if available
      if (index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{5}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 5);
      setOtp(newOtp);
      
      // Update input values and focus last input
      newOtp.forEach((digit, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = digit;
        }
      });
      
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 5) {
      console.log('Verifying code:', code);
      // Add your verification logic here
      
      // After successful verification, navigate to ResetConfirm
      navigate('/ResetConfirm'); // Added navigation
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setIsResendDisabled(true);
    setOtp(['', '', '', '', '']);
    // Clear all input values
    inputRefs.current.forEach(input => {
      if (input) input.value = '';
    });
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    console.log('Resending OTP to:', email);
    // Add resend logic here
  };

  // Add onClick handler to focus on the clicked input
  const handleInputClick = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Check your email</h1>
        <p className={styles.subtitle}>
          We sent a reset link to <span className={styles.email}>{email}</span>
        </p>
        <p className={styles.instruction}>enter 5 digit code that mentioned in the email</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onInput={(e) => handleInput(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                onClick={() => handleInputClick(index)}
                className={styles.otpInput}
                required
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            className={styles.verifyButton}
            disabled={otp.join('').length !== 5}
          >
            Verify Code
          </button>
        </form>

        <div className={styles.resendContainer}>
          <p className={styles.resendText}>
            Haven't got the email yet?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResendDisabled}
              className={styles.resendButton}
            >
              <strong>Resend email</strong>
              {isResendDisabled && ` (${timeLeft}s)`}
            </button>
          </p>
        </div>

        <Link to="/forgot-password" className={styles.backLink}>
          ← Back to Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default OTPVerification;