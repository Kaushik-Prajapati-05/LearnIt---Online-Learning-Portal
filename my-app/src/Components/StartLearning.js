import React, { useState, useEffect } from "react";
import "./Styles/StartLearning.css";
import { FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router-dom";

function StartLearning() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/coursedetails/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourses();
    }
  }, [id]);

  const showTab = (tabId) => setActiveTab(tabId);

  return (
    <div className="course-container-2">
      {/* Header */}
      <div className="course-header-2">
        <h1>{courses.title || "Course Title"}</h1>
      </div>

      {/* Main Content */}
      <div className="course-main-content-2">
        {/* Sidebar */}
        <div className="course-sidebar-2">
          <div className="course-video-2">
            <iframe
              src={courses.demoVideourl}
              title="Course Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="course-course-info-2">
            <p><strong>📅 Published On:</strong> {courses.date || "N/A"}</p>
            <p><strong>🧑‍🎓 Enrolled Students:</strong> {courses.students?.length || 0}</p>
            <p><strong>📖 Modules:</strong> {courses.curriculum?.length || 0}</p>
            <p><strong>🌐 Language:</strong> {courses.primaryLanguage || "N/A"}</p>
            <p><strong>📝 Category:</strong> {courses.category || "N/A"}</p>
            <p><strong>✏ Level:</strong> {courses.level || "N/A"}</p>
            <p><strong>💰 Price:</strong> ₹{courses.pricing || "N/A"}</p>
          </div>
          <a href="/startlearning" className="course-start-button-2">
            Start Learning
          </a>
        </div>

        {/* Main Content Area */}
        <div className="course-content-2">
          {/* Tabs */}
          <div className="course-tabs-2">
            <div
              className={`course-tab-2 ${activeTab === "description" ? "course-tab-active-2" : ""}`}
              onClick={() => showTab("description")}
            >
              Description
            </div>
            <div
              className={`course-tab-2 ${activeTab === "curriculum" ? "course-tab-active-2" : ""}`}
              onClick={() => showTab("curriculum")}
            >
              Curriculum
            </div>
            <div
              className={`course-tab-2 ${activeTab === "instructor" ? "course-tab-active-2" : ""}`}
              onClick={() => showTab("instructor")}
            >
              Instructor
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div className="course-tab-content-2">
              <p>{courses.description || "No description available."}</p>
              <div className="course-feature-box-2">
                <h3>In This Course, You Will Learn:</h3>
                <ul>
                  <li>{courses.objectives || "No objectives provided."}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="course-tab-content-2">
              {courses.curriculum && courses.curriculum.length > 0 ? (
                courses.curriculum.map((module, index) => (
                  <div className="course-chapter-box-2" key={index}>
                    <h3>📍 {module.moduleName}</h3>
                    <div className="course-section-list-2">
                      {module.moduleSections && module.moduleSections.map((section, idx) => (
                        <p key={idx}>
                          <a href={module.moduleContentUrl || "#"}>🧾 {section}</a>
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No curriculum available.</p>
              )}
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="course-tab-content-2">
              <div className="course-instructor-profile-2">
                <img
                  src={courses.image}
                  alt="Instructor"
                  className="instructor-image-2"
                />
                <p><strong>{courses.instructorName || "Instructor Name"}</strong></p>
                <p>👉 Expert in {courses.expertise || "N/A"}</p>
                <p>👉 Students Taught: {courses.taughtStudents || 0}+</p>
                <p>👉 Courses Offered: {courses.offeredCourses || 0}</p>
                <p>👉 Rating: {courses.rating || "N/A"}</p>
                <a
                  href={courses.linkedinUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link-2"
                >
                  <FaLinkedin size={30} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartLearning;
