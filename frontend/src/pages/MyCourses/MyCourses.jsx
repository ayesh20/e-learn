import React from "react";
import "./MyCourses.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const MyCourses = () => {
  return (
    <>
      <Navbar />

      <main>
        {/* ---------------- Section 1 ---------------- */}
        <div className="section_1">
          <header>
            <h2>Welcome back, ready for your next lesson?</h2>
            <div className="dropdown">
              <label htmlFor="category">Category </label>
              <select id="category">
                <option>All</option>
                <option>AWS</option>
                <option>Azure</option>
                <option>Google Cloud</option>
              </select>
            </div>
          </header>

          <div className="course-container">
            <div className="card">
              <div className="card-image">
                <img src="/images/course1.png" alt="Course" />
              </div>
              <div className="card-body">
                <h3 className="card-title">AWS Certified Solutions Architect</h3>
                <div className="author">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Lina" />
                  Lina
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "71.43%" }}></div>
                </div>
                <div className="lesson-info">Lesson 5 of 7</div>
              </div>
            </div>

            <div className="card">
              <div className="card-image">
                <img src="/images/course3.jpg" alt="Course" />
              </div>
              <div className="card-body">
                <h3 className="card-title">UI/UX Design Basics</h3>
                <div className="author">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Lina" />
                  Lina
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "42.86%" }}></div>
                </div>
                <div className="lesson-info">Lesson 3 of 7</div>
              </div>
            </div>

            <div className="card">
              <div className="card-image">
                <img src="/images/course7.jpg" alt="Course" />
              </div>
              <div className="card-body">
                <h3 className="card-title">Graphic Design Advanced</h3>
                <div className="author">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Lina" />
                  Lina
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: "57.14%" }}></div>
                </div>
                <div className="lesson-info">Lesson 4 of 7</div>
              </div>
            </div>
          </div>

          <div className="more-btn">
            <button>More</button>
          </div>
        </div>

        {/* ---------------- Section 2 ---------------- */}
        <div className="section_2">
          <div className="section2-header">
            <h3>Recommended for you</h3>
            <button>See All</button>
          </div>

          <div className="cardsection">
            <div className="card">
              <img src="/images/img1.jpg" alt="Course" />
              <div className="card-body">
                <div className="card-meta">
                  <span><i className="fa-solid fa-table-cells"></i> Design</span>
                  <span><i className="fa-regular fa-clock"></i> 3 Months</span>
                </div>
                <h3 className="card-title">Full Stack Development</h3>
                <p className="card-text">Learn web development from scratch with hands-on projects.</p>
                <div className="card-footer">
                  <div className="author">
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Lina" />
                    Lina
                  </div>
                  <div className="price">
                    <span className="old">$100</span>
                    <span className="new">$80</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <img src="/images/img2.jpg" alt="Course" />
              <div className="card-body">
                <div className="card-meta">
                  <span><i className="fa-solid fa-laptop-code"></i> Development</span>
                  <span><i className="fa-regular fa-clock"></i> 2 Months</span>
                </div>
                <h3 className="card-title">React for Beginners</h3>
                <p className="card-text">Build interactive UIs with React step by step.</p>
                <div className="card-footer">
                  <div className="author">
                    <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="Mark" />
                    Mark
                  </div>
                  <div className="price">
                    <span className="old">$90</span>
                    <span className="new">$70</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <img src="/images/img3.jpg" alt="Course" />
              <div className="card-body">
                <div className="card-meta">
                  <span><i className="fa-solid fa-chart-line"></i> Business</span>
                  <span><i className="fa-regular fa-clock"></i> 1 Month</span>
                </div>
                <h3 className="card-title">Digital Marketing Basics</h3>
                <p className="card-text">Understand the fundamentals of SEO and online ads.</p>
                <div className="card-footer">
                  <div className="author">
                    <img src="https://randomuser.me/api/portraits/women/23.jpg" alt="Sophie" />
                    Sophie
                  </div>
                  <div className="price">
                    <span className="old">$75</span>
                    <span className="new">$50</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <img src="/images/course7.jpg" alt="Course" />
              <div className="card-body">
                <div className="card-meta">
                  <span><i className="fa-solid fa-paint-brush"></i> Design</span>
                  <span><i className="fa-regular fa-clock"></i> 4 Months</span>
                </div>
                <h3 className="card-title">Advanced UI/UX</h3>
                <p className="card-text">Master UI/UX principles with real projects.</p>
                <div className="card-footer">
                  <div className="author">
                    <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="Alex" />
                    Alex
                  </div>
                  <div className="price">
                    <span className="old">$120</span>
                    <span className="new">$90</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- Section 3 ---------------- */}
        <div className="section_3">
          <div className="section3-content">
            <div className="section3-text">
              <h2>Learn from anywhere, anytime</h2>
              <p>Access courses online and gain new skills at your own pace.</p>
              <button>Explore Courses</button>
            </div>
            <div className="section3-image">
              <img src="/images/remote_learning.png" alt="Remote Learning" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MyCourses;
