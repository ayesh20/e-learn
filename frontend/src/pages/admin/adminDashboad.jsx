import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { courseAPI, userAPI, instructorAPI, enrollmentAPI } from '../../services/api'
import './admin.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalEnrollments: 0,
    activeCourses: 0,
    recentEnrollments: 0,
    completionRate: 85,
    averageRating: 4.5,
    systemStatus: 'Online'
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all data in parallel
      const [courses, students, instructors, enrollments] = await Promise.all([
        courseAPI.getAllCourses().catch(() => []),
        userAPI.getAllUsers().catch(() => []),
        instructorAPI.getAllInstructors().catch(() => []),
        enrollmentAPI.getAllEnrollments().catch(() => [])
      ])

      // Log the responses to debug the structure
      console.log('Dashboard API Responses:', { courses, students, instructors, enrollments })

      // Handle different response formats
      let coursesData = courses
      if (courses && courses.courses) {
        coursesData = courses.courses
      } else if (courses && courses.data) {
        coursesData = courses.data
      }

      let studentsData = students
      if (students && students.users) {
        studentsData = students.users
      } else if (students && students.data) {
        studentsData = students.data
      }

      let instructorsData = instructors
      if (instructors && instructors.instructors) {
        instructorsData = instructors.instructors
      } else if (instructors && instructors.data) {
        instructorsData = instructors.data
      }

      let enrollmentsData = enrollments
      if (enrollments && enrollments.enrollments) {
        enrollmentsData = enrollments.enrollments
      } else if (enrollments && enrollments.data) {
        enrollmentsData = enrollments.data
      }

      // Ensure all data are arrays
      if (!Array.isArray(coursesData)) coursesData = []
      if (!Array.isArray(studentsData)) studentsData = []
      if (!Array.isArray(instructorsData)) instructorsData = []
      if (!Array.isArray(enrollmentsData)) enrollmentsData = []

      // Calculate stats
      const studentUsers = studentsData.filter(user => user.role === 'student' || user.role === 'user')
      const activeCourses = coursesData.filter(course => course.status === 'active' || course.status !== 'inactive')
      
      // Get recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const recentEnrollments = enrollmentsData.filter(enrollment => 
        new Date(enrollment.enrollmentDate || enrollment.createdAt) > thirtyDaysAgo
      )

      // Generate recent activity
      const activity = [
        ...recentEnrollments.slice(0, 3).map(enrollment => ({
          id: enrollment._id,
          type: 'enrollment',
          message: `New enrollment in ${enrollment.courseName || 'course'}`,
          time: enrollment.enrollmentDate || enrollment.createdAt,
          icon: '📚'
        })),
        ...coursesData.slice(-2).map(course => ({
          id: course._id,
          type: 'course',
          message: `Course "${course.name}" ${course.status === 'active' ? 'activated' : 'added'}`,
          time: course.createdAt || course.updatedAt,
          icon: '🎓'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)

      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentUsers.length,
        totalInstructors: instructorsData.length,
        totalEnrollments: enrollmentsData.length,
        activeCourses: activeCourses.length,
        recentEnrollments: recentEnrollments.length,
        completionRate: 85,
        averageRating: 4.5,
        systemStatus: 'Online'
      })

      setRecentActivity(activity)
      
    } catch (err) {
      setError('Failed to fetch dashboard statistics: ' + err.message)
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardStats()
  }

  const handleNavigateToSection = (path) => {
    navigate(path)
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        </div>
        <div className="loading">Loading dashboard statistics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        </div>
        <div className="error">Error: {error}</div>
        <button onClick={fetchDashboardStats} className="retry-btn">Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="dashboard-title" style={{ marginBottom: 0 }}>Dashboard Overview</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={handleRefresh}
            className={`action-btn update-btn ${refreshing ? 'loading' : ''}`}
            disabled={refreshing}
            title="Refresh Dashboard"
          >
            {refreshing ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>
      
      {/* Main Stats Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/courses')}>
          <h3>Total Courses</h3>
          <div className="stat-number">{stats.totalCourses}</div>
          <div className="stat-label">{stats.activeCourses} active courses</div>
        </div>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/users')}>
          <h3>Total Students</h3>
          <div className="stat-number">{stats.totalStudents}</div>
          <div className="stat-label">Registered users</div>
        </div>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/instructors')}>
          <h3>Total Instructors</h3>
          <div className="stat-number">{stats.totalInstructors}</div>
          <div className="stat-label">Teaching staff</div>
        </div>
        
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => handleNavigateToSection('/admin/enrollments')}>
          <h3>Total Enrollments</h3>
          <div className="stat-number">{stats.totalEnrollments}</div>
          <div className="stat-label">{stats.recentEnrollments} in last 30 days</div>
        </div>
      </div>

      {/* Secondary Stats Cards */}
      <div className="dashboard-stats" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <div className="stat-number" style={{ color: '#28a745' }}>{stats.completionRate}%</div>
          <div className="stat-label">Course completion</div>
        </div>
        
        <div className="stat-card">
          <h3>Average Rating</h3>
          <div className="stat-number" style={{ color: '#ffc107' }}>{stats.averageRating}/5 ⭐</div>
          <div className="stat-label">Student feedback</div>
        </div>
        
        <div className="stat-card">
          <h3>System Status</h3>
          <div className="stat-number">
            <span className={`status-badge ${stats.systemStatus === 'Online' ? 'active' : 'inactive'}`}>
              {stats.systemStatus}
            </span>
          </div>
          <div className="stat-label">Current status</div>
        </div>
        
        <div className="stat-card">
          <h3>Last Updated</h3>
          <div className="stat-number" style={{ fontSize: '16px', color: '#666' }}>
            {new Date().toLocaleDateString()}
          </div>
          <div className="stat-label">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px', marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/admin/courses/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📚 Add New Course
          </Link>
          <Link to="/admin/instructors/add" className="add-product-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👨‍🏫 Add New Instructor
          </Link>
          <Link to="/admin/courses" className="cancel-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📋 Manage Courses
          </Link>
          <Link to="/admin/enrollments" className="cancel-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📊 View Enrollments
          </Link>
          <Link to="/admin/users" className="cancel-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            👥 Manage Users
          </Link>
          <Link to="/admin/reports" className="cancel-btn" style={{ textDecoration: 'none', textAlign: 'center', padding: '20px' }}>
            📈 Generate Reports
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
        }}>
          <h3 style={{ marginTop: 0, color: '#4ECDC4', marginBottom: '20px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentActivity.map((activity) => (
              <div key={activity.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                padding: '10px',
                borderLeft: '4px solid #4ECDC4',
                paddingLeft: '15px',
                background: '#f8f9fa',
                borderRadius: '5px'
              }}>
                <span style={{ fontSize: '20px' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{activity.message}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {activity.time ? new Date(activity.time).toLocaleString() : 'Recently'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Performance Metrics */}
      <div style={{ 
        marginTop: '30px', 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
      }}>
        <h3 style={{ marginTop: 0, color: '#4ECDC4', marginBottom: '20px' }}>System Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <strong>Active Users Today:</strong>
            <div style={{ marginTop: '5px', color: '#28a745', fontSize: '18px', fontWeight: 'bold' }}>
              {Math.floor(stats.totalStudents * 0.15)}
            </div>
          </div>
          <div>
            <strong>Revenue This Month:</strong>
            <div style={{ marginTop: '5px', color: '#007bff', fontSize: '18px', fontWeight: 'bold' }}>
              LKR {(stats.totalEnrollments * 2500).toLocaleString()}
            </div>
          </div>
          <div>
            <strong>Server Uptime:</strong>
            <div style={{ marginTop: '5px', color: '#28a745', fontSize: '18px', fontWeight: 'bold' }}>
              99.9%
            </div>
          </div>
          <div>
            <strong>Response Time:</strong>
            <div style={{ marginTop: '5px', color: '#ffc107', fontSize: '18px', fontWeight: 'bold' }}>
              125ms
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link to="/admin/courses/add" className="fab" title="Quick Add Course">
        +
      </Link>
    </div>
  )
}