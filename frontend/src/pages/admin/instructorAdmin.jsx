import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { instructorAPI, courseAPI } from '../../services/api'
import { getImageUrl, handleImageError } from '../../utils/imageUtils'
import './admin.css'

export default function InstructorsAdmin() {
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const response = await instructorAPI.getAllInstructors()
      
      // Log the response to debug the structure
      console.log('API Response:', response)
      
      // Handle different response formats
      let data = response
      if (response && response.instructors) {
        data = response.instructors
      } else if (response && response.data) {
        data = response.data
      }
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('API did not return an array:', data)
        setInstructors([])
        setError('Invalid data format received from server')
        return
      }
      
      // Fetch course count for each instructor
      const instructorsWithCourses = await Promise.all(
        data.map(async (instructor) => {
          try {
            // Check if courseAPI.getCoursesByInstructor exists
            if (courseAPI.getCoursesByInstructor) {
              const courses = await courseAPI.getCoursesByInstructor(instructor._id)
              return {
                ...instructor,
                coursesCount: courses?.length || 0,
                courses: courses || []
              }
            } else {
              // Fallback if the method doesn't exist
              return {
                ...instructor,
                coursesCount: instructor.coursesCount || 0,
                courses: []
              }
            }
          } catch (err) {
            console.error(`Error fetching courses for instructor ${instructor._id}:`, err)
            return {
              ...instructor,
              coursesCount: instructor.coursesCount || 0,
              courses: []
            }
          }
        })
      )
      
      setInstructors(instructorsWithCourses)
      setError(null)
    } catch (err) {
      setError('Failed to fetch instructors: ' + err.message)
      console.error('Error fetching instructors:', err)
      setInstructors([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteInstructor = async (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor? This action cannot be undone.')) {
      try {
        await instructorAPI.deleteInstructor(instructorId)
        fetchInstructors()
        alert('Instructor deleted successfully!')
      } catch (err) {
        alert('Failed to delete instructor: ' + err.message)
        console.error('Error deleting instructor:', err)
      }
    }
  }




  const filteredInstructors = instructors.filter(instructor =>
    instructor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.expertise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.phone?.includes(searchTerm) ||
    instructor.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Instructors Management</h1>
        <div className="loading">Loading instructors...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Instructors Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchInstructors} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Instructors Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '250px', margin: 0 }}
          />
          <Link to="/admin/instructors/add" className="add-product-btn">
            ➕ Add New Instructor
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Instructors</h3>
          <div className="stat-number">{instructors.length}</div>
          <div className="stat-label">Registered instructors</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Instructors</h3>
          <div className="stat-number">{instructors.filter(i => i.status !== 'inactive').length}</div>
          <div className="stat-label">Currently active</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Courses</h3>
          <div className="stat-number">{instructors.reduce((sum, i) => sum + (i.coursesCount || 0), 0)}</div>
          <div className="stat-label">Courses taught</div>
        </div>
        
        <div className="stat-card">
          <h3>Avg Courses</h3>
          <div className="stat-number">
            {instructors.length > 0 ? (instructors.reduce((sum, i) => sum + (i.coursesCount || 0), 0) / instructors.length).toFixed(1) : 0}
          </div>
          <div className="stat-label">Per instructor</div>
        </div>
      </div>

      {filteredInstructors.length === 0 ? (
        <div className="no-instructors">
          <h3>No instructors found</h3>
          <p>{searchTerm ? 'No instructors match your search criteria.' : 'Get started by adding your first instructor!'}</p>
          {!searchTerm && (
            <Link to="/admin/instructors/add" className="add-product-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
              Add First Instructor
            </Link>
          )}
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              
              <th>Experience</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>
                  <img 
                    src="/images/user.png"
                    alt={instructor.name || 'Instructor'} 
                    className="product-image"
                    
                  />
                </td>
                <td className="instructor-name">
                  <div style={{ fontWeight: 'bold' }}>{instructor.firstName || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {instructor.title || 'Instructor'}
                  </div>
                </td>
                <td className="email">{instructor.email || 'N/A'}</td>
                <td className="phone">{instructor.phone || 'N/A'}</td>
                
                <td>{instructor.experience || 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    background: (instructor.coursesCount || 0) > 0 ? '#4ECDC4' : '#ddd', 
                    color: (instructor.coursesCount || 0) > 0 ? 'white' : '#666',
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {instructor.coursesCount || 0}
                  </span>
                </td>
                <td className="status">
                  <span className={`status-badge ${instructor.status === 'inactive' ? 'inactive' : 'active'}`}>
                    {instructor.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td className="actions">
                 
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteInstructor(instructor._id)}
                    title="Delete Instructor"
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