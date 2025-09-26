import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseAPI } from "../../services/api";
import styles from "./CourseForm.module.css";

const CourseForm = ({ onCourseCreated }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    instructorName: '',
    title: '',
    description: '',
    price: '',
    category: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdCourse, setCreatedCourse] = useState(null);

  // Default images based on category
  const getDefaultImage = (category) => {
    const imageMap = {
      'Design': '/images/course3.jpg',
      'Business': '/images/course4.jpg',
      'Technology': '/images/course1.png',
      'Web': '/images/course2.jpg',
      'Literature': '/images/course4.jpg',
      'Science': '/images/course9.jpg',
      'Math': '/images/course8.jpg'
    };
    return imageMap[category] || '/images/course1.png';
  };

  // Generate a test instructor ID if none exists
  useEffect(() => {
    const checkInstructorId = () => {
      let instructorId = localStorage.getItem('instructorId');
      if (!instructorId || instructorId === 'profile' || !instructorId.match(/^[0-9a-fA-F]{24}$/)) {
        // Generate a test ObjectId (24 character hex string)
        const testId = '507f1f77bcf86cd799439011';
        localStorage.setItem('instructorId', testId);
        console.log('Set test instructor ID:', testId);
      }
    };
    checkInstructorId();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push("Course title is required");
    if (!formData.description.trim()) errors.push("Course description is required");
    if (!formData.category) errors.push("Category is required");
    
    if (formData.price && isNaN(formData.price)) {
      errors.push("Price must be a valid number");
    }
    
    return errors;
  };

  const saveCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const errors = validateForm();
      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }

      const instructorId = localStorage.getItem('instructorId');
      if (!instructorId) {
        setError('No instructor ID found. Please log in again.');
        return;
      }

      // Get the default image for the selected category
      const defaultImage = getDefaultImage(formData.category);

      

      // Create the course data object
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructorId: instructorId,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        level: 'Beginner',
        status: 'Draft',
        thumbnail: defaultImage,     // Use default category image
        imageUrl: defaultImage,      // Also set imageUrl for consistency
        image: defaultImage          // Set image field as well
      };

      console.log('Creating course with data:', courseData);

      // Use the regular createCourse API function
      const response = await courseAPI.createCourse(courseData);
      
      if (response && response.course) {
        setCreatedCourse(response.course);
        setSuccess(true);
        console.log('Course created successfully:', response.course._id);
        
        // Call parent callback if provided
        if (onCourseCreated) {
          onCourseCreated(response.course);
        }
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
      
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      instructorName: '',
      title: '',
      description: '',
      price: '',
      category: ''
    });
    setCreatedCourse(null);
    setSuccess(false);
    setError(null);
  };

  const goToDashboard = () => {
    navigate("/InstructorDashboard");
  };

  return (
    <div className={styles.dashboard}>
      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className={styles.successMessage}>
          <p>Course created successfully! ID: {createdCourse?._id}</p>
          <button onClick={() => setSuccess(false)}>×</button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}>Creating course...</div>
        </div>
      )}

      {/* Top Banner */}
      <div className={styles.topBanner}>
        <img
          src="/images/banner.png"
          alt="Course Banner"
          className={styles.bannerImage}
        />
      </div>

      {/* Header */}
      <div className={styles.coursesHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <button className={styles.courseBtn} onClick={goToDashboard}>
              Courses
            </button>
            <button className={styles.addBtn}>Add</button>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.saveBtn}
              onClick={saveCourse}
              disabled={loading || !formData.title || !formData.description}
            >
              {loading ? 'Saving...' : 'Create Course'}
            </button>
            <button 
              className={styles.resetBtn}
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Instructor Name (Optional)" 
              value={formData.instructorName}
              onChange={(e) => handleInputChange('instructorName', e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Course Title *" 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
            <textarea 
              placeholder="Course Description *"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={4}
            />
            <input 
              type="number" 
              placeholder="Price (Leave empty for free)" 
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              min="0"
              step="0.01"
            />
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              <option value="">Select Category *</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
              <option value="Web">Web Development</option>
              <option value="Design">Design</option>
              <option value="Literature">Literature</option>
              <option value="Science">Science</option>
              <option value="Math">Mathematics</option>
            </select>
          </form>
        </div>

        <div className={styles.middle}>
          <div className={styles.imagePreview}>
            <h3>Course Image Preview</h3>
            {formData.category ? (
              <div className={styles.previewContainer}>
                <img 
                  src={getDefaultImage(formData.category)} 
                  alt={`Default image for ${formData.category}`}
                  className={styles.defaultImage}
                />
                <p>Default image for {formData.category} category</p>
              </div>
            ) : (
              <div className={styles.noPreview}>
                <p>Select a category to see the default image</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Created Status */}
      {createdCourse && (
        <div className={styles.courseStatus}>
          <h3>✅ Course Created Successfully!</h3>
          <div className={styles.courseDetails}>
            <p><strong>Course ID:</strong> {createdCourse._id}</p>
            <p><strong>Title:</strong> {createdCourse.title}</p>
            <p><strong>Category:</strong> {createdCourse.category}</p>
            <p><strong>Status:</strong> {createdCourse.status}</p>
            <p><strong>Price:</strong> ${createdCourse.price}</p>
            <p><strong>Default Image:</strong> {getDefaultImage(createdCourse.category)}</p>
          </div>
          <div className={styles.nextSteps}>
            <h4>Next Steps:</h4>
            <p>Your course has been created and saved with a default category image. You can now:</p>
            <ul>
              <li>Add course content and materials</li>
              <li>Create quizzes and assignments</li>
              <li>Publish the course when ready</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseForm;