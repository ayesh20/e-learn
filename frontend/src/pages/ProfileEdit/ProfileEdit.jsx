import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUser, FaSpinner } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { profileAPI } from '../../services/api.js'; 
import styles from "./ProfileEdit.module.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipcode: "",
    country: "",
    bio: ""
  });
  
  const [profileImage, setProfileImage] = useState({
    url: null,
    file: null,
    hasImage: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('ProfileEdit: Fetching profile data...');
        
        const response = await profileAPI.getProfile();
        console.log('ProfileEdit: Full API response:', response);
        
        if (response && response.success) {
          const data = response.data;
          console.log('ProfileEdit: Profile data:', data);
          
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            gender: data.gender || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
            province: data.province || "",
            zipcode: data.zipcode || "",
            country: data.country || "",
            bio: data.bio || ""
          });
          
          // Debug image data
          console.log('ProfileEdit: Image debug info:');
          console.log('- profileImage:', data.profileImage);
          console.log('- imageUrl:', data.imageUrl);
          console.log('- hasImage:', data.hasImage);
          
          // Try multiple image URL formats
          let imageUrl = null;
          if (data.imageUrl) {
            imageUrl = data.imageUrl;
          } else if (data.profileImage) {
            // Construct URL manually if imageUrl is missing
            imageUrl = `http://localhost:5000/uploads/profiles/${data.profileImage}`;
            console.log('ProfileEdit: Constructed image URL:', imageUrl);
          }
          
          setProfileImage({
            url: imageUrl,
            file: null,
            hasImage: !!(data.hasImage || data.profileImage || imageUrl)
          });
          
          console.log('ProfileEdit: Set profile image state:', {
            url: imageUrl,
            hasImage: !!(data.hasImage || data.profileImage || imageUrl)
          });
        } else {
          console.error('ProfileEdit: Invalid API response:', response);
        }
      } catch (error) {
        console.error('ProfileEdit: Error fetching profile:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load profile data. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('ProfileEdit: New image selected:', file.name, file.size, file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({
          type: 'error',
          text: 'Please select a valid image file.'
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'Image size should be less than 5MB.'
        });
        return;
      }

      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('ProfileEdit: Image preview loaded');
        setProfileImage({
          url: event.target.result,
          file: file,
          hasImage: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage.file) return;

    try {
      setUploading(true);
      console.log('ProfileEdit: Uploading image...');
      
      const response = await profileAPI.uploadProfileImage(
        profileImage.file,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`ProfileEdit: Upload Progress: ${percentCompleted}%`);
        }
      );

      console.log('ProfileEdit: Upload response:', response);

      if (response && response.success) {
        setMessage({
          type: 'success',
          text: 'Profile image updated successfully!'
        });
        
        // Update the image URL with the new one from server
        const newImageUrl = response.imageUrl || `http://localhost:5000/uploads/profiles/${response.filename}`;
        console.log('ProfileEdit: New image URL:', newImageUrl);
        
        setProfileImage(prev => ({
          ...prev,
          url: newImageUrl,
          file: null
        }));
      }
    } catch (error) {
      console.error('ProfileEdit: Error uploading image:', error);
      setMessage({
        type: 'error',
        text: 'Failed to upload image. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Upload image first if there's a new one
      if (profileImage.file) {
        await handleImageUpload();
      }

      // Update profile data
      const response = await profileAPI.updateProfile(formData);
      console.log('ProfileEdit: Update response:', response);
      
      if (response && response.success) {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
        
        // Optionally redirect after successful update
        setTimeout(() => {
          navigate('/Home');
        }, 2000);
      }
    } catch (error) {
      console.error('ProfileEdit: Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Debug function to test image URL
  const testImageUrl = (url) => {
    console.log('ProfileEdit: Testing image URL:', url);
    const img = new Image();
    img.onload = () => console.log('ProfileEdit: Image loaded successfully');
    img.onerror = () => console.log('ProfileEdit: Image failed to load');
    img.src = url;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <h2 className={styles.pageTitle}>Edit Profile</h2>


        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.profileHeader}>
          <div className={styles.profilePic}>
            {profileImage.hasImage && profileImage.url ? (
              <img
                src={profileImage.url}
                alt="Profile"
                className={styles.profileImage}
                onLoad={() => console.log('ProfileEdit: Profile image loaded successfully')}
                onError={(e) => {
                  console.log('ProfileEdit: Profile image failed to load:', e.target.src);
                  // Try alternative URLs
                  if (!e.target.src.includes('http://localhost:5000')) {
                    console.log('ProfileEdit: Trying alternative URL...');
                    const filename = profileImage.url.split('/').pop();
                    e.target.src = `http://localhost:5000/uploads/profiles/${filename}`;
                  }
                }}
              />
            ) : (
              <div className={styles.profilePlaceholder}>
                <FaUser size={60} />
              </div>
            )}
            
            <button 
              type="button" 
              className={styles.editIcon}
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? <FaSpinner className={styles.spinner} /> : <FaCamera />}
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className={styles.bioSection}>
            <label className={styles.label}>Bio</label>
            <textarea
              className={styles.textarea}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name *</label>
              <input
                className={styles.input}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name *</label>
              <input
                className={styles.input}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email *</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled // Email shouldn't be editable
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Gender</label>
              <select
                className={styles.select}
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Number</label>
            <input
              className={styles.input}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 77 123 4567"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Address</label>
            <input
              className={styles.input}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>City</label>
              <input
                className={styles.input}
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Province</label>
              <input
                className={styles.input}
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Zip Code</label>
              <input
                className={styles.input}
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <input
                className={styles.input}
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.cancelBtn}
              onClick={() => navigate('/Home')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Saving...
                </>
              ) : (
                'SAVE'
              )}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;