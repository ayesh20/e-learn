// CourseCard.js
import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./CourseCard.module.css";

const CourseCard = ({ title, description, benefits, price, imageUrl }) => {
  return (
    <div className={styles.card}>
      {/* Course Title */}
      <h3 className={styles.courseTitle}>{title}</h3>
      
      {/* Book Image */}
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />

        {/* Update + Delete Overlay */}
        <div className={styles.overlay}>
          <button className={styles.updateBtn}>Update</button>
          <div className={styles.deleteIcon}>
            <FaTrashAlt />
          </div>
        </div>
      </div>

      {/* Price and Benefits */}
      <div className={styles.courseInfo}>
        <p className={styles.benefits}>{benefits}</p>
        <p className={styles.price}>{price}</p>
      </div>
      
      {/* Description (if available) */}
      {description && <p className={styles.courseDescription}>{description}</p>}
    </div>
  );
};

export default CourseCard;