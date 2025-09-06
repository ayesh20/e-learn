// Backend base URL
const API_BASE_URL = 'http://localhost:5000';

/**
 * Helper function to get full image URL from backend
 * @param {string} imagePath - The image path from the database
 * @returns {string} - Full URL for the image
 */
export const getImageUrl = (imagePath) => {
	if (!imagePath) return '/default-product.jpg';
	
	// If it's already a full URL, return as is
	if (imagePath.startsWith('http')) return imagePath;
	
	// If it starts with /uploads, prepend backend URL
	if (imagePath.startsWith('/uploads')) {
		return `${API_BASE_URL}${imagePath}`;
	}
	
	// Otherwise, assume it's a relative path and prepend backend URL
	return `${API_BASE_URL}/uploads/products/${imagePath}`;
};

/**
 * Handle image load error by setting fallback image
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
	e.target.src = '/default-product.jpg';
};
