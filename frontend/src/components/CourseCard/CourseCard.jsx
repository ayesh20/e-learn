// CourseCard.js
import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./CourseCard.module.css";

const CourseCard = ({ id, title, description, benefits, price, imageUrl, onDelete }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/lectureoverview`); // Navigate to LectureOverview page with course ID
  };

  return (
    <div className={styles.card}>
      {/* Course Title */}
      <h3 className={styles.courseTitle}>{title}</h3>
      
      {/* Book Image */}
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={title} className={styles.image} />

        {/* Update + Delete Overlay */}
        <div className={styles.overlay}>
          
          <div className={styles.deleteIcon} onClick={() => onDelete(id)}>
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
