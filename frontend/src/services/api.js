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
      '/instructors/login',
      '/instructors/register',
      '/contact'
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

// Course API - Fixed to use apiClient consistently
export const courseAPI = {
  // Basic CRUD operations
  createCourse: async (courseData) => {
    try {
      console.log('Creating course with JSON data:', courseData);
      return await apiClient.post('/courses', courseData);
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Create course with file upload (FormData)
  createCourseWithFile: async (formData) => {
    try {
      console.log('Creating course with file upload');
      return await apiClient.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Error creating course with file:', error);
      throw error;
    }
  },

  // Update course with basic data (JSON)
  updateCourse: async (courseId, courseData) => {
    try {
      console.log('Updating course with JSON data:', courseId, courseData);
      return await apiClient.put(`/courses/${courseId}`, courseData);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Update course with file upload (FormData)
  updateCourseWithFile: async (courseId, formData) => {
    try {
      console.log('Updating course with file upload:', courseId);
      return await apiClient.put(`/courses/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Error updating course with file:', error);
      throw error;
    }
  },

  // Get all courses
  getAllCourses: async (params = {}) => {
    try {
      return await apiClient.get('/courses', { params });
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      return await apiClient.get(`/courses/${courseId}`);
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Get courses by instructor
  getCoursesByInstructor: async (instructorId) => {
    try {
      console.log('Fetching courses for instructor:', instructorId);
      return await apiClient.get(`/courses/instructor/${instructorId}`);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      return await apiClient.delete(`/courses/${courseId}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Update course status
  updateCourseStatus: async (courseId, status) => {
    try {
      return await apiClient.patch(`/courses/${courseId}/status`, { status });
    } catch (error) {
      console.error('Error updating course status:', error);
      throw error;
    }
  },

  // Update course content specifically
  updateCourseContent: async (courseId, content) => {
    try {
      console.log('Updating course content:', courseId);
      return await apiClient.put(`/courses/${courseId}/content`, { content });
    } catch (error) {
      console.error('Error updating course content:', error);
      throw error;
    }
  },

  // Update course quizzes specifically
  updateCourseQuizzes: async (courseId, quizzes) => {
    try {
      console.log('Updating course quizzes:', courseId);
      return await apiClient.put(`/courses/${courseId}/quizzes`, { quizzes });
    } catch (error) {
      console.error('Error updating course quizzes:', error);
      throw error;
    }
  },

  // Get course content
  getCourseContent: async (courseId) => {
    try {
      return await apiClient.get(`/courses/${courseId}/content`);
    } catch (error) {
      console.error('Error fetching course content:', error);
      throw error;
    }
  },

  // Get course quizzes
  getCourseQuizzes: async (courseId) => {
    try {
      return await apiClient.get(`/courses/${courseId}/quiz-data`);
    } catch (error) {
      console.error('Error fetching course quizzes:', error);
      throw error;
    }
  },

  // Legacy methods for backward compatibility
  addCourseContent: async (courseId, contentData) => {
    try {
      return await apiClient.post(`/courses/${courseId}/content`, contentData);
    } catch (error) {
      console.error('Error adding course content:', error);
      throw error;
    }
  },

  addCourseQuiz: async (courseId, quizData) => {
    try {
      return await apiClient.post(`/courses/${courseId}/quiz`, quizData);
    } catch (error) {
      console.error('Error adding course quiz:', error);
      throw error;
    }
  },

  // Get courses by category
  getCoursesByCategory: async (category) => {
    try {
      return await apiClient.get(`/courses/category/${category}`);
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }
  },
};

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
  getInstructor: (instructorId) => {
    if (!instructorId) throw new Error('Instructor ID is required');
    return apiClient.get(`/instructors/${instructorId}`);
  },
  updateInstructor: (instructorId, instructorData) => {
    if (!instructorId) throw new Error('Instructor ID is required');
    return apiClient.put(`/instructors/${instructorId}`, instructorData);
  },
  deleteInstructor: (instructorId) => {
    if (!instructorId) throw new Error('Instructor ID is required');
    return apiClient.delete(`/instructors/${instructorId}`);
  },
  
  // Profile endpoints - handles both scenarios
  getProfile: () => {
    // Option 1: If your backend has a dedicated /profile endpoint
    return apiClient.get('/instructors/me/profile');
    
  
  },
  
  updateProfile: (instructorData) => {
    // Option 1: If your backend has a dedicated /profile endpoint
    return apiClient.put('/instructors/me/profile', instructorData);
    
    
  },
  
  // Alternative methods if you have instructor ID available
  getProfileById: (instructorId) => {
    if (!instructorId) throw new Error('Instructor ID is required');
    return apiClient.get(`/instructors/${instructorId}`);
  },
  
  updateProfileById: (instructorId, instructorData) => {
    if (!instructorId) throw new Error('Instructor ID is required');
    return apiClient.put(`/instructors/${instructorId}`, instructorData);
  }
};

// Student API
export const studentAPI = {
  // Public endpoints (no auth required)
  login: (credentials) => apiClient.post('/students/login', credentials),
  createStudent: (studentData) => apiClient.post('/students', studentData),
  
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
  
  getEnrollmentsByStudent: (studentName) => apiClient.get(`/enrollments/student/${studentName}`),
  getEnrollmentsByCourse: (courseId) => apiClient.get(`/enrollments/course/${courseId}`),
  createEnrollment: (enrollmentData) => apiClient.post('/enrollments', enrollmentData),
  updateEnrollment: (enrollmentId, enrollmentData) => apiClient.put(`/enrollments/${enrollmentId}`, enrollmentData),
  deleteEnrollment: (enrollmentId) => apiClient.delete(`/enrollments/${enrollmentId}`),
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

// Contact API
export const contactAPI = {
  // Create a new contact message (public endpoint - no auth required)
  createContact: async (contactData) => {
    try {
      console.log('Submitting contact form:', contactData);
      return await apiClient.post('/contact', contactData);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Get all contact messages (admin only)
  getAllContacts: async () => {
    try {
      return await apiClient.get('/contact');
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get contact by email
  getContactByEmail: async (email) => {
    try {
      return await apiClient.get(`/contact/${email}`);
    } catch (error) {
      console.error('Error fetching contact by email:', error);
      throw error;
    }
  },

  // Delete contact message by ID (admin only)
  deleteContact: async (contactId) => {
    try {
      return await apiClient.delete(`/contact/${contactId}`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
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
  analytics: analyticsAPI,
  profile: profileAPI,
  upload: uploadAPI,
  contact: contactAPI,
}

export default api