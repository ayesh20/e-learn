import React, { useState, useEffect } from "react";
import { courseAPI } from "../../services/api";
import styles from "./AddContent.module.css";
import { X, Edit, Plus, Save, Trash } from "lucide-react";

const AddContent = ({ courseId, onContentSaved }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPages, setContentPages] = useState([1]);
  const [contentData, setContentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Current page content
  const [pageContent, setPageContent] = useState({
    title: '',
    subtitle: '',
    description: '',
    duration: 0,
    videos: [],
    resources: [],
    assignments: []
  });

  // Load existing content from the database on initial component load
  useEffect(() => {
    const fetchContent = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const response = await courseAPI.getCourseContent(courseId);
        if (response && response.content) {
          const fetchedData = {};
          const pages = [];
          response.content.forEach((page, index) => {
            const pageNum = index + 1;
            fetchedData[pageNum] = page;
            pages.push(pageNum);
          });
          setContentData(fetchedData);
          setContentPages(pages.length > 0 ? pages : [1]);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Failed to fetch course content:', err);
        setError('Failed to load existing course content.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId]);

  // Update current page content from state when currentPage changes
  useEffect(() => {
    if (contentData[currentPage]) {
      setPageContent(contentData[currentPage]);
    } else {
      setPageContent({
        title: '',
        subtitle: '',
        description: '',
        duration: 0,
        videos: [],
        resources: [],
        assignments: []
      });
    }
  }, [currentPage, contentData]);

  const handleInputChange = (field, value) => {
    setPageContent(prev => ({ ...prev, [field]: value }));
  };

  const addPage = () => {
    const newPage = Math.max(...contentPages) + 1;
    setContentPages(prev => [...prev, newPage]);
    setCurrentPage(newPage);
  };
  
  const deletePage = (pageNumber) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete Page ${pageNumber}? This action cannot be undone.`);
    if (isConfirmed) {
      const newContentPages = contentPages.filter(p => p !== pageNumber);
      const newContentData = { ...contentData };
      delete newContentData[pageNumber];
      
      setContentPages(newContentPages.length > 0 ? newContentPages : [1]);
      setContentData(newContentData);
      
      // Navigate to the first available page or page 1
      setCurrentPage(newContentPages.length > 0 ? newContentPages[0] : 1);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setPageContent(prev => {
        const fileData = {
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
        };
        return {
          ...prev,
          [type]: [...prev[type], fileData]
        };
      });
      // Clear file input
      e.target.value = null;
    }
  };
  
  const removeFile = (type, fileUrl) => {
    setPageContent(prev => ({
      ...prev,
      [type]: prev[type].filter(file => file.url !== fileUrl)
    }));
  };

  // Function to save the current page to the local state
  const saveCurrentPage = () => {
    setContentData(prev => ({
      ...prev,
      [currentPage]: pageContent
    }));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  // New function to save ALL content to the database
  const handleSaveContent = async () => {
    if (!courseId) {
      setError('No course ID found. Cannot save content.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // First, save the current page to local state to ensure it's included
      const updatedContentData = { ...contentData, [currentPage]: pageContent };
      setContentData(updatedContentData);
      
      // Format data as a clean array for the API
      const contentArray = Object.values(updatedContentData);
      
      const payload = {
        content: contentArray,
        type: 'content' // Used by the backend to handle the request
      };

      const response = await courseAPI.updateCourseContent(courseId, payload);
      
      if (response && response.course) {
        setSuccess(true);
        console.log('Course content saved successfully:', response.course.content);
        if (onContentSaved) {
          onContentSaved(response.course.content);
        }
      }
    } catch (err) {
      console.error('Error saving course content:', err);
      setError(err.message || 'Failed to save course content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFileList = (files, type) => (
    <ul className={styles.fileList}>
      {files.map((file, index) => (
        <li key={index}>
          <span>{file.name}</span>
          <button className={styles.removeFileBtn} onClick={() => removeFile(type, file.url)}>
            <X size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
  
  return (
    <div className={styles.addContent}>
      {/* Loading & Status Messages */}
      {loading && <div className={styles.statusMessage}>Saving...</div>}
      {success && <div className={`${styles.statusMessage} ${styles.success}`}>Content Saved!</div>}
      {error && <div className={`${styles.statusMessage} ${styles.error}`}>{error}</div>}
      
      {/* Page Navigation */}
      <div className={styles.pageNav}>
        <div className={styles.pageButtons}>
          {contentPages.map(page => (
            <div key={page} className={styles.pageButtonContainer}>
              <button
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                Page {page}
              </button>
              {contentPages.length > 1 && (
                <button
                  className={styles.deletePageBtn}
                  onClick={() => deletePage(page)}
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          ))}
          <button className={styles.addPageBtn} onClick={addPage}>
            <Plus size={16} />
          </button>
        </div>
        <div className={styles.saveSection}>
            <button className={styles.saveAllBtn} onClick={handleSaveContent} disabled={loading}>
                <Save size={16} /> Save All Content
            </button>
        </div>
      </div>
      
      <h2 className={styles.pageTitle}>Edit Page {currentPage}</h2>
      
      {/* Basic Content Section */}
      <div className={styles.section}>
        <div className={styles.sectionLeft}>
          <h4>Page Title & Subtitle</h4>
          <input 
            type="text" 
            placeholder="Page Title *" 
            value={pageContent.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Subtitle" 
            value={pageContent.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
          />
        </div>
        <div className={styles.sectionRight}>
          <h4>Description</h4>
          <textarea
            placeholder="Page Description"
            value={pageContent.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
          />
          <input
            type="number"
            placeholder="Duration (in minutes)"
            value={pageContent.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            min="0"
          />
        </div>
      </div>

      <hr />

      {/* Video Section */}
      <div className={styles.section}>
        <div className={styles.sectionLeft}>
          <h4>Upload Videos</h4>
          <div className={styles.uploadBox}>
            <p>Select video files</p>
            <input 
              type="file" 
              accept="video/*"
              onChange={(e) => handleFileUpload(e, 'videos')} 
            />
          </div>
        </div>
        <div className={styles.sectionRight}>
          <h4>Uploaded Videos ({pageContent.videos.length})</h4>
          {renderFileList(pageContent.videos, 'videos')}
        </div>
      </div>

      <hr />

      {/* Resource Section */}
      <div className={styles.section}>
        <div className={styles.sectionLeft}>
          <h4>Upload Resources</h4>
          <div className={styles.uploadBox}>
            <p>Select resource files (PDF, DOC, etc.)</p>
            <input 
              type="file" 
              onChange={(e) => handleFileUpload(e, 'resources')} 
            />
          </div>
        </div>
        <div className={styles.sectionRight}>
          <h4>Uploaded Resources ({pageContent.resources.length})</h4>
          {renderFileList(pageContent.resources, 'resources')}\
        </div>
      </div>

      <hr />

      {/* Assignment Section */}
      <div className={styles.section}>
        <div className={styles.sectionLeft}>
          <h4>Add Assignments</h4>
          <div className={styles.uploadBox}>
            <p>Select assignment files</p>
            <input 
              type="file" 
              onChange={(e) => handleFileUpload(e, 'assignments')} 
            />
          </div>
        </div>
        <div className={styles.sectionRight}>
          <h4>Uploaded Assignments ({pageContent.assignments.length})</h4>
          {renderFileList(pageContent.assignments, 'assignments')}
        </div>
      </div>

      <div className={styles.pageActions}>
        <button 
          className={styles.savePageBtn} 
          onClick={saveCurrentPage}
        >
          Save Current Page
        </button>
      </div>
    </div>
  );
};

export default AddContent;