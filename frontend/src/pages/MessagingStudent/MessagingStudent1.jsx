import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import styles from "./MessagingStudent1.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronRight, faCheckDouble } from "@fortawesome/free-solid-svg-icons";

const students = [
  { id: 1, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=2", date: "11/10/19" },
  { id: 2, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=3", date: "11/10/19" },
  { id: 3, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=1", date: "11/10/19" },
  { id: 4, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=5", date: "11/10/19" },
  { id: 5, name: "Andrew Parker", img: "https://i.pravatar.cc/100?img=6", date: "11/10/19" },
  { id: 6, name: "Karen Castillo", img: "https://i.pravatar.cc/100?img=7", date: "11/10/19" },
];

export default function MessagingStudent1() {
  return (

    <><Navbar />
    <div className={styles.container}>
      {/* Header with add button */}
      <div className={styles.header}>
        <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
      </div>

      {/* Student list */}
      <div className={styles.list}>
        {students.map((student) => (
          <div key={student.id} className={styles.listItem}>
            <div className={styles.left}>
              <img src={student.img} alt={student.name} className={styles.avatar} />
              <div className={styles.info}>
                <span className={styles.name}>{student.name}</span>
                <FontAwesomeIcon icon={faCheckDouble} className={styles.checkIcon} />
              </div>
            </div>

            <button className={styles.courseBtn}>Course name</button>

            <div className={styles.right}>
              <span className={styles.date}>{student.date}</span>
              <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer /></>
  );
}
