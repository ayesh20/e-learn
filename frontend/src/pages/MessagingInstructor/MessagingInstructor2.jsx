import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import styles from "./MessagingInstructor2.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";

export default function MessagingInstructor2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const otherUser = location.state?.otherUser;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);

  // Fetch or create chat when component mounts
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const getOrCreateChat = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/chats/get-or-create", {
          userId: currentUser._id,
          userType: currentUser.role, // "student" or "instructor"
          otherId: otherUser._id,
          otherType: otherUser.role,
        });
        setChatId(res.data._id);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error creating/fetching chat:", err);
      }
    };

    getOrCreateChat();
  }, [currentUser, otherUser]);

  // Poll for messages every 3s
  useEffect(() => {
    if (!chatId || !currentUser) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/chats/${currentUser._id}`);
        const chat = res.data.find((c) => c._id === chatId);
        if (chat) setMessages(chat.messages || []);
      } catch (err) {
        console.error("Error polling messages:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [chatId, currentUser]);

  // Send a message (optimistic update)
  const handleSend = async () => {
    if (!newMessage.trim() || !chatId) return;

    const tempMessage = {
      _id: Date.now(), // temporary id
      sender: currentUser._id,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
      pending: true,
    };

    // Add immediately to UI
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/chats/send", {
        chatId,
        senderId: currentUser._id,
        senderModel: currentUser.role === "student" ? "students" : "instructors",
        text: tempMessage.text,
      });
      setMessages(res.data.messages); // Replace with server-confirmed messages
    } catch (err) {
      console.error("Error sending message:", err);
      // Rollback if sending fails
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
      setNewMessage(tempMessage.text);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <div className={styles.left}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={styles.backIcon}
              onClick={() => navigate(-1)}
            />
            <img
              src={otherUser?.profileImage || "https://i.pravatar.cc/100"}
              alt={otherUser?.firstName}
              className={styles.avatar}
            />
            <span className={styles.name}>
              {otherUser?.firstName} {otherUser?.lastName}
            </span>
          </div>
        </div>

        <div className={styles.chatBody}>
          {messages.map((msg, idx) => {
            const isCurrentUser =
              msg.sender?._id === currentUser._id || msg.sender === currentUser._id;
            return (
              <div
                key={msg._id || idx}
                className={`${styles.message} ${
                  isCurrentUser ? styles.student : styles.instructor
                }`}
              >
                <p>{msg.text}</p>
                <span className={styles.time}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {msg.pending && " • sending..."}
                </span>
              </div>
            );
          })}
        </div>

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
