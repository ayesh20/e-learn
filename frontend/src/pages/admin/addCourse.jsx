import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './admin.css'

export default function AddCourse() {
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [formData, setFormData] = useState({
    courseId: '',
    name: '',
    description: '',
    instructor: '',
    duration: '',
    price: '',
    level: 'Beginner',
    category: '',
    status: 'active',
    maxStudents: '',
    prerequisites: '',
    learningOutcomes: ''
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const data = await instructorAPI.getAllInstructors()
      setInstructors(data)
    } catch (err) {
      console.error('Error fetching instructors:', err)
      setError('Failed to load instructors')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Please select only image files (JPEG, PNG, GIF, WebP)')
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      setSelectedImage(file)
      setError(null)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.courseId || !formData.name || !formData.description || !formData.instructor || !formData.category) {
        throw new Error('Please fill in all required fields')
      }

      // Validate price
      const price = parseFloat(formData.price) || 0
      if (price < 0) {
        throw new Error('Please enter a valid price (0 for free)')
      }

      // Validate courseId format
      const courseIdRegex = /^[a-zA-Z0-9_-]+$/
      if (!courseIdRegex.test(formData.courseId)) {
        throw new Error('Course ID can only contain letters, numbers, hyphens, and underscores')
      }

      // Create FormData for file upload
      const courseFormData = new FormData()
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'price') {
          courseFormData.append(key, price.toString())
        } else {
          courseFormData.append(key, formData[key].toString().trim())
        }
      })

      // Append image if selected
      if (selectedImage) {
        courseFormData.append('image', selectedImage)
      }

      console.log('Submitting course data:', {
        ...formData,
        price: price,
        hasImage: !!selectedImage
      })

      const result = await courseAPI.createCourse(courseFormData)
      console.log('Course creation result:', result)
      
      alert('Course added successfully!')
      
      // Clean up preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      
      // Navigate back to courses list
      navigate('/admin/courses')
    } catch (err) {
      console.error('Error adding course:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Add New Course</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="courseId">Course ID *</label>
            <input
              type="text"
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter unique course ID (e.g., CS101)"
              pattern="[a-zA-Z0-9_-]+"
              title="Course ID can only contain letters, numbers, hyphens, and underscores"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Course Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter course name"
              maxLength={100}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Course Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            required
            placeholder="Enter detailed course description"
            maxLength={2000}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="instructor">Instructor *</label>
            <select
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor.name}>
                  {instructor.name} - {instructor.expertise}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Course Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Science">Data Science</option>
              <option value="Languages">Languages</option>
              <option value="Personal Development">Personal Development</option>
              <option value="Health & Fitness">Health & Fitness</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 8 weeks, 40 hours"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Course Price (LKR)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="0.00 (Enter 0 for free course)"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="level">Course Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxStudents">Maximum Students</label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              value={formData.maxStudents}
              onChange={handleChange}
              className="form-input"
              min="1"
              placeholder="Leave empty for unlimited"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prerequisites">Prerequisites</label>
          <textarea
            id="prerequisites"
            name="prerequisites"
            value={formData.prerequisites}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="What students need to know before taking this course"
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="learningOutcomes">Learning Outcomes</label>
          <textarea
            id="learningOutcomes"
            name="learningOutcomes"
            value={formData.learningOutcomes}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="What students will learn by the end of this course"
            maxLength={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Course Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          <small className="form-help">
            Select a course thumbnail image. Must be less than 5MB. Supported formats: JPEG, PNG, GIF, WebP
          </small>
        </div>

        {imagePreview && (
          <div className="form-group">
            <label>Image Preview</label>
            <div className="image-preview-container">
              <div className="image-preview-item">
                <img 
                  src={imagePreview} 
                  alt="Course preview" 
                  className="image-preview"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="status">Course Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin/courses')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="add-product-btn"
            disabled={loading}
          >
            {loading ? 'Adding Course...' : 'Add Course'}
          </button>
        </div>
      </form>
    </div>
  )
}