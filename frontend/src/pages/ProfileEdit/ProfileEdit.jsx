
import './ProfileEdit.module.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';



import React, { useState } from "react";
import styles from "./ProfileEdit.module.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "Thomas D",
    lastName: "Mardun",
    email: "thomasmardun@gmail.com",
    gender: "Male",
    contact: "+94 7785 50 162",
    address: "No 1328, Annapitiya Rd, Tangalle",
    city: "Tangalle",
    state: "Hambanthota",
    zip: "82232",
    country: "Srilanka",
    password: "",
    bio:
      "Final-year Computer Science student passionate about technology, research, and innovation, eager to learn and grow."
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    alert("Profile updated!");
  };

  return (

    <><Navbar/>
    <div className={styles.profileContainer}>
      <h2 className={styles.pageTitle}>Edit Profile</h2>

      <div className={styles.profileHeader}>
        <div className={styles.profilePic}>
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300"
            alt="Profile"
          />
          <button type="button" aria-label="Edit photo" className={styles.editIcon}>
            ✎
          </button>
        </div>

        <div className={styles.bioSection}>
          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name</label>
            <input
              className={styles.input}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Last Name</label>
            <input
              className={styles.input}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Gender</label>
            <select
              className={styles.select}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Contact Number</label>
          <input
            className={styles.input}
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Address</label>
          <input
            className={styles.input}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input
              className={styles.input}
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>State</label>
            <input
              className={styles.input}
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Zip code</label>
            <input
              className={styles.input}
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <select
              className={styles.select}
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option>Srilanka</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
        </div>

        

        <button type="submit" className={styles.saveBtn}>SAVE</button>
      </form>
    </div>
    <Footer/></>
  );
};

export default EditProfile;
