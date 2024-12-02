import React, { useState, useEffect } from "react";
import "./Styles/BuyNow.css";
import { FaLinkedin } from "react-icons/fa";
import { useParams } from "react-router-dom";

function BuyNow() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(http://localhost:8000/api/coursedetails/${id});

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
  const toggleSections = (chapterId) => {
    const allSections = document.querySelectorAll(".learnit-section-list-2");
    allSections.forEach((section) => {
      if (section.id !== chapterId) {
        section.style.display = "none";
      }
    });
    const sectionList = document.getElementById(chapterId);
    sectionList.style.display =
      sectionList.style.display === "none" ? "block" : "none";
  };

  return (
    <div className="learnit-container-2">
      {/* Header */}
      <header className="learnit-header-2">
        <h1>{courses.title}</h1>
      </header>

      {/* Main Content */}
      <div className="learnit-main-content-2">
        {/* Sidebar */}
        <div className="learnit-sidebar-2">
          <div className="learnit-video-2">
            <iframe
              src={courses.demoVideourl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="learnit-course-info-2">
            <p>
              <strong>📅</strong> Published On : {courses.date}
            </p>
            <p>
              <strong>🧑‍🎓</strong> Enrolled Students : {courses.students?.length || 0}
            </p>
            <p>
              <strong>📖</strong> Modules : {courses.curriculum?.length || 0}
            </p>
            <p>
              <strong>🌐</strong> Language : {courses.primaryLanguage}
            </p>
            <p>
              <strong>📝</strong> Category : {courses.category}
            </p>
            <p>
              <strong>✏</strong> Level : {courses.level}
            </p>

            <p>
              <strong>💰</strong> Price : ₹{courses.pricing}
            </p>
          </div>
          <a href="/payment" className="learnit-start-button-2">
            Buy Now
          </a>
        </div>

        {/* Content */}
        <div className="learnit-content-2">
          {/* Tabs */}
          <div className="learnit-tabs-2">
            <div
              className={`learnit-tab-2 ${
                activeTab === "description" ? "learnit-tab-active-2" : ""
              }`}
              onClick={() => showTab("description")}
            >
              Description
            </div>
            <div
              className={`learnit-tab-2 ${
                activeTab === "instructor" ? "learnit-tab-active-2" : ""
              }`}
              onClick={() => showTab("instructor")}
            >
              Instructor
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div className="learnit-tab-content-2">
              <p>{courses.description}</p>
              <div className="learnit-feature-box-2">
                <h3>In This Free Course, You Will Learn How To</h3>
                <ul>
                  <li>{courses.objectives}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="learnit-tab-content-2">
              <div className="learnit-instructor-profile-2">
                <img
                  src={courses.image}
                  alt="Instructor"
                  className="instructor-image-2"
                  height="100"
                  width="100"
                />
                <p>
                  <strong>{courses.instructorName}</strong>
                </p>
                <p>👉 Expert in {courses.expertise}</p>
                <p>👉 Students taught: {courses.taughtStudents}+</p>
                <p>👉 Total courses offered: {courses.offeredCourses}</p>
                <p>👉 Rating: {courses.rating}</p>

                <a
                  href={courses.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link-2"
                >
                  <FaLinkedin size={30} className="linkedin-icon-2" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyNow;
