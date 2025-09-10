import React, { useRef } from "react";
import styles from "./CoverImageUpload.module.css";

const CoverImageUpload = ({ coverImage, onImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.coverImageUpload}>
      <h3 className={styles.title}>Cover Image</h3>
      
      <div className={styles.uploadArea}>
        {coverImage ? (
          <div className={styles.imagePreview}>
            <img 
              src={coverImage} 
              alt="Course Cover" 
              className={styles.previewImage}
            />
            <button 
              className={styles.changeBtn}
              onClick={handleUploadClick}
            >
              Change Image
            </button>
          </div>
        ) : (
          <div className={styles.uploadPlaceholder} onClick={handleUploadClick}>
            <div className={styles.uploadIcon}>+</div>
            <p className={styles.uploadText}>Upload Cover Image</p>
            <p className={styles.uploadSubtext}>Click to browse files</p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className={styles.fileInput}
        />
      </div>
      
      <div className={styles.uploadInfo}>
        <p className={styles.infoText}>
          Recommended: 1200×600 pixels (2:1 ratio)
        </p>
        <p className={styles.infoText}>
          Supported formats: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
};

export default CoverImageUpload;