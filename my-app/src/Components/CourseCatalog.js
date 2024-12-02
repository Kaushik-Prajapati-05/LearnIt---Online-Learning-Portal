import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Person, AccessTime } from '@mui/icons-material'; // Import MUI icons
import './Styles/CoursesCatalog.css';
import img1 from '../Assets/1.jpeg';
import img2 from '../Assets/2.jpeg';
import img3 from '../Assets/3.jpeg';
import img4 from '../Assets/4.jpeg';
import img5 from '../Assets/5.jpeg';
import img6 from '../Assets/6.jpeg';
import img7 from '../Assets/7.jpeg';
import img8 from '../Assets/8.jpeg';
import img9 from '../Assets/9.jpeg';
import img10 from '../Assets/10.jpeg';
import img11 from '../Assets/11.jpeg';
import img12 from '../Assets/12.jpeg';
import img13 from '../Assets/13.jpeg';

const courses = [
  {
    id: 1,
    category: "Web Development",
    title: "HTML & CSS for Beginners",
    description: "Learn the basics of web development with HTML and CSS.",
    students: 400,
    duration: "4 Weeks",
    price: "Free",
    imgSrc: img1,
  },
  {
    id: 2,
    category: "Web Development",
    title: "JavaScript Essentials",
    description: "Understand the fundamentals of JavaScript for building interactive websites.",
    students: 320,
    duration: "6 Weeks",
    price: "$39.00",
    imgSrc: img2,
  },
  {
    id: 3,
    category: "Web Development",
    title: "Responsive Web Design",
    description: "Create websites that look great on any device.",
    students: 210,
    duration: "5 Weeks",
    price: "$49.00",
    imgSrc: img3,
  },
  {
    id: 4,
    category: "Machine Learning",
    title: "Introduction to Machine Learning",
    description: "An introduction to the basics of machine learning concepts.",
    students: 150,
    duration: "8 Weeks",
    price: "$99.00",
    imgSrc: img4,
  },
  {
    id: 5,
    category: "Machine Learning",
    title: "Deep Learning Fundamentals",
    description: "Learn the fundamentals of deep learning and neural networks.",
    students: 300,
    duration: "10 Weeks",
    price: "$129.00",
    imgSrc: img5,
  },
  {
    id: 6,
    category: "Machine Learning",
    title: "Natural Language Processing",
    description: "Explore NLP techniques for working with text data.",
    students: 200,
    duration: "6 Weeks",
    price: "$89.00",
    imgSrc: img6,
  },
  {
    id: 7,
    category: "Data Science",
    title: "Data Science Essentials",
    description: "Start your data science journey with this introductory course.",
    students: 270,
    duration: "6 Weeks",
    price: "$59.00",
    imgSrc: img7,
  },
  {
    id: 8,
    category: "Data Science",
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis and data science.",
    students: 380,
    duration: "5 Weeks",
    price: "$49.00",
    imgSrc: img8,
  },
  {
    id: 9,
    category: "Data Science",
    title: "Data Visualization with Python",
    description: "Create stunning visualizations with Python libraries.",
    students: 330,
    duration: "4 Weeks",
    price: "$39.00",
    imgSrc: img9,
  },
  {
    id: 10,
    category: "Web Development",
    title: "React for Beginners",
    description: "Learn the basics of React and build dynamic web applications.",
    students: 500,
    duration: "7 Weeks",
    price: "$79.00",
    imgSrc: img10,
  },
  {
    id: 11,
    category: "Machine Learning",
    title: "Computer Vision",
    description: "Get started with computer vision techniques and applications.",
    students: 290,
    duration: "9 Weeks",
    price: "$109.00",
    imgSrc: img11,
  },
  {
    id: 12,
    category: "Data Science",
    title: "Statistics for Data Science",
    description: "Master statistical concepts essential for data science.",
    students: 410,
    duration: "8 Weeks",
    price: "$69.00",
    imgSrc: img12,
  },
  {
    id: 13,
    category: "Web Development",
    title: "React for Beginners",
    description: "Learn the basics of React and build dynamic web applications.",
    students: 500,
    duration: "7 Weeks",
    price: "$79.00",
    imgSrc: img13,
  },
];

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/instructor/course/get',{
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          
      });
        const data = await response.json();
        setCourses(data.data);
        // console.log(courses)
        // console.log(data.data[0])
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [selectedCategory]);
  // console.log(course);
  const ans=courses;
  console.log(ans);   

  const filteredCourses = selectedCategory === "All"
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  const coursesToShow = showAllCourses ? filteredCourses : filteredCourses.slice(0, 4);

  const handleViewAll = () => {
    setShowAllCourses(true);
  };

  const handleStart =(cid)=>{
    // navigate('/learncourse',{state : cid});
  }

  return (
    <div className="course-catalog">
      <div className="categories">
        <h2 className={`category ${selectedCategory === "All" ? "active" : ""}} onClick={() => setSelectedCategory("All")`}>All</h2>
        <h2 className={`category ${selectedCategory === "Web Development" ? "active" : ""}} onClick={() => setSelectedCategory("Web Development")`}>Web Development</h2>
        <h2 className={`category ${selectedCategory === "Machine Learning" ? "active" : ""}} onClick={() => setSelectedCategory("Machine Learning")`}>Machine Learning</h2>
        <h2 className={`category ${selectedCategory === "Data Science" ? "active" : ""}} onClick={() => setSelectedCategory("Data Science")`}>Data Science</h2>
      </div>

      <div className="course-grid">
        {coursesToShow.map(course => (
          <div key={course._id} className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-category">{course.category}</div>
            <h3 className="course-title">{course.title}</h3>
              <div className="course-info">
              <span className="course-stats">
                <Person className="icon" />
                <span>{course.students.length} Students</span> { /* need to change */ }
              </span> 
              <Divider
                orientation="vertical"
                sx={{
                  height: '18px',
                  borderRight: '2px solid #888',
                  margin: '0 12px',
                }}
              />
              <span className="course-stats">
                <AccessTime className="icon" />
                <span>{course.duration}</span>
              </span>
            </div>
            <p className="course-description">{course.description}</p>
            <div className="course-footer">
              <span className="course-price">{course.pricing}rs</span>
              <button className="start-learning" onClick={()=>{handleStart(course._id)}}>Start Learning</button>
            </div>
          </div>
        ))}
      </div>

      {!showAllCourses && filteredCourses.length > 4 && (
        <button className="view-all" onClick={handleViewAll}>
          View All Courses
        </button>
      )}
    </div>
  );
}

export default CourseCatalog;