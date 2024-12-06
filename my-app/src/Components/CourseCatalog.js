import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Person, AccessTime } from '@mui/icons-material'; // Import MUI icons
import './Styles/CoursesCatalog.css';

const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";


function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${ENDPOINT}/instructor/course/get`,{
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
     navigate(`/buy-now/${cid}`)
  }

  return (
    <div className="course-catalog">
    <div className="categories">
  {["All", "Web Development", "Machine Learning", "Data Science"].map(category => (
    <h2
      key={category}
      className={`category ${selectedCategory === category ? "active" : ""}`}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </h2>
  ))}
</div>

      <div className="course-grid">
        {coursesToShow.map(course => (
          <div key={course._id} className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-category">{course.category}</div>
            <h1 className="course-title">{course.title}</h1>
              <div className="course-info">
              <span className="course-stats">
                <Person className="icon" />
                <h5>{course.students.length} Students</h5> { /* need to change */ }
              </span> 
              
              
            </div>
            <p className="course-description">{course.description}</p>
            <div className="course-footer">
              <span className="course-price">{course.pricing}rs</span>
              <button className="start-learning" onClick={()=>{handleStart(course._id)}}>Explore More</button>
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