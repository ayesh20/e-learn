import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { courseAPI, instructorAPI } from '../../services/api'
import './admin.css'

export default function UpdateCourse() {
  const location = useLocation()
  const navigate = useNavigate()
  const courseData = location.state?.courseData
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInstructors()
    
    // Populate form with course data
    if (courseData) {
      setFormData({
        courseId: courseData.courseId || '',
        name: courseData.name || '',
        description: courseData.description || '',
        instructor: courseData.instructor || '',
        duration: courseData.duration || '',
        price: courseData.price || '',
        level: courseData.level || 'Beginner',
        category: courseData.category || '',
        status: courseData.status || 'active',
        maxStudents: courseData.maxStudents || '',
        prerequisites: courseData.prerequisites || '',
        learningOutcomes: courseData.learningOutcomes || ''
      })
    }
  }, [courseData])

  const fetchInstructors = async () => {
    try {
      const data = await instructorAPI.getAllInstructors()
      setInstructors(data)
    } catch (err) {
      console.error('Error fetching instructors:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.instructor || !formData.category) {
        throw new Error('Please fill in all required fields')
      }

      // Validate price
      const price = parseFloat(formData.price) || 0
      if (price < 0) {
        throw new Error('Please enter a valid price (0 for free)')
      }

      // Create update data object
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        instructor: formData.instructor,
        duration: formData.duration.trim(),
        price: price,
        level: formData.level,
        category: formData.category,
        status: formData.status,
        maxStudents: formData.maxStudents || null,
        prerequisites: formData.prerequisites.trim(),
        learningOutcomes: formData.learningOutcomes.trim()
      }

      console.log('Updating course with ID:', courseData.courseId)
      console.log('Update data:', updateData)

      if (!courseData.courseId && !courseData._id) {
        throw new Error('Course ID is missing from course data')
      }

      // Use courseId if available, otherwise use _id
      const courseIdentifier = courseData.courseId || courseData._id
      await courseAPI.updateCourse(courseIdentifier, updateData)
      
      alert('Course updated successfully!')
      navigate('/admin/courses')
    } catch (err) {
      setError(err.message)
      console.error('Error updating course:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/courses')
  }

  if (!courseData) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Update Course</h1>
        <div className="error-message">
          No course data found. Please go back and select a course to update.
        </div>
        <button onClick={handleCancel} className="cancel-btn">Go Back</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Update Course</h1>
      
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
              className="form-input"
              disabled={true}
              style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              title="Course ID cannot be changed during update"
            />
            <small className="form-help">Course ID cannot be changed after creation</small>
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
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="add-product-btn"
            disabled={loading}
          >
            {loading ? 'Updating Course...' : 'Update Course'}
          </button>
        </div>
      </form>
    </div>
  )
}