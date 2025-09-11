import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';


import React, { useState } from "react";
import styles from "./MessagingInstructor2.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function MessagingInstructor2() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Do you know what time is it?", sender: "instructor", time: "11:40" },
    { id: 2, text: "11", sender: "student", time: "11:40" },
    { id: 3, text: "Do you know what time is it?", sender: "instructor", time: "11:40" },
    { id: 4, text: "How can I help you", sender: "student", time: "11:41" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    setMessages([
      ...messages,
      { id: messages.length + 1, text: newMessage, sender: "student", time: "11:42" },
    ]);
    setNewMessage("");
  };

  return (

    <><Navbar />
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.left}>
          <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} />
          <img
            src="https://i.pravatar.cc/100?img=2"
            alt="Andrew Parker"
            className={styles.avatar}
          />
          <span className={styles.name}>Andrew Parker</span>
        </div>
        <button className={styles.courseBtn}>Course name</button>
      </div>

      {/* Chat body */}
      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "student" ? styles.student : styles.instructor
            }`}
          >
            <p>{msg.text}</p>
            <span className={styles.time}>{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={styles.inputBox}>
        <input
          type="text"
          placeholder="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
    <Footer /></>
  );
}
