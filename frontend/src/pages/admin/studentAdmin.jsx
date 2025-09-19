import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, enrollmentAPI } from '../../services/api'
import './admin.css'

export default function StudentsAdmin() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      // Fetch all users and filter for students
      const users = await userAPI.getAllUsers()
      const studentUsers = users.filter(user => user.role === 'student' || user.role === 'user')
      
      // Fetch enrollments for each student
      const studentsWithEnrollments = await Promise.all(
        studentUsers.map(async (student) => {
          try {
            const enrollments = await enrollmentAPI.getEnrollmentsByStudent(student._id)
            return {
              ...student,
              enrollmentsCount: enrollments.length,
              enrollments: enrollments
            }
          } catch (err) {
            return {
              ...student,
              enrollmentsCount: 0,
              enrollments: []
            }
          }
        })
      )
      
      setStudents(studentsWithEnrollments)
      setError(null)
    } catch (err) {
      setError('Failed to fetch students: ' + err.message)
      console.error('Error fetching students:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This will also remove all their enrollments.')) {
      try {
        await userAPI.deleteUser(studentId)
        fetchStudents()
        alert('Student deleted successfully!')
      } catch (err) {
        alert('Failed to delete student: ' + err.message)
        console.error('Error deleting student:', err)
      }
    }
  }

  const handleToggleStudentStatus = async (studentId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await userAPI.updateUser(studentId, { status: newStatus })
      fetchStudents()
      alert(`Student ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } catch (err) {
      alert('Failed to update student status: ' + err.message)
      console.error('Error updating student status:', err)
    }
  }

  const filteredStudents = students.filter(student =>
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Students Management</h1>
        <div className="loading">Loading students...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Students Management</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchStudents} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Students Management</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '250px', margin: 0 }}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-number">{students.length}</div>
          <div className="stat-label">Registered learners</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Students</h3>
          <div className="stat-number">{students.filter(s => s.status !== 'inactive').length}</div>
          <div className="stat-label">Currently active</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <div className="stat-number">{students.reduce((sum, s) => sum + s.enrollmentsCount, 0)}</div>
          <div className="stat-label">Course enrollments</div>
        </div>
        
        <div className="stat-card">
          <h3>Avg Enrollments</h3>
          <div className="stat-number">
            {students.length > 0 ? (students.reduce((sum, s) => sum + s.enrollmentsCount, 0) / students.length).toFixed(1) : 0}
          </div>
          <div className="stat-label">Per student</div>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="no-students">
          <h3>No students found</h3>
          <p>{searchTerm ? 'No students match your search criteria.' : 'No students have registered yet.'}</p>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registration Date</th>
              <th>Enrollments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {student.studentId || student._id.slice(-6)}
                </td>
                <td className="username">
                  <div style={{ fontWeight: 'bold' }}>
                    {`${student.firstName || ''} ${student.lastName || ''}`.trim() || 'N/A'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    Role: {student.role || 'student'}
                  </div>
                </td>
                <td className="email">{student.email}</td>
                <td className="phone">{student.phone || 'N/A'}</td>
                <td>
                  {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    background: student.enrollmentsCount > 0 ? '#4ECDC4' : '#ddd', 
                    color: student.enrollmentsCount > 0 ? 'white' : '#666',
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {student.enrollmentsCount}
                  </span>
                </td>
                <td className="status">
                  <span className={`status-badge ${student.status === 'inactive' ? 'inactive' : 'active'}`}>
                    {student.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => navigate(`/admin/students/view/${student._id}`)}
                    title="View Student Profile"
                  >
                    👁️
                  </button>
                  <button 
                    className="action-btn update-btn"
                    onClick={() => navigate(`/admin/students/enrollments/${student._id}`)}
                    title="View Enrollments"
                  >
                    📚
                  </button>
                  <button 
                    className={`action-btn ${student.status === 'inactive' ? 'add-product-btn' : 'cancel-btn'}`}
                    onClick={() => handleToggleStudentStatus(student._id, student.status)}
                    title={student.status === 'inactive' ? 'Activate Student' : 'Deactivate Student'}
                    style={{ fontSize: '12px', padding: '6px 8px' }}
                  >
                    {student.status === 'inactive' ? '▶️' : '⏸️'}
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteStudent(student._id)}
                    title="Delete Student"
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