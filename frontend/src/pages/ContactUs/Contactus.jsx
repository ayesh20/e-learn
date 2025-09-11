import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import React from "react";
import styles from "./ContactUs.module.css";


export default function ContactUs() {
  return (

    <><Navbar />
      
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

        <form className={styles.contactForm}>
          <div className={styles.row}>
            <input type="text" placeholder="Name*" required />
            <input type="email" placeholder="Email*" required />
          </div>

          <textarea placeholder="Comment" rows="5"></textarea>

          <div className={styles.checkboxRow}>
            <input type="checkbox" id="save" />
            <label htmlFor="save">
              Save my name, email in this browser for the next time I comment
            </label>
          </div>

          <button type="submit" className={styles.sendBtn}>
            Send
          </button>
        </form>
      </div>
    </div>
    <Footer /></>
  );
}
