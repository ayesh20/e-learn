// API Services for E-Learning Platform
const API_BASE_URL = process.env.REACT_APP_API_URL

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add authorization token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(errorData || `HTTP error! status: ${response.status}`)
    }

    // Handle different response types
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    return await response.text()
  } catch (error) {
    console.error(`API request failed: ${url}`, error)
    throw error
  }
}

// Course API
export const courseAPI = {
  getAllCourses: () => apiRequest('/courses'),
  getCourse: (courseId) => apiRequest(`/courses/${courseId}`),
  createCourse: (courseData) => apiRequest('/courses', {
    method: 'POST',
    body: courseData, // FormData for file upload
    headers: {}, // Let browser set content-type for FormData
  }),
  updateCourse: (courseId, courseData) => apiRequest(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  }),
  deleteCourse: (courseId) => apiRequest(`/courses/${courseId}`, {
    method: 'DELETE',
  }),
}

// Instructor API
export const instructorAPI = {
  getAllInstructors: () => apiRequest('/instructors'),
  getInstructor: (instructorId) => apiRequest(`/instructors/${instructorId}`),
  createInstructor: (instructorData) => apiRequest('/instructors', {
    method: 'POST',
    body: instructorData, // FormData for file upload
    headers: {}, // Let browser set content-type for FormData
  }),
  updateInstructor: (instructorId, instructorData) => apiRequest(`/instructors/${instructorId}`, {
    method: 'PUT',
    body: JSON.stringify(instructorData),
  }),
  deleteInstructor: (instructorId) => apiRequest(`/instructors/${instructorId}`, {
    method: 'DELETE',
  }),
}


// Enrollment API
export const enrollmentAPI = {
  getAllEnrollments: () => apiRequest('/enrollments'),
  getEnrollment: (enrollmentId) => apiRequest(`/enrollments/${enrollmentId}`),
  getEnrollmentsByStudent: (studentId) => apiRequest(`/enrollments/student/${studentId}`),
  getEnrollmentsByCourse: (courseId) => apiRequest(`/enrollments/course/${courseId}`),
  createEnrollment: (enrollmentData) => apiRequest('/enrollments', {
    method: 'POST',
    body: JSON.stringify(enrollmentData),
  }),
  updateEnrollment: (enrollmentId, enrollmentData) => apiRequest(`/enrollments/${enrollmentId}`, {
    method: 'PUT',
    body: JSON.stringify(enrollmentData),
  }),
  deleteEnrollment: (enrollmentId) => apiRequest(`/enrollments/${enrollmentId}`, {
    method: 'DELETE',
  }),
}


// Analytics API (for dashboard statistics)
export const analyticsAPI = {
  getDashboardStats: () => apiRequest('/analytics/dashboard'),
  getCourseAnalytics: (courseId) => apiRequest(`/analytics/courses/${courseId}`),
  getInstructorAnalytics: (instructorId) => apiRequest(`/analytics/instructors/${instructorId}`),
  getUserAnalytics: () => apiRequest('/analytics/users'),
}

// Authentication API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  refreshToken: () => apiRequest('/auth/refresh', {
    method: 'POST',
  }),
  verifyToken: () => apiRequest('/auth/verify'),
}

// File Upload API
export const uploadAPI = {
  uploadImage: (imageFile) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return apiRequest('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    })
  },
  uploadFile: (file, type = 'document') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return apiRequest('/upload/file', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    })
  },
}

// Export all APIs as default object
const api = {
  course: courseAPI,
  instructor: instructorAPI,
  user: userAPI,
  enrollment: enrollmentAPI,
  product: productAPI,
  analytics: analyticsAPI,
  auth: authAPI,
  upload: uploadAPI,
}

export default api