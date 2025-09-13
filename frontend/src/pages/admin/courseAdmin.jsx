import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { getImageUrl, handleImageError } from '../../utils/imageUtils'
import './admin.css'

export default function CoursesAdmin() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const data = await courseAPI.getAllCourses()
      setCourses(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch courses: ' + err.message)
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await courseAPI.deleteCourse(courseId)
        fetchCourses()
        alert('Course deleted successfully!')
      } catch (err) {
        alert('Failed to delete course: ' + err.message)
        console.error('Error deleting course:', err)
      }
    }
  }

  const handleUpdateCourse = (course) => {
    navigate('/admin/courses/update', { 
      state: { courseData: course } 
    })
  }

  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await courseAPI.updateCourse(courseId, { status: newStatus })
      fetchCourses()
      alert(`Course ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } catch (err) {
      alert('Failed to update course status: ' + err.message)
      console.error('Error updating course status:', err)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Courses Management</h1>
        <div className="loading">Loading courses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Courses Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchCourses} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Courses Management</h1>
        <Link to="/admin/courses/add" className="add-product-btn">
          ➕ Add New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <h3>No courses found</h3>
          <p>Get started by adding your first course!</p>
          <Link to="/admin/courses/add" className="add-product-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
            Add First Course
          </Link>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Course Image</th>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Level</th>
              <th>Status</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>
                  <img 
                    src={getImageUrl(course.image)} 
                    alt={course.name} 
                    className="course-image"
                    onError={handleImageError}
                  />
                </td>
                <td className="product-title">
                  <div style={{ fontWeight: 'bold' }}>{course.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {course.category}
                  </div>
                </td>
                <td className="instructor-name">{course.instructor}</td>
                <td className="course-duration">{course.duration || 'N/A'}</td>
                <td className="course-price">
                  {course.price === 0 || course.price === '0' ? 'Free' : `LKR ${course.price}`}
                </td>
                <td className="course-level">{course.level || 'Beginner'}</td>
                <td className="status">
                  <span className={`status-badge ${course.status === 'active' ? 'active' : 'inactive'}`}>
                    {course.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{course.enrolledStudents || 0}</td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => navigate(`/admin/courses/view/${course._id}`)}
                    title="View Course Details"
                  >
                    👁️
                  </button>
                  <button 
                    className="action-btn update-btn"
                    onClick={() => handleUpdateCourse(course)}
                    title="Edit Course"
                  >
                    ✏️
                  </button>
                  <button 
                    className={`action-btn ${course.status === 'active' ? 'cancel-btn' : 'add-product-btn'}`}
                    onClick={() => handleToggleCourseStatus(course._id, course.status)}
                    title={course.status === 'active' ? 'Deactivate Course' : 'Activate Course'}
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  >
                    {course.status === 'active' ? '⏸️' : '▶️'}
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteCourse(course._id)}
                    title="Delete Course"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Floating Add Button */}
      <Link to="/admin/courses/add" className="fab" title="Add New Course">
        +
      </Link>
    </div>
  )
}