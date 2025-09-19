// AddContent.js
import React, { useState } from "react";
import styles from "./AddContent.module.css";
import { X, Edit, Plus } from "lucide-react";

const AddContent = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);
  const [videoUploads, setVideoUploads] = useState([]);
  const [resourceUploads, setResourceUploads] = useState([]);
  const [assignmentUploads, setAssignmentUploads] = useState([]);

  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newItem = { url, name: file.name, title: file.name, description: "" }; // Added title & description

    if (type === "video") setVideoUploads([...videoUploads, newItem]);
    if (type === "resource") setResourceUploads([...resourceUploads, newItem]);
    if (type === "assignment") setAssignmentUploads([...assignmentUploads, newItem]);
  };

  const handleDelete = (index, type) => {
    if (type === "video") setVideoUploads(videoUploads.filter((_, i) => i !== index));
    if (type === "resource") setResourceUploads(resourceUploads.filter((_, i) => i !== index));
    if (type === "assignment") setAssignmentUploads(assignmentUploads.filter((_, i) => i !== index));
  };

  const handleEditName = (index, type) => {
    const newName = prompt("Enter new title:");
    if (!newName) return;

    if (type === "video") {
      const updated = [...videoUploads];
      updated[index].title = newName;
      setVideoUploads(updated);
    }
    if (type === "resource") {
      const updated = [...resourceUploads];
      updated[index].title = newName;
      setResourceUploads(updated);
    }
    if (type === "assignment") {
      const updated = [...assignmentUploads];
      updated[index].title = newName;
      setAssignmentUploads(updated);
    }
  };

  const handleEditDescription = (index, type) => {
    const newDesc = prompt("Enter new description:");
    if (!newDesc) return;

    if (type === "video") {
      const updated = [...videoUploads];
      updated[index].description = newDesc;
      setVideoUploads(updated);
    }
    if (type === "resource") {
      const updated = [...resourceUploads];
      updated[index].description = newDesc;
      setResourceUploads(updated);
    }
    if (type === "assignment") {
      const updated = [...assignmentUploads];
      updated[index].description = newDesc;
      setAssignmentUploads(updated);
    }
  };

  const addPage = () => {
    const next = pages.length + 1;
    setPages([...pages, next]);
    setPage(next);
  };

  const renderUploads = (uploads, type) => (
    <div className={styles.preview}>
      {uploads.map((item, i) => (
        <div key={i} className={styles.fileBox}>
          <div className={styles.uploadPreviewBox}>
            <img src={item.url} alt={`${type}-${i}`} />
            <div className={styles.overlay}>
              <button onClick={() => handleEditName(i, type)} className={styles.editBtn}><Edit size={16} /></button>
              <button onClick={() => handleDelete(i, type)} className={styles.deleteBtn}><X size={16} /></button>
            </div>
          </div>
          <p className={styles.uploadTitle}>{item.title}</p>
          {item.description && <p className={styles.uploadDesc}>{item.description}</p>}
          <button className={styles.editDescBtn} onClick={() => handleEditDescription(i, type)}>Edit Description</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <h3>Add Content</h3>
      <p>Sub Topics</p>

      {/* Pagination */}
      <div className={styles.pagination}>
        {pages.map((num) => (
          <button
            key={num}
            className={`${styles.pageBtn} ${page === num ? styles.active : ""}`}
            onClick={() => setPage(num)}
          >
            {num}
          </button>
        ))}
        <button className={styles.addPageBtn} onClick={addPage}><Plus size={16} /></button>
      </div>

      <hr />

      {/* Video Section */}
      <div className={styles.section}>
        <div className={styles.left}>
          <h4>{page}. Title & Subtitle</h4>
          <input type="text" placeholder="Title" className={styles.inputField} />
          <input type="text" placeholder="Subtitle" className={styles.inputField} />
          <textarea placeholder="Description" className={styles.textArea}></textarea>
          <div className={styles.uploadBox}>
            <p>Upload Video</p>
            <input type="file" onChange={(e) => handleUpload(e, "video")} />
          </div>
        </div>
        <div className={styles.right}>
          <h4>Uploaded Videos</h4>
          {renderUploads(videoUploads, "video")}
        </div>
      </div>

      <hr />

      {/* Resource Section */}
      <div className={styles.section}>
        <div className={styles.left}>
          <h4>Upload Resources</h4>
          <input type="text" placeholder="Title" className={styles.inputField} />
          <textarea placeholder="Description" className={styles.textArea}></textarea>
          <div className={styles.uploadBox}>
            <input type="file" onChange={(e) => handleUpload(e, "resource")} />
          </div>
        </div>
        <div className={styles.right}>
          <h4>Uploaded Resources</h4>
          {renderUploads(resourceUploads, "resource")}
        </div>
      </div>

      <hr />

      {/* Assignment Section */}
      <div className={styles.section}>
        <div className={styles.left}>
          <h4>Add Assignment</h4>
          <input type="text" placeholder="Title" className={styles.inputField} />
          <input type="text" placeholder="Description" className={styles.inputField} />
          <div className={styles.uploadBox}>
            <input type="file" onChange={(e) => handleUpload(e, "assignment")} />
          </div>
        </div>
        <div className={styles.right}>
          <h4>Uploaded Assignments</h4>
          {renderUploads(assignmentUploads, "assignment")}
        </div>
      </div>
    </div>
  );
};

export default AddContent;
