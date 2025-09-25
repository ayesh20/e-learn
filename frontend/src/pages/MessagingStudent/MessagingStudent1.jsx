import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import styles from "./MessagingStudent1.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronRight, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";

export default function MessagingStudent1() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    if (!loading && !currentUser) navigate("/login");
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (currentUser?.role === "student") {
      axios.get("http://localhost:5000/api/instructors")
        .then(res => setInstructors(res.data))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  const handleChat = (user) => {
    navigate("/messaginginstructor2", { state: { otherUser: user } });
  };

  const handleAdd = () => {
    navigate("/messaginginstructor1");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <FontAwesomeIcon icon={faPlus} className={styles.addIcon} onClick={handleAdd} style={{ cursor: "pointer" }} />
        </div>
        <div className={styles.list}>
          {instructors.map((instructor) => (
            <div key={instructor._id} className={styles.listItem} onClick={() => handleChat(instructor)} style={{ cursor: "pointer" }}>
              <div className={styles.left}>
                <img src={instructor.profileImage || "https://i.pravatar.cc/100"} alt={instructor.firstName} className={styles.avatar} />
                <div className={styles.info}>
                  <span className={styles.name}>{instructor.firstName} {instructor.lastName}</span>
                  <FontAwesomeIcon icon={faCheckDouble} className={styles.checkIcon} />
                </div>
              </div>
              <button className={styles.courseBtn}>Course name</button>
              <div className={styles.right}>
                <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
