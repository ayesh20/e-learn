import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CourseForm.module.css";

const CourseForm = () => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const goToDashboard = () => {
    navigate("/InstructorDashboard");
  };

  return (
    <div className={styles.dashboard}>
      {/* Top Banner */}
      <div className={styles.topBanner}>
        <img
          src="/images/banner.png"
          alt="Course Banner"
          className={styles.bannerImage}
        />
      </div>

      {/* Header Buttons + Filter */}
      <div className={styles.coursesHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <button className={styles.courseBtn} onClick={goToDashboard}>
              Courses
            </button>
            <button className={styles.addBtn}>Add</button>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.filterContainer}>
              <select className={styles.filterDropdown}>
                <option>Category</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className={styles.wrapper}>
        {/* Left side form */}
        <div className={styles.left}>
          <form className={styles.form}>
            <input type="text" placeholder="Instructor Name" />
            <input type="text" placeholder="Course Title" />
            <textarea placeholder="Shortly describe your course details"></textarea>
            <input type="text" placeholder="Price" />
            <select>
              <option>Category</option>
            </select>
            <input type="text" placeholder="Duration" />
            <select>
              <option>Level</option>
            </select>
          </form>
        </div>

        {/* Middle upload */}
        <div className={styles.middle}>
          <div className={styles.uploadBox}>
            <p>Upload Image</p>
            <input type="file" onChange={handleImageUpload} />
          </div>
        </div>

        {/* Right preview */}
        <div className={styles.right}>
          <div className={styles.previewCard}>
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <img
                src="https://via.placeholder.com/200x150.png?text=Preview"
                alt="Preview"
              />
            )}
            <p>
              All Benefits of PLUS <span>$24</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
