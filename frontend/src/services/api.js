import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    
    if (error.response) {
      
      const errorMessage = error.response.data?.message || error.response.data || `HTTP error! status: ${error.response.status}`
      console.error(`API request failed:`, errorMessage)
      throw new Error(errorMessage)
    } else if (error.request) {
      
      console.error('Network error:', error.request)
      throw new Error('Network error - please check your connection')
    } else {
      console.error('Request error:', error.message)
      throw new Error(error.message)
    }
  }
)

// Course API
export const courseAPI = {
  getAllCourses: () => apiClient.get('/courses'),
  getCourse: (courseId) => apiClient.get(`/courses/${courseId}`),
  createCourse: (courseData) => {
    
    const config = courseData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    return apiClient.post('/courses', courseData, config)
  },
  updateCourse: (courseId, courseData) => apiClient.put(`/courses/${courseId}`, courseData),
  deleteCourse: (courseId) => apiClient.delete(`/courses/${courseId}`),
}

// Instructor API
export const instructorAPI = {
  getAllInstructors: () => apiClient.get('/instructors'),
  getInstructor: (instructorId) => apiClient.get(`/instructors/${instructorId}`),
  createInstructor: (instructorData) => {
    
    const config = instructorData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    return apiClient.post('/instructors', instructorData, config)
  },
  updateInstructor: (instructorId, instructorData) => apiClient.put(`/instructors/${instructorId}`, instructorData),
  deleteInstructor: (instructorId) => apiClient.delete(`/instructors/${instructorId}`),
}

// Student API
export const studentAPI = {
  
  login: (credentials) => apiClient.post('/students/login', credentials),
  
  
  createStudent: (studentData) => apiClient.post('/students', studentData),
  getAllStudents: (params = {}) => {
    const { page = 1, limit = 10, status, academicLevel, search } = params
    return apiClient.get('/students', { params: { page, limit, status, academicLevel, search } })
  },
  getStudentById: (studentId) => apiClient.get(`/students/${studentId}`),
  getStudentByStudentId: (studentId) => apiClient.get(`/students/student-id/${studentId}`),
  updateStudent: (studentId, studentData) => apiClient.put(`/students/${studentId}`, studentData),
  deleteStudent: (studentId) => apiClient.delete(`/students/${studentId}`),
  updateStudentStatus: (studentId, status) => apiClient.patch(`/students/${studentId}/status`, { status }),
  updatePassword: (studentId, passwordData) => apiClient.patch(`/students/${studentId}/password`, passwordData),
  searchStudents: (params = {}) => {
    const { query, status, academicLevel } = params
    return apiClient.get('/students/search', { params: { query, status, academicLevel } })
  },

  getProfile: () => apiClient.get('/students/profile'),
  updateProfile: (studentData) => apiClient.put('/students/profile', studentData),
}

// User API (referenced in the export but missing in original)
export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  getUser: (userId) => apiClient.get(`/users/${userId}`),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (userId, userData) => apiClient.put(`/users/${userId}`, userData),
  deleteUser: (userId) => apiClient.delete(`/users/${userId}`),
  getUserProfile: () => apiClient.get('/users/profile'),
  updateUserProfile: (userData) => apiClient.put('/users/profile', userData),
}

// Enrollment API
export const enrollmentAPI = {
  getAllEnrollments: () => apiClient.get('/enrollments'),
  getEnrollment: (enrollmentId) => apiClient.get(`/enrollments/${enrollmentId}`),
  getEnrollmentsByStudent: (studentId) => apiClient.get(`/enrollments/student/${studentId}`),
  getEnrollmentsByCourse: (courseId) => apiClient.get(`/enrollments/course/${courseId}`),
  createEnrollment: (enrollmentData) => apiClient.post('/enrollments', enrollmentData),
  updateEnrollment: (enrollmentId, enrollmentData) => apiClient.put(`/enrollments/${enrollmentId}`, enrollmentData),
  deleteEnrollment: (enrollmentId) => apiClient.delete(`/enrollments/${enrollmentId}`),
}

// Product API (referenced in the export but missing in original)
export const productAPI = {
  getAllProducts: () => apiClient.get('/products'),
  getProduct: (productId) => apiClient.get(`/products/${productId}`),
  createProduct: (productData) => apiClient.post('/products', productData),
  updateProduct: (productId, productData) => apiClient.put(`/products/${productId}`, productData),
  deleteProduct: (productId) => apiClient.delete(`/products/${productId}`),
}

// Analytics API (for dashboard statistics)
export const analyticsAPI = {
  getDashboardStats: () => apiClient.get('/analytics/dashboard'),
  getCourseAnalytics: (courseId) => apiClient.get(`/analytics/courses/${courseId}`),
  getInstructorAnalytics: (instructorId) => apiClient.get(`/analytics/instructors/${instructorId}`),
  getUserAnalytics: () => apiClient.get('/analytics/users'),
  getEnrollmentTrends: () => apiClient.get('/analytics/enrollment-trends'),
  getRevenueAnalytics: () => apiClient.get('/analytics/revenue'),
}



// File Upload API
export const uploadAPI = {
  uploadImage: (imageFile, onUploadProgress = null) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    
    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress
    }
    
    return apiClient.post('/upload/image', formData, config)
  },
  uploadFile: (file, type = 'document', onUploadProgress = null) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    
    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress
    }
    
    return apiClient.post('/upload/file', formData, config)
  },
  uploadMultipleFiles: (files, type = 'document', onUploadProgress = null) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    formData.append('type', type)
    
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    
    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress
    }
    
    return apiClient.post('/upload/multiple', formData, config)
  },
}

// Export the axios instance for custom requests
export { apiClient }

// Export all APIs as default object
const api = {
  course: courseAPI,
  instructor: instructorAPI,
  student: studentAPI,
  user: userAPI,
  enrollment: enrollmentAPI,
  product: productAPI,
  analytics: analyticsAPI,
  upload: uploadAPI,
}

export default api