import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import React, { useState, useEffect } from "react";
import styles from "./ContactUs.module.css";
import { contactAPI } from "../../services/api";

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get user data from localStorage but don't auto-fill
  // Users can manually enter their information
  useEffect(() => {
    // Optional: You can log that user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('User is logged in');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validate form
    if (!formData.name || !formData.email) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send data to backend using the contact API
      const response = await contactAPI.createContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        comment: formData.comment.trim() || 'NOT GIVEN'
      });

      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: response.message || 'Message sent successfully!' 
        });
        
        // Reset form if not saving info
        if (!saveInfo) {
          setFormData({
            name: '',
            email: '',
            comment: ''
          });
        } else {
          // Only clear comment
          setFormData(prev => ({
            ...prev,
            comment: ''
          }));
        }

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to send message. Please try again.' 
      });
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className={styles.contactPage}>
        {/* Top Section */}
        <div className={styles.topSection}>
          <div className={styles.contactInfo}>
            <h2>Need A Direct Line?</h2>
            <p>
              Cras massa et odio donec faucibus in. Vitae pretium massa dolor
              ullamcorper lectus elit quam.
            </p>

            <div className={styles.infoBox}>
              <span className={styles.icon}>📞</span>
              <div>
                <p>Phone</p>
                <strong>(123) 456 7890</strong>
              </div>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.icon}>✉️</span>
              <div>
                <p>Email</p>
                <strong>contact@eduflex.com</strong>
              </div>
            </div>
          </div>

          <div className={styles.mapBox}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.548353197949!2d-73.93524238459455!3d40.73061017932933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQzJzUwLjIiTiA3M8KwNTYnMDYuOSJX!5e0!3m2!1sen!2sus!4v1634111111111!5m2!1sen!2sus"
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy">
            </iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.formSection}>
          <h3>Contact Us</h3>
          <p>
            Your email address will not be published. Required fields are marked *
          </p>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <input 
                type="text" 
                name="name"
                placeholder="Name*" 
                value={formData.name}
                onChange={handleInputChange}
                required 
                disabled={isSubmitting}
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email*" 
                value={formData.email}
                onChange={handleInputChange}
                required 
                disabled={isSubmitting}
              />
            </div>

            <textarea 
              name="comment"
              placeholder="Comment" 
              rows="5"
              value={formData.comment}
              onChange={handleInputChange}
              disabled={isSubmitting}
            ></textarea>

            <div className={styles.checkboxRow}>
              <input 
                type="checkbox" 
                id="save"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="save">
                Save my name, email in this browser for the next time I comment
              </label>
            </div>

            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}