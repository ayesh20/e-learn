import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import React, { useState } from "react";
import styles from "./MessagingStudent2.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function MessagingInstructor2() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Can you explain patterns?", sender: "student", time: "11:40" },
    { id: 2, text: "Ok sure", sender: "instructor", time: "11:40" },
    { id: 3, text: "Can you give me time slot?", sender: "student", time: "11:40" },
    { id: 4, text: "after 12.30", sender: "instructor", time: "11:41" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;
    setMessages([
      ...messages,
      { id: messages.length + 1, text: newMessage, sender: "instructor", time: "11:42" },
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
          <span className={styles.name}>Dr. Sarash Jonsan</span>
        </div>
        <button className={styles.courseBtn}>Course name</button>
      </div>

      {/* Chat body */}
      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender === "instructor" ? styles.student : styles.instructor
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
