import axios from 'axios'

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token (FIXED - skips auth for public endpoints)
apiClient.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/students/login',
      '/students/register',
      '/instructors/login'
    ];
    
    // Check if this is a registration/login request
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.includes(endpoint)
    );
    
    // Special case: POST to /students or /instructors (registration) should also be public
    const isRegistration = (config.url.includes('/students') && 
                          config.method === 'post' && 
                          !config.url.includes('/students/')) ||
                          (config.url.includes('/instructors') && 
                          config.method === 'post' && 
                          !config.url.includes('/instructors/'));
    
    // Add authorization token only if not a public endpoint
    if (!isPublicEndpoint && !isRegistration) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// Response interceptor (unchanged)
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
  // Public endpoints (no auth required)
  loginInstructor: (credentials) => apiClient.post('/instructors/login', credentials),
  createInstructor: (instructorData) => {
    const config = instructorData instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    return apiClient.post('/instructors', instructorData, config)
  },
  
  // Protected endpoints (require auth)
  getAllInstructors: () => apiClient.get('/instructors'),
  getInstructor: (instructorId) => apiClient.get(`/instructors/${instructorId}`),
  updateInstructor: (instructorId, instructorData) => apiClient.put(`/instructors/${instructorId}`, instructorData),
  deleteInstructor: (instructorId) => apiClient.delete(`/instructors/${instructorId}`),
  getProfile: () => apiClient.get('/instructors/profile'),
  updateProfile: (instructorData) => apiClient.put('/instructors/profile', instructorData),
}

// Student API (FIXED - registration is now public)
export const studentAPI = {
  // Public endpoints (no auth required)
  login: (credentials) => apiClient.post('/students/login', credentials),
  createStudent: (studentData) => apiClient.post('/students', studentData), // Now public
  
  // Alternative registration endpoint (if your backend uses this)
  register: (studentData) => apiClient.post('/students/register', studentData),
  
  // Protected endpoints (require auth)
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

// User API
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

// Product API
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
// Profile API
export const profileAPI = {
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (profileData) => apiClient.put('/profile', profileData),
  uploadProfileImage: (imageFile, onUploadProgress = null) => {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    
    if (onUploadProgress) {
      config.onUploadProgress = onUploadProgress;
    }
    
    return apiClient.post('/profile/image', formData, config);
  },
  getProfileImage: (filename) => apiClient.get(`/profile/image/${filename}`),
  deleteProfile: () => apiClient.delete('/profile'),
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