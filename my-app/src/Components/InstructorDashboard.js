import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./Styles/InstructorDashboard.css";
import CreateCourse from "./CreateCourse";
import CreateQuiz from "./CreateQuiz";


const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";



// Initial course and quiz data
// const initialCoursesData = [
//   { id: 1, title: "React & Redux Complete Course 2024", students: 10, revenue: "$1500" },
//   { id: 2, title: "Next JS Full Course 2025", students: 10, revenue: "$10000" },
//   { id: 3, title: "CSS Full Course 2025", students: 10, revenue: "$4000" },
//   { id: 4, title: "Python Full Course 2025", students: 10, revenue: "$50000" },
//   { id: 5, title: "JavaScript Mastery 2024", students: 10, revenue: "$5400" },
// ];

const initialQuizzesData = [
  { id: 1, title: "React Basics Quiz", coursename: 'webdev', passRate: "80%" },
  { id: 2, title: "Next JS Advanced Quiz", coursename: 'js', passRate: "70%" },
  { id: 3, title: "CSS Fundamentals Quiz", coursename: 'webdev', passRate: "75%" },
  { id: 4, title: "Python Essentials Quiz", coursename: 'python', passRate: "90%" },
];

const InstructorDashboard = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const [activeTab, setActiveTab] = useState('courses'); // Default to 'courses'
  const [coursesData, setCoursesData] = useState([]); // Managing courses state
  const [quizzesData, setQuizzesData] = useState(initialQuizzesData); // Managing quizzes state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log(userInfo  )
        const response = await axios.get(`${ENDPOINT}/instructor/course/getbyid/${userInfo._id}`);
        setCoursesData(response.data.data); 
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();  // Call the fetch function
  }, []);

  // Function to handle edit button click for courses
  const handleEditCourse = (id) => {
    console.log("MongoDB Course ID:", id); // Prints the MongoDB ID
    navigate(`/course/${id}`);
  };

  // Function to handle edit button click for quizzes
  const handleEditQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Function to calculate total students
  const getTotalStudents = () => {
    return coursesData.reduce((acc, course) => acc + course.students.length, 0);
  };

  // Function to calculate total revenue
  const getTotalRevenue = () => {
    return coursesData.reduce((acc, course) => {
      // Calculate the revenue for each course
      const revenue = course.students.length * course.pricing;
      return acc + revenue;
    }, 0);
  };


  // Function to calculate total courses
  const getTotalCourses = () => {
    return coursesData.length;
  };

  return (
    <div className="courses-page">
      <aside className="sidebar">
        <h2>Instructor View</h2>
        <nav>
          <ul>
            <li
              className={activeTab === 'courses' ? 'active' : ''}
              onClick={() => setActiveTab('courses')}
            >
              Courses
            </li>
            <li
              className={activeTab === 'quizzes' ? 'active' : ''}
              onClick={() => setActiveTab('quizzes')}
            >
              Quizzes
            </li>
            <li onClick={handleLogout} className="logout-link">
              Logout
            </li>
          </ul>
        </nav>
      </aside>
      <main className="courses-content">
        {activeTab === 'courses' && (
          <>
            <header className="header-2">
              <h1>Courses Dashboard</h1>
              <button
                className="create-course-btn"
                onClick={() => setActiveTab("create-course")}
              >
                <FaPlus style={{ marginRight: "5px" }} /> New Course
              </button>
            </header>
            <div className="dashboard-overview">
              <div className="stat-box">
                <h3>Total Courses</h3>
                <p>{getTotalCourses()}</p>
              </div>
              <div className="stat-box">
                <h3>Total Students Enrolled</h3>
                <p>{getTotalStudents()}</p>
              </div>
              <div className="stat-box">
                <h3>Total Revenue</h3>
                <p>₹{getTotalRevenue().toFixed(2)}</p>
              </div>
            </div>
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Students</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coursesData.map((course) => (
                  <tr key={course.id}>
                    <td><Link to={`/course/${course.id}`}>{course.title}</Link></td>
                    <td>{course.students.length}</td>
                    <td>{course.students.length * course.pricing}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditCourse(course._id)}><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'quizzes' && (
          <>
            <header className="header-2">
              <h1>Quizzes</h1>
              <button
                className="create-quiz-btn"
                onClick={() => setActiveTab("create-quiz")}
              >
                <FaPlus style={{ marginRight: "5px" }} /> New Quiz
              </button>
            </header>
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Course</th>
                  <th>Pass Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzesData.map((quiz) => (
                  <tr key={quiz.id}>
                    <td><Link to={`/quiz/${quiz.id}`}>{quiz.title}</Link></td>
                    <td>{quiz.coursename}</td>
                    <td>{quiz.passRate}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEditQuiz(quiz.id)}><FaEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'create-course' && (
          <>
            <CreateCourse />
          </>
        )}

        {activeTab === 'create-quiz' && (
          <>
            <CreateQuiz />
          </>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;
