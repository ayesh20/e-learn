import React, { useState, useEffect } from "react";
import styles from "./AddContent.module.css";
import { X, Plus, Save, Trash } from "lucide-react";

const AddContent = ({ content = [], onChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPages, setContentPages] = useState([1]);
  
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

  // Initialize pages from prop
  useEffect(() => {
    if (content && content.length > 0) {
      const pages = content.map((_, index) => index + 1);
      setContentPages(pages);
      setCurrentPage(1);
    }
  }, []);

  // Update current page content when currentPage or content changes
  useEffect(() => {
    if (content[currentPage - 1]) {
      setPageContent(content[currentPage - 1]);
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
  }, [currentPage, content]);

  const handleInputChange = (field, value) => {
    setPageContent(prev => ({ ...prev, [field]: value }));
  };

  const addPage = () => {
    const newPageNum = Math.max(...contentPages, 0) + 1;
    setContentPages(prev => [...prev, newPageNum]);
    
    // Add empty page to content array
    const newContent = [...content, {
      title: '',
      subtitle: '',
      description: '',
      duration: 0,
      videos: [],
      resources: [],
      assignments: []
    }];
    onChange(newContent);
    setCurrentPage(newPageNum);
  };
  
  const deletePage = (pageNumber) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete Page ${pageNumber}?`);
    if (isConfirmed) {
      const newContent = content.filter((_, index) => index + 1 !== pageNumber);
      const newPages = contentPages.filter(p => p !== pageNumber).map((p, index) => index + 1);
      
      setContentPages(newPages.length > 0 ? newPages : [1]);
      onChange(newContent);
      setCurrentPage(newPages.length > 0 ? newPages[0] : 1);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const fileData = {
        name: file.name,
        url: URL.createObjectURL(file),
        title: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
      };
      
      setPageContent(prev => ({
        ...prev,
        [type]: [...prev[type], fileData]
      }));
      
      e.target.value = null;
    }
  };
  
  const removeFile = (type, fileUrl) => {
    setPageContent(prev => ({
      ...prev,
      [type]: prev[type].filter(file => file.url !== fileUrl)
    }));
  };

  // Save current page to parent state
  const saveCurrentPage = () => {
    const newContent = [...content];
    newContent[currentPage - 1] = {
      ...pageContent,
      pageNumber: currentPage
    };
    onChange(newContent);
    alert('Page saved! Click "Save Course" button to persist to database.');
  };

  const renderFileList = (files, type) => (
    <ul className={styles.fileList}>
      {files.map((file, index) => (
        <li key={index}>
          <span>{file.name}</span>
          <button 
            className={styles.removeFileBtn} 
            onClick={() => removeFile(type, file.url)}
            type="button"
          >
            <X size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
  
  return (
    <div className={styles.addContent}>
      <div className={styles.sectionHeader}>
        <h2>Add Course Content</h2>
        <p className={styles.info}>
          Total Pages: {content.length} | Current: Page {currentPage}
        </p>
      </div>

      {/* Page Navigation */}
      <div className={styles.pageNav}>
        <div className={styles.pageButtons}>
          {contentPages.map(page => (
            <div key={page} className={styles.pageButtonContainer}>
              <button
                type="button"
                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                Page {page}
              </button>
              {contentPages.length > 1 && (
                <button
                  type="button"
                  className={styles.deletePageBtn}
                  onClick={() => deletePage(page)}
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addPageBtn} onClick={addPage}>
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <h3 className={styles.pageTitle}>Edit Page {currentPage}</h3>
      
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
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
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
          {renderFileList(pageContent.resources, 'resources')}
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
          type="button"
          className={styles.savePageBtn} 
          onClick={saveCurrentPage}
        >
          <Save size={16} /> Save Current Page
        </button>
      </div>
    </div>
  );
};

export default AddContent;