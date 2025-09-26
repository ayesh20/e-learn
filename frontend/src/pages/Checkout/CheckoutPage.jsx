import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import styles from './CheckoutPage.module.css';
import { enrollmentAPI } from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get course data from navigation state
  const courseData = location.state?.courseData;
  const studentEmail = location.state?.studentEmail || localStorage.getItem('studentEmail') || localStorage.getItem('userEmail') || '';
  const studentName = location.state?.studentName || localStorage.getItem('studentName') || localStorage.getItem('currentUser') || '';

  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    saveInfo: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if no course data
  useEffect(() => {
    if (!courseData) {
      navigate('/courses');
    }
  }, [courseData, navigate]);

  if (!courseData) {
    return null; // Will redirect above
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Name on card is required';
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expirationDate)) {
      newErrors.expirationDate = 'Please enter date in MM/YY format';
    }

    if (!formData.cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'CVC must be at least 3 digits';
    }

    if (!studentEmail.trim()) {
      newErrors.email = 'Student email is required';
    }

    if (!studentName.trim()) {
      newErrors.name = 'Student name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpirationDate = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create enrollment record
      const enrollmentData = {
        courseName: courseData.title,
        studentName: studentName,
        studentEmail: studentEmail,
        enrollmentStatus: 'ENROLLED',
        enrollmentDate: new Date(),
        progress: 0,
        grade: 'Not Given'
      };

      console.log('Creating enrollment with data:', enrollmentData);

      await enrollmentAPI.createEnrollment(enrollmentData);

      // Show success message
      alert(`Payment successful! You are now enrolled in "${courseData.title}"`);
      
      // Navigate to courses page or enrollment confirmation
      navigate('/courses', { 
        state: { 
          message: `Successfully enrolled in "${courseData.title}"!`,
          type: 'success' 
        }
      });

    } catch (error) {
      console.error('Error processing payment/enrollment:', error);
      
      let errorMessage = 'Payment processing failed. Please try again.';
      
      if (error.message.includes('already enrolled')) {
        errorMessage = 'You are already enrolled in this course!';
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate totals
  const subtotal = courseData.priceValue || 0;
  const tax = 0; // No tax for now
  const total = subtotal + tax;

  return (
    <>
      <Navbar />
      
      <div className={styles.checkoutPage}>
        <div className={styles.checkoutContainer}>
          {/* Left Section - Payment Form */}
          <div className={styles.paymentSection}>
            <h2>Checkout</h2>
            
            {/* Student Information Display */}
            <div className={styles.studentInfo}>
              <h3>Student Information</h3>
              <div className={styles.infoItem}>
                <label>Student Name:</label>
                <span>{studentName || 'Not provided'}</span>
              </div>
              <div className={styles.infoItem}>
                <label>Email:</label>
                <span>{studentEmail || 'Not provided'}</span>
              </div>
            </div>
            
            <div className={styles.cartType}>
              <p>Payment Method</p>
              <div className={styles.paymentMethods}>
                <img src="/images/paypal.png" alt="PayPal" className={styles.paymentIcon} />
                <img src="/images/amex.png" alt="American Express" className={styles.paymentIcon} />
                <img src="/images/visa.png" alt="Visa" className={styles.paymentIcon} />
                <img src="/images/mastercard.png" alt="Mastercard" className={styles.paymentIcon} />
              </div>
            </div>

            <form className={styles.checkoutForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name on Card *</label>
                <input
                  type="text"
                  placeholder="Enter name on Card"
                  value={formData.nameOnCard}
                  onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                  className={errors.nameOnCard ? styles.errorInput : ''}
                  required
                />
                {errors.nameOnCard && <span className={styles.errorText}>{errors.nameOnCard}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Card Number *</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  className={errors.cardNumber ? styles.errorInput : ''}
                  required
                />
                {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Expiration Date (MM/YY) *</label>
                  <input
                    type="text"
                    placeholder="12/25"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', formatExpirationDate(e.target.value))}
                    className={errors.expirationDate ? styles.errorInput : ''}
                    maxLength="5"
                    required
                  />
                  {errors.expirationDate && <span className={styles.errorText}>{errors.expirationDate}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label>CVC *</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={errors.cvc ? styles.errorInput : ''}
                    maxLength="4"
                    required
                  />
                  {errors.cvc && <span className={styles.errorText}>{errors.cvc}</span>}
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={formData.saveInfo}
                  onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                />
                <label htmlFor="saveInfo">
                  Save my information for faster checkout
                </label>
              </div>

              {(errors.email || errors.name) && (
                <div className={styles.errorMessage}>
                  {errors.email && <p>{errors.email}</p>}
                  {errors.name && <p>{errors.name}</p>}
                  <p>Please ensure you are logged in properly.</p>
                </div>
              )}

              <button 
                type="submit" 
                className={styles.confirmBtn}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className={styles.processingText}>
                    <span className={styles.spinner}></span>
                    Processing Payment...
                  </span>
                ) : (
                  'Confirm Payment'
                )}
              </button>
            </form>
          </div>

          {/* Right Section - Order Summary */}
          <div className={styles.summarySection}>
            <h3>Order Summary</h3>
            
            <div className={styles.orderItem}>
              <img 
                src={courseData.image} 
                alt={courseData.title} 
                className={styles.courseImage}
                onError={(e) => {
                  e.target.src = '/images/course4.jpg';
                }}
              />
              <div className={styles.itemDetails}>
                <h4>{courseData.title}</h4>
                <p className={styles.courseCategory}>{courseData.category}</p>
                <p className={styles.courseInstructor}>by {courseData.author}</p>
                <div className={styles.courseFeatures}>
                  <span>🎓 Certificate included</span>
                  <span>♾️ Lifetime access</span>
                  <span>📱 Mobile friendly</span>
                </div>
                <span className={styles.price}>{courseData.price}</span>
              </div>
            </div>

            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{subtotal} LKR</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Coupon Discount</span>
                <span>-</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>TAX</span>
                <span>{tax} LKR</span>
              </div>
              
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <div className={styles.totalAmount}>
                  <span className={styles.totalPrice}>{total} LKR</span>
                  <span className={styles.taxInfo}>Tax included</span>
                </div>
              </div>
            </div>

            <div className={styles.securityInfo}>
              <div className={styles.securityItem}>
                <span className={styles.securityIcon}>🔒</span>
                <span>Secure SSL encryption</span>
              </div>
              <div className={styles.securityItem}>
                <span className={styles.securityIcon}>💳</span>
                <span>All major cards accepted</span>
              </div>
              <div className={styles.securityItem}>
                <span className={styles.securityIcon}>↩️</span>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}