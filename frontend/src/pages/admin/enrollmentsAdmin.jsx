import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './admin.css'

export default function EnrollmentsAdmin() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState({})
  const [students, setStudents] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [enrollmentsData, coursesData, usersData] = await Promise.all([
        enrollmentAPI.getAllEnrollments(),
        courseAPI.getAllCourses(),
        userAPI.getAllUsers()
      ])

      // Create lookup objects for courses and students
      const coursesMap = {}
      coursesData.forEach(course => {
        coursesMap[course._id] = course
      })

      const studentsMap = {}
      usersData.forEach(user => {
        studentsMap[user._id] = user
      })

      setEnrollments(enrollmentsData)
      setCourses(coursesMap)
      setStudents(studentsMap)
      setError(null)
    } catch (err) {
      setError('Failed to fetch enrollments: ' + err.message)
      console.error('Error fetching enrollments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEnrollmentStatus = async (enrollmentId, newStatus) => {
    try {
      await enrollmentAPI.updateEnrollment(enrollmentId, { status: newStatus })
      fetchEnrollments()
      alert(`Enrollment ${newStatus} successfully!`)
    } catch (err) {
      alert('Failed to update enrollment status: ' + err.message)
      console.error('Error updating enrollment status:', err)
    }
  }

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await enrollmentAPI.deleteEnrollment(enrollmentId)
        fetchEnrollments()
        alert('Enrollment deleted successfully!')
      } catch (err) {
        alert('Failed to delete enrollment: ' + err.message)
        console.error('Error deleting enrollment:', err)
      }
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'active'
      case 'in-progress': return 'pending'
      case 'pending': return 'pending'
      case 'cancelled': return 'inactive'
      default: return 'pending'
    }
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    const course = courses[enrollment.courseId] || {}
    const student = students[enrollment.studentId] || {}
    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim()
    
    const matchesSearch = 
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment._id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Enrollments Management</h1>
        <div className="loading">Loading enrollments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Enrollments Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchEnrollments} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Enrollments Management</h1>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <div className="stat-number">{enrollments.length}</div>
          <div className="stat-label">All time</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Enrollments</h3>
          <div className="stat-number">{enrollments.filter(e => e.status === 'in-progress').length}</div>
          <div className="stat-label">Currently learning</div>
        </div>
        
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-number">{enrollments.filter(e => e.status === 'completed').length}</div>
          <div className="stat-label">Successfully finished</div>
        </div>
        
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-number">{enrollments.filter(e => e.status === 'pending').length}</div>
          <div className="stat-label">Awaiting approval</div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px', 
        alignItems: 'center',
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search by course, student name, email, or enrollment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ margin: 0 }}
          />
        </div>
        <div style={{ minWidth: '150px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ margin: 0 }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredEnrollments.length === 0 ? (
        <div className="no-courses">
          <h3>No enrollments found</h3>
          <p>{searchTerm || statusFilter !== 'all' ? 'No enrollments match your search criteria.' : 'No enrollments have been made yet.'}</p>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Enrollment ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Enrolled Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.map((enrollment) => {
              const course = courses[enrollment.courseId] || {}
              const student = students[enrollment.studentId] || {}
              const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown Student'
              
              return (
                <tr key={enrollment._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '12px' }}>
                    {enrollment._id.slice(-8)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{studentName}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {student.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 'bold' }}>{course.name || 'Unknown Course'}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {course.category}
                    </div>
                  </td>
                  <td className="instructor-name">{course.instructor || 'N/A'}</td>
                  <td>
                    {enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="course-price">
                    {enrollment.amount ? `LKR ${enrollment.amount}` : 'Free'}
                  </td>
                  <td className="status">
                    <span className={`status-badge ${getStatusBadgeClass(enrollment.status)}`}>
                      {enrollment.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ width: '60px', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${enrollment.progress || 0}%`, 
                          height: '100%', 
                          background: '#4ECDC4',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                      {enrollment.progress || 0}%
                    </div>
                  </td>
                  <td className="actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => navigate(`/admin/enrollments/view/${enrollment._id}`)}
                      title="View Enrollment Details"
                    >
                      👁️
                    </button>
                    
                    {enrollment.status === 'pending' && (
                      <button 
                        className="action-btn add-product-btn"
                        onClick={() => handleUpdateEnrollmentStatus(enrollment._id, 'in-progress')}
                        title="Approve Enrollment"
                        style={{ fontSize: '12px', padding: '6px 8px' }}
                      >
                        ✅
                      </button>
                    )}
                    
                    {enrollment.status === 'in-progress' && (
                      <button 
                        className="action-btn update-btn"
                        onClick={() => handleUpdateEnrollmentStatus(enrollment._id, 'completed')}
                        title="Mark as Completed"
                        style={{ fontSize: '12px', padding: '6px 8px' }}
                      >
                        🏆
                      </button>
                    )}
                    
                    <button 
                      className="action-btn cancel-btn"
                      onClick={() => handleUpdateEnrollmentStatus(enrollment._id, 'cancelled')}
                      title="Cancel Enrollment"
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                    >
                      ❌
                    </button>
                    
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteEnrollment(enrollment._id)}
                      title="Delete Enrollment"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}