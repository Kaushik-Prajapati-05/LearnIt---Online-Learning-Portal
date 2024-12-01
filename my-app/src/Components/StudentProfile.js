import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faBookOpen,
  faHourglassHalf,
  faClipboardCheck,
  faSignOutAlt,
   faList,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Styles/Profile.css";
import img from "../Assets/profile-img.jpeg";


const Profile = () => {
  const [activeTab, setActiveTab] = useState("All Courses");
  const [activeSidebar, setActiveSidebar] = useState("My Courses");
  const [courses, setCourses] = useState([]); // State to store courses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        // const studentId = localStorage.getItem("studentId"); // Get studentId from localStorage
        const response = await fetch(
          `http://localhost:8000/student/course/listcourses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ studentId:userInfo._id  }),
          }
        );

        const data = await response.json();
       
        console.log(data.data);
        setCourses(data.data || []); // Assuming response structure
       } catch (err) {
        console.log(err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };


    fetchCourses();
  }, []);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const handleSidebarClick = (section) => {
    setActiveSidebar(section);
  };


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };


  const filteredCourses = () => {
    switch (activeTab) {
      case "In Progress Courses":
        return courses.filter((course) => course.status === "In Progress");
      case "Finished Courses":
        return courses.filter((course) => course.status === "Completed");
      default:
        return courses;
    }
  };


  return (
    <div className="profile-page">
      <header className="profile-header">
        <nav>
          <p>Profile</p>
    </nav>
      </header>
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image">
            <div className="avatar">
              <img src={img} alt="Profile Avatar" />
            </div>
            <h2>Kaushik</h2>
            <p className="profile-description">
              Enthusiastic learner and tech enthusiast. Passionate about coding
              and exploring new technologies.
            </p>
          </div>
          <ul className="sidebar-menu">
            <li
              className={activeSidebar === "My Courses" ? "active" : ""}
              onClick={() => handleSidebarClick("My Courses")}
            >
              <FontAwesomeIcon icon={faList} /> My Courses
            </li>
            <li
              className={activeSidebar === "Quizzes" ? "active" : ""}
              onClick={() => handleSidebarClick("Quizzes")}
            >
              <FontAwesomeIcon icon={faBookOpen} /> Quizzes
            </li>
            <li
              className={activeSidebar === "Logout" ? "active" : ""}
              onClick={() => handleLogout()}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </div>
        <div className="profile-details">
          {activeSidebar === "My Courses" && (
            <>
              <div className="course-summary">
                <div className="course-card-2">
                  <FontAwesomeIcon icon={faBookOpen} size="2x" />
           <h3>Enrolled Courses</h3>
                  <p>{courses.length}</p>
                </div>
                <div className="course-card-2">
                  <FontAwesomeIcon icon={faHourglassHalf} size="2x" />
                  <h3>Inprogress Courses</h3>
                  <p>
                    {courses.filter((course) => course.status === "In Progress")
                      .length}
                  </p>
                </div>
                <div className="course-card-2">
                  <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
                  <h3>Finished Courses</h3>
                  <p>
                    {courses.filter((course) => course.status === "Completed")
                      .length}
                  </p>
                </div>
              </div>
              <div className="course-tabs">
                {["All Courses", "In Progress Courses", "Finished Courses"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={activeTab === tab ? "active-tab" : ""}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
              <div className="course-list">
                {loading ? (
                  <p>Loading courses...</p>
                ) : error ? (
                  <p className="error">{error}</p>
                ) : filteredCourses().length > 0 ? (
                  filteredCourses().map((course) => (
                <div className="course-item" key={course.courseId}>
                      <h3>{course.title}</h3>
                      <p>Instructor: {course.instructorName}</p>
                      <p>Purchased on: {new Date(course.dateOfPurchase).toDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-course">No courses available!</p>
                )}
              </div>
            </>
          )}
          {activeSidebar === "Quizzes" && (
            <div className="quizzes-section">
              <h3>Your Quizzes</h3>
              <p>No quizzes available!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Profile;
