import React, { useState } from "react";
import styles from "./AddContent.module.css";
import { X } from "lucide-react";

const AddContent = () => {
  const [page, setPage] = useState(1);
  const [videoUploads, setVideoUploads] = useState([]);
  const [resourceUploads, setResourceUploads] = useState([]);
  const [assignmentUploads, setAssignmentUploads] = useState([]);

  const handleUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    if (type === "video") setVideoUploads([...videoUploads, url]);
    if (type === "resource") setResourceUploads([...resourceUploads, url]);
    if (type === "assignment") setAssignmentUploads([...assignmentUploads, url]);
  };

  const handleDelete = (index, type) => {
    if (type === "video") setVideoUploads(videoUploads.filter((_, i) => i !== index));
    if (type === "resource") setResourceUploads(resourceUploads.filter((_, i) => i !== index));
    if (type === "assignment") setAssignmentUploads(assignmentUploads.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrapper}>
      <h3>Add Content</h3>
      <p>Sub Topics</p>

      {/* Pagination numbers */}
      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>◀</button>
        {Array.from({ length: 7 }).map((_, i) => (
          <button
            key={i}
            className={page === i + 1 ? styles.active : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setPage((p) => p + 1)}>▶</button>
      </div>

      <hr />

      {/* Video Section */}
      <div className={styles.section}>
        <div className={styles.left}>
          <h4>{page}. Title & Subtitle</h4>
          <input type="text" placeholder="Title" />
          <input type="text" placeholder="Subtitle" />
          <textarea placeholder="Description"></textarea>
          <div className={styles.uploadBox}>
            <p>Upload Video</p>
            <input type="file" onChange={(e) => handleUpload(e, "video")} />
          </div>
        </div>

        <div className={styles.right}>
          <h4>Uploaded Videos</h4>
          <div className={styles.preview}>
            {videoUploads.map((src, i) => (
              <div key={i} className={styles.fileBox}>
                <img src={src} alt="upload" />
                <button onClick={() => handleDelete(i, "video")}><X size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr />

      {/* Resource Section */}
      <div className={styles.section}>
        <div className={styles.left}>
          <h4>Upload Resources</h4>
          <div className={styles.uploadBox}>
            <input type="file" onChange={(e) => handleUpload(e, "resource")} />
          </div>
        </div>
        <div className={styles.right}>
          <h4>Uploaded Resources</h4>
          <div className={styles.preview}>
            {resourceUploads.map((src, i) => (
              <div key={i} className={styles.fileBox}>
                <img src={src} alt="resource" />
                <button onClick={() => handleDelete(i, "resource")}><X size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr />

      {/* Assignment Section */}
      <div className={styles.section}>
        <div className={styles.left}>
          <h4>Add Assignment</h4>
          <input type="text" placeholder="Title" />
          <input type="text" placeholder="Description" />
          <div className={styles.uploadBox}>
            <input type="file" onChange={(e) => handleUpload(e, "assignment")} />
          </div>
        </div>
        <div className={styles.right}>
          <h4>Uploaded Assignments</h4>
          <div className={styles.preview}>
            {assignmentUploads.map((src, i) => (
              <div key={i} className={styles.fileBox}>
                <img src={src} alt="assignment" />
                <button onClick={() => handleDelete(i, "assignment")}><X size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContent;
