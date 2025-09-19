import React from "react";
import styles from "./InstructorDetails.module.css";

const InstructorDetails = () => {
  return (
    <div className={styles.instructorDetails}>
      <h3 className={styles.title}>Instructor Details</h3>
      
      <div className={styles.detailItem}>
        <label className={styles.label}>Instructor Name</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="Enter instructor name"
          defaultValue="Dr. Sarah Johnson"
        />
      </div>
      
      <div className={styles.detailItem}>
        <label className={styles.label}>Course Title</label>
        <input 
          type="text" 
          className={styles.input}
          placeholder="Enter course title"
          defaultValue="Advanced Literature Studies"
        />
      </div>
      
      <div className={styles.detailItem}>
        <label className={styles.label}>Description</label>
        <textarea 
          className={styles.textarea}
          placeholder="Enter course description"
          rows="4"
          defaultValue="This course explores advanced concepts in literature with focus on modern literary theories and critical analysis techniques."
        />
      </div>
      
      <button className={styles.saveBtn}>Save Details</button>
    </div>
  );
};

export default InstructorDetails;