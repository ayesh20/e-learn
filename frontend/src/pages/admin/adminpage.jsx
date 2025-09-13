import React from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import './admin.css'
import Dashboard from './adminDashboad.jsx'
import CoursesAdmin from './courseAdmin.jsx'
import AddCourse from './addCourse.jsx'
import UpdateCourse from './updateCourse.jsx'
import StudentsAdmin from './studentAdmin.jsx'
import InstructorsAdmin from './instructorAdmin.jsx'
import EnrollmentsAdmin from './enrollmentsAdmin.jsx'

export default function AdminLayout() {
  const location = useLocation();
  
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>E-Learn Admin</h2>
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink 
              to="/admin" 
              end
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/courses"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              📚 Courses
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/instructors"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              👨‍🏫 Instructors
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/students"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              👨‍🎓 Students
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/enrollments"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              📋 Enrollments
            </NavLink>
          </li>
          
          <li style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <NavLink 
              to="/"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              🏠 Back to Home
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <main className="admin-content">
      
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/courses" element={<CoursesAdmin/>}/>
          <Route path="/courses/add" element={<AddCourse/>}/>
          <Route path="/courses/update" element={<UpdateCourse/>}/>
          <Route path="/student" element={<StudentsAdmin/>}/>
          <Route path="/instructors" element={<InstructorsAdmin/>}/>
          <Route path="/enrollment" element={<EnrollmentsAdmin/>}/>
          {/* Add other routes as needed */}
        </Routes>
      </main>
    </div>
  )
}