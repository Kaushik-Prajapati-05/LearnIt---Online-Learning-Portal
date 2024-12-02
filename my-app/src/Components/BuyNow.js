import React, { useState, useEffect } from "react";
import "./Styles/BuyNow.css";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

function BuyNow() {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description"); // Initialize activeTab state
  const [openSections, setOpenSections] = useState({}); // State to track open sections
  const token = localStorage.getItem('accessToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
 const handleBuyNow = ()=>{
  const buy = async () => {
    try {
      // const response = await fetch(`http://localhost:8000/student/course/buy`,{},{});

      const response = await fetch(
        `http://localhost:8000/student/course/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId:userInfo._id,
            courseId:id
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log(data);
      navigate('/courses',{state:data.data._id})
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  buy();
  
 }
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
  const toggleSections = (chapterId) => {
    const allSections = document.querySelectorAll(".learnit-section-list");
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
    <div className="learnit-container">
      {/* Header */}
      <header className="learnit-header">
        <h1>{courses.title}</h1>
      </header>

      {/* Main Content */}
      <div className="learnit-main-content">
        {/* Sidebar */}
        <div className="learnit-sidebar">
          <div className="learnit-video">
            <iframe
              src={courses.demoVideourl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="learnit-course-info">
            <p>
              <strong>📅</strong>Published On : {courses.date}
            </p>
            <p>
              <strong>🧑‍🎓</strong> Enrolled Students : {courses.students?.length||0}
            </p>
            <p>
              <strong>📖</strong> Modules : {courses.curriculum?.length||0}
            </p>
            <p>
              <strong>🌐</strong> Language : {courses.primaryLanguage}
            </p>
            <p>
              <strong>📝</strong>Category : {courses.category}
            </p>
            <p>
              <strong>✏️</strong>Level : {courses.level}
            </p>

            <p>
              <strong>💰</strong>Price : ₹{courses.pricing}
            </p>
          </div>
          <div onClick={()=>handleBuyNow()} className="learnit-start-button">
            Buy Now
          </div>
        </div>

        {/* Content */}
        <div className="learnit-content">
          {/* Tabs */}
          <div className="learnit-tabs">
            <div
              className={`learnit-tab ${
                activeTab === "description" ? "learnit-tab-active" : ""
              }`}
              onClick={() => showTab("description")}
            >
              Description
            </div>
            <div
              className={`learnit-tab ${
                activeTab === "instructor" ? "learnit-tab-active" : ""
              }`}
              onClick={() => showTab("instructor")}
            >
              Instructor
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div className="learnit-tab-content">
              <p>{courses.description}</p>
              <div className="learnit-feature-box">
                <h3>In This Free Course, You Will Learn How To</h3>
                <ul>
                  <li>{courses.objectives}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="learnit-tab-content">
              <div className="learnit-instructor-profile">
                <img
                  src={courses.image}
                  alt="Instructor"
                  className="instructor-image"
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
                  className="linkedin-link"
                >
                  <FaLinkedin size={30} className="linkedin-icon" />
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