import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import styles from "./MessagingInstructor1.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MessagingInstructor1() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !currentUser) navigate("/login");
  }, [currentUser, loading, navigate]);

  // Fetch opposite users
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError("");

        const endpoint =
          currentUser.role === "instructor"
            ? "http://localhost:5000/api/students"
            : "http://localhost:5000/api/instructors";

        const res = await axios.get(endpoint);

        // Extract array from API response correctly
        const usersArray =
          currentUser.role === "instructor"
            ? res.data.students || []
            : res.data.instructors || [];

        setUsers(usersArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load users. Please try again later.");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users by search input
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        u =>
          `${u.firstName || ""} ${u.lastName || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : [];

  // Navigate to chat page with the selected user
  const handleChat = user => {
    navigate("/messaginginstructor2", { state: { otherUser: user } });
  };

  if (loading) return <div>Loading user...</div>;
  if (!currentUser) return <div>Please log in first.</div>;

  return (
    <>
      <Navbar />
      <div className={styles.courseList}>
        <div className={styles.topBar}>
          <input
            type="text"
            placeholder={`Search ${
              currentUser.role === "student" ? "instructors" : "students"
            }`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchBox}
          />
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        </div>

        {loadingUsers ? (
          <div style={{ padding: "20px" }}>Loading users...</div>
        ) : error ? (
          <div style={{ padding: "20px", color: "red" }}>{error}</div>
        ) : filteredUsers.length > 0 ? (
          <div className={styles.list}>
            {filteredUsers.map(u => (
              <div key={u._id} className={styles.listItem}>
                <img
                  src={u.profileImage || "https://i.pravatar.cc/100"}
                  alt={`${u.firstName} ${u.lastName}`}
                  className={styles.avatar}
                />
                <div className={styles.userInfo}>
                  <span className={styles.name}>
                    {u.firstName} {u.lastName}
                  </span>
                </div>
                <div className={styles.buttons}>
                  <button
                    className={styles.startBtn}
                    onClick={() => handleChat(u)}
                  >
                    Chat
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px" }}>No users found.</div>
        )}
      </div>
      <Footer />
    </>
  );
}
