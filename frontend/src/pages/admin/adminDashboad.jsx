import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI, userAPI, instructorAPI, enrollmentAPI } from '../../services/api'
import './admin.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    activeCourses: 0,
    recentEnrollments: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [courses, students, instructors, enrollments] = await Promise.all([
        courseAPI.getAllCourses().catch(() => []),
        userAPI.getAllUsers().catch(() => []),
        instructorAPI.getAllInstructors().catch(() => []),
        enrollmentAPI.getAllEnrollments().catch(() => [])
      ])

      // Calculate stats
      const studentUsers = students.filter(user => user.role === 'student' || user.role === 'user')
      const activeCourses = courses.filter(course => course.status === 'active')
      
      // Get recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentEnrollments = enrollments.filter(enrollment => 
        new Date(enrollment.enrollmentDate) > thirtyDaysAgo
      )

      setStats({
        totalCourses: courses.length,
        totalStudents: studentUsers.length,
        totalInstructors: instructors.length,
        totalEnrollments: enrollments.length,
        activeCourses: activeCourses.length,
        recentEnrollments: recentEnrollments.length
      })
      
      setError(null)
    } catch (err) {
      setError('Failed to fetch dashboard statistics')
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="loading">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="error">Error: {error}</div>
        <button onClick={fetchDashboardStats} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <div className="stat-number">{stats.totalCourses}</div>
          <div className="stat-label">{stats.activeCourses} active courses</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-label">Registered users</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Instructors</h3>
          <div className="stat-number">{stats.totalInstructors}</div>
          <div className="stat-label">Teaching staff</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <div className="stat-number">{stats.totalEnrollments}</div>
          <div className="stat-label">{stats.recentEnrollments} in last 30 days</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/admin/courses/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📚 Add New Course
          </Link>
          <Link to="/admin/instructors/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👨‍🏫 Add New Instructor
          </Link>
          <Link to="/admin/courses" className="cancel-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📋 View All Courses
          </Link>
          <Link to="/admin/enrollments" className="cancel-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📊 View Enrollments
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div style={{ marginTop: '40px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#4ECDC4' }}>System Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div>
            <strong>Course Completion Rate:</strong>
            <div style={{ marginTop: '5px', color: '#28a745' }}>85%</div>
          </div>
          <div>
            <strong>Average Rating:</strong>
            <div style={{ marginTop: '5px', color: '#ffc107' }}>4.5/5 ⭐</div>
          </div>
          <div>
            <strong>System Status:</strong>
            <div style={{ marginTop: '5px' }}>
              <span className="status-badge active">Online</span>
            </div>
          </div>
          <div>
            <strong>Last Updated:</strong>
            <div style={{ marginTop: '5px', color: '#666', fontSize: '14px' }}>
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}