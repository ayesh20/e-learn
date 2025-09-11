import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import React from "react";
import styles from "./MessagingInstructor1.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const data = [
  { id: 1, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=2" },
  { id: 3, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=3" },
  { id: 4, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=4" },
  { id: 5, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=5" },
  { id: 6, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=6" },
  { id: 7, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=7" },
];

export default function MessagingInstructor1() {
  return (

    <><Navbar />
    <div className={styles.courseList}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Search by name" />
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        </div>

        <button className={styles.dropdownBtn}>
          Course name <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>

      {/* List */}
      <div className={styles.list}>
        {data.map((item) => (
          <div key={item.id} className={styles.listItem}>
            <img src={item.img} alt={item.name} className={styles.avatar} />
            <span className={styles.name}>{item.name}</span>

            <button className={styles.courseBtn}>Course name</button>
            <button className={styles.startBtn}>Start</button>
          </div>
        ))}
      </div>
    </div>
    <Footer /></>
  );
}
