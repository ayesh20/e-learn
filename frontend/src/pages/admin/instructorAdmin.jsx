import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { instructorAPI } from '../../services/api'
import { getImageUrl, handleImageError } from '../../utils/imageUtils'
import './admin.css'

export default function InstructorsAdmin() {
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const data = await instructorAPI.getAllInstructors()
      setInstructors(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch instructors: ' + err.message)
      console.error('Error fetching instructors:', err)
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

  const handleUpdateInstructor = (instructor) => {
    navigate('/admin/instructors/update', { 
      state: { instructorData: instructor } 
    })
  }

  const handleToggleInstructorStatus = async (instructorId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await instructorAPI.updateInstructor(instructorId, { status: newStatus })
      fetchInstructors()
      alert(`Instructor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } catch (err) {
      alert('Failed to update instructor status: ' + err.message)
      console.error('Error updating instructor status:', err)
    }
  }

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
        <Link to="/admin/instructors/add" className="add-product-btn">
          ➕ Add New Instructor
        </Link>
      </div>

      {instructors.length === 0 ? (
        <div className="no-instructors">
          <h3>No instructors found</h3>
          <p>Get started by adding your first instructor!</p>
          <Link to="/admin/instructors/add" className="add-product-btn" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
            Add First Instructor
          </Link>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Expertise</th>
              <th>Experience</th>
              <th>Courses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>
                  <img 
                    src={getImageUrl(instructor.photo)} 
                    alt={instructor.name} 
                    className="product-image"
                    onError={handleImageError}
                  />
                </td>
                <td className="instructor-name">
                  <div style={{ fontWeight: 'bold' }}>{instructor.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    {instructor.title || 'Instructor'}
                  </div>
                </td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
                <td>
                  <div style={{ fontSize: '14px' }}>{instructor.expertise}</div>
                </td>
                <td>{instructor.experience || 'N/A'}</td>
                <td>{instructor.coursesCount || 0}</td>
                <td className="status">
                  <span className={`status-badge ${instructor.status === 'active' ? 'active' : 'inactive'}`}>
                    {instructor.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => navigate(`/admin/instructors/view/${instructor._id}`)}
                    title="View Instructor Profile"
                  >
                    👁️
                  </button>
                  <button 
                    className="action-btn update-btn"
                    onClick={() => handleUpdateInstructor(instructor)}
                    title="Edit Instructor"
                  >
                    ✏️
                  </button>
                  <button 
                    className={`action-btn ${instructor.status === 'active' ? 'cancel-btn' : 'add-product-btn'}`}
                    onClick={() => handleToggleInstructorStatus(instructor._id, instructor.status)}
                    title={instructor.status === 'active' ? 'Deactivate Instructor' : 'Activate Instructor'}
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  >
                    {instructor.status === 'active' ? '⏸️' : '▶️'}
                  </button>
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

      {/* Floating Add Button */}
      <Link to="/admin/instructors/add" className="fab" title="Add New Instructor">
        +
      </Link>
    </div>
  )
}