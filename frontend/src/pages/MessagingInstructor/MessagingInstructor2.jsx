import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import React, { useState } from "react";
import styles from "./MessagingInstructor2.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function MessagingInstructor2() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Optional: get userId from route params

  const [messages, setMessages] = useState([
    { id: 1, text: "Do you know what time is it?", sender: "instructor", time: "11:40" },
    { id: 2, text: "11", sender: "student", time: "11:40" },
    { id: 3, text: "Do you know what time is it?", sender: "instructor", time: "11:40" },
    { id: 4, text: "How can I help you?", sender: "student", time: "11:41" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, text: newMessage, sender: "student", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setNewMessage("");
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.left}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={styles.backIcon}
              onClick={() => navigate(-1)}
            />
            <img
              src={`https://i.pravatar.cc/100?img=${userId || 2}`}
              alt="Instructor"
              className={styles.avatar}
            />
            <span className={styles.name}>Instructor Name</span>
          </div>
          <button className={styles.courseBtn}>Course Name</button>
        </div>

        {/* Chat Body */}
        <div className={styles.chatBody}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.sender === "student" ? styles.student : styles.instructor}`}
            >
              <p>{msg.text}</p>
              <span className={styles.time}>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
