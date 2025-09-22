import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { courseAPI, enrollmentAPI } from '../../services/api'
import { getImageUrl, handleImageError } from '../../utils/imageUtils'
import './admin.css'

export default function CoursesAdmin() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseAPI.getAllCourses()
      
      // Log the response to debug the structure
      console.log('Courses API Response:', response)
      
      // Handle different response formats
      let data = response
      if (response && response.courses) {
        data = response.courses
      } else if (response && response.data) {
        data = response.data
      }
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Courses API did not return an array:', data)
        setCourses([])
        setError('Invalid data format received from server')
        return
      }
      
      // Fetch enrollment count for each course
      const coursesWithEnrollments = await Promise.all(
        data.map(async (course) => {
          try {
            if (enrollmentAPI.getEnrollmentsByCourse) {
              const enrollments = await enrollmentAPI.getEnrollmentsByCourse(course._id)
              return {
                ...course,
                enrolledStudents: enrollments?.length || 0,
                enrollments: enrollments || []
              }
            } else {
              return {
                ...course,
                enrolledStudents: course.enrolledStudents || 0,
                enrollments: []
              }
            }
          } catch (err) {
            console.error(`Error fetching enrollments for course ${course._id}:`, err)
            return {
              ...course,
              enrolledStudents: course.enrolledStudents || 0,
              enrollments: []
            }
          }
        })
      )
      
      setCourses(coursesWithEnrollments)
      setError(null)
    } catch (err) {
      setError('Failed to fetch courses: ' + err.message)
      console.error('Error fetching courses:', err)
      setCourses([])
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
    if (!course || !course._id) {
      console.error('Invalid course data for update')
      return
    }
    
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

  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '250px', margin: 0 }}
          />
          <Link to="/admin/courses/add" className="add-product-btn">
            ➕ Add New Course
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <div className="stat-number">{courses.length}</div>
          <div className="stat-label">Available courses</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Courses</h3>
          <div className="stat-number">{courses.filter(c => c.status !== 'inactive').length}</div>
          <div className="stat-label">Currently active</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <div className="stat-number">{courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)}</div>
          <div className="stat-label">Student enrollments</div>
        </div>
        
        <div className="stat-card">
          <h3>Free Courses</h3>
          <div className="stat-number">{courses.filter(c => c.price === 0 || c.price === '0').length}</div>
          <div className="stat-label">No cost courses</div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <h3>No courses found</h3>
          <p>{searchTerm ? 'No courses match your search criteria.' : 'Get started by adding your first course!'}</p>
          
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
            {filteredCourses.map((course) => (
              <tr key={course._id}>
                <td>
                  <img 
                    src={getImageUrl(course.image)} 
                    alt={course.name || 'Course'} 
                    className="course-image"
                    onError={handleImageError}
                  />
                </td>
                <td className="product-title">
                  <div style={{ fontWeight: 'bold' }}>{course.name || 'Unnamed Course'}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {course.category || 'No Category'}
                  </div>
                </td>
                <td className="instructor-name">{course.instructor || 'N/A'}</td>
                <td className="course-duration">{course.duration || 'N/A'}</td>
                <td className="course-price">
                  {course.price === 0 || course.price === '0' ? 'Free' : `LKR ${course.price}`}
                </td>
                <td className="course-level">{course.level || 'Beginner'}</td>
                <td className="status">
                  <span className={`status-badge ${course.status === 'inactive' ? 'inactive' : 'active'}`}>
                    {course.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    background: (course.enrolledStudents || 0) > 0 ? '#4ECDC4' : '#ddd', 
                    color: (course.enrolledStudents || 0) > 0 ? 'white' : '#666',
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {course.enrolledStudents || 0}
                  </span>
                </td>
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
                    className="action-btn update-btn"
                    onClick={() => navigate(`/admin/courses/enrollments/${course._id}`)}
                    title="View Enrollments"
                  >
                    👥
                  </button>
                  <button 
                    className={`action-btn ${course.status === 'inactive' ? 'add-product-btn' : 'cancel-btn'}`}
                    onClick={() => handleToggleCourseStatus(course._id, course.status)}
                    title={course.status === 'inactive' ? 'Activate Course' : 'Deactivate Course'}
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  >
                    {course.status === 'inactive' ? '▶️' : '⏸️'}
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

    </div>
  )
}