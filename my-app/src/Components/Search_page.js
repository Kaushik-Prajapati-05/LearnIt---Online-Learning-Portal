import React, { useState, useEffect, useRef } from 'react';
import './Styles/Search_page.css';
import { FaChevronDown } from 'react-icons/fa';

function Search() {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  const [selectedOthers, setSelectedOthers] = useState(false); 
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("A-Z");
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]); 
  const [toastMessages, setToastMessages] = useState([]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const categories = [
    "Photography", 
    "IT", 
    "Developer", 
    "Marketing", 
    "Health", 
    "Teaching Online", 
    "Technology", 
    "Business", 
    "Design", 
    "Others"
  ];

  const courses = [
    { imageUrl: "https://picsum.photos/150?random=1", title: "Photography Mastery", price: 50, dateAdded: "2024-01-01", level: "Advanced", category: "Photography" },
    { imageUrl: "https://picsum.photos/150?random=2", title: "Advanced IT Skills", price: 20, dateAdded: "2024-02-01", level: "Intermediate", category: "IT" },
    { imageUrl: "https://picsum.photos/150?random=3", title: "Web Development Bootcamp", price: 100, dateAdded: "2024-03-01", level: "Advanced", category: "Developer" },
    { imageUrl: "https://picsum.photos/150?random=4", title: "Marketing for Professionals", price: 75, dateAdded: "2024-01-15", level: "Intermediate", category: "Marketing" },
    { imageUrl: "https://picsum.photos/150?random=5", title: "Health & Wellness 101", price: 30, dateAdded: "2024-04-01", level: "Basic", category: "Health" },
    { imageUrl: "https://picsum.photos/150?random=6", title: "Teach Online Like a Pro", price: 120, dateAdded: "2024-02-15", level: "Intermediate", category: "Teaching Online" },
    { imageUrl: "https://picsum.photos/150?random=7", title: "Tech Innovations 2024", price: 200, dateAdded: "2024-03-15", level: "Advanced", category: "Technology" },
    { imageUrl: "https://picsum.photos/150?random=8", title: "Business Fundamentals", price: 90, dateAdded: "2024-01-10", level: "Basic", category: "Business" },
    { imageUrl: "https://picsum.photos/150?random=9", title: "Creative Design Techniques", price: 45, dateAdded: "2024-05-01", level: "Intermediate", category: "Design" },
    { imageUrl: "https://picsum.photos/150?random=10", title: "Intro to Photography", price: 0, dateAdded: "2024-06-01", level: "Basic", category: "Photography" },
    { imageUrl: "https://picsum.photos/150?random=11", title: "Free IT Resources", price: 0, dateAdded: "2024-06-10", level: "Basic", category: "IT" },
    { imageUrl: "https://picsum.photos/150?random=12", title: "Learn Web Development (Free)", price: 0, dateAdded: "2024-06-15", level: "Basic", category: "Developer" },
    { imageUrl: "https://picsum.photos/150?random=13", title: "Free Marketing Strategies", price: 0, dateAdded: "2024-06-20", level: "Basic", category: "Marketing" },
    { imageUrl: "https://picsum.photos/150?random=14", title: "Health Basics for All", price: 0, dateAdded: "2024-06-25", level: "Basic", category: "Health" },
    { imageUrl: "https://picsum.photos/150?random=15", title: "Health Basics for Boys", price: 0, dateAdded: "2024-06-25", level: "Basic", category: "Health" },
  ];    

  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const handleCategoryChange = (category) => {
    if (category === "Others") {
      setSelectedOthers(!selectedOthers);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
      );
    }
  };

  const handlePriceChange = (price) => {
    setPriceFilter(price === priceFilter ? null : price);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceFilter(null);
    setSelectedOthers(false);
  };

  const handleSortChange = (sortAlgorithm) => {
    setSelectedSort(sortAlgorithm);
    setShowSortDropdown(false);
  };

  const handleApplyFilters = () => {
    setShowFilterDropdown(false);
  };

  const sortCourses = (courses, sortAlgorithm) => {
    const levelOrder = { Basic: 1, Intermediate: 2, Advanced: 3 };
  
    switch (sortAlgorithm) {
      case "A-Z":
        return [...courses].sort((a, b) => a.title.localeCompare(b.title));
      case "Z-A":
        return [...courses].sort((a, b) => b.title.localeCompare(a.title));
      case "price-low-high":
        return [...courses].sort((a, b) => a.price - b.price);
      case "price-high-low":
        return [...courses].sort((a, b) => b.price - a.price);
      case "newly-added":
        return [...courses].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      case "level":
        return [...courses].sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
      default:
        return courses;
    }
  };  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          !buttonRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
      if (showSortDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortDropdown]);

  const handleBookmark = (courseTitle) => {
    setBookmarkedCourses((prev) => {
      const isBookmarked = prev.includes(courseTitle);
      const newMessage = isBookmarked ? "Course is UnBookmarked!!" : "Course is Bookmarked!!";

      const newToastMessage = { message: newMessage, id: new Date().getTime() };

      setToastMessages((prevMessages) => [
        ...prevMessages,
        newToastMessage, 
      ]);

      setTimeout(() => {
        setToastMessages((prevMessages) => prevMessages.slice(1)); 
      }, 2000);

      if (isBookmarked) {
        return prev.filter(course => course !== courseTitle);
      } else {
        return [...prev, courseTitle]; 
      }
    });
  };

  const filteredCourses = courses.filter((course) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    const priceMatch = priceFilter ? (priceFilter === "Free" ? course.price === 0 : course.price > 0) : true;
    return categoryMatch && priceMatch;
  });

  const sortedCourses = sortCourses(filteredCourses, selectedSort);

  return (
    <div className="search-container">
      {/* Toast Messages */}
      <div className="toast-container">
        {toastMessages.map((toast) => (
          <div key={toast.id} className="toast-message">
            {toast.message}
          </div>
        ))}
      </div>

      <div className="controls">
        <div className="filter-container">
          <button ref={buttonRef} className="filter-btn" onClick={toggleFilterDropdown}>
            Filter <FaChevronDown className={`dropdown-icon ${showFilterDropdown ? 'open' : ''}`} />
          </button>
          {showFilterDropdown && (
            <div className="filter-dropdown" ref={dropdownRef}>
              <h3 className="filter-heading">Categories</h3>
              {categories.map((category, index) => (
                <label key={index} className="filter-option">
                  <input
                    type="checkbox"
                    checked={category === "Others" ? selectedOthers : selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
              <h3 className="filter-heading">Price</h3>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={priceFilter === 'Free'}
                  onChange={() => handlePriceChange('Free')}
                />
                Free
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={priceFilter === 'Paid'}
                  onChange={() => handlePriceChange('Paid')}
                />
                Paid
              </label>
              <div className="filter-btns">
                <button className="reset-btn" onClick={resetFilters}>Reset</button>
                <button className="apply-btn" onClick={handleApplyFilters}>Apply</button>
              </div>
            </div>
          )}
        </div>

        <div className="sort-container">
          <div className="sort-btn" onClick={() => setShowSortDropdown(!showSortDropdown)}>
            {selectedSort} <FaChevronDown className={`dropdown-icon ${showSortDropdown ? 'open' : ''}`} />
          </div>
          {showSortDropdown && (
            <div className="sort-dropdown" ref={dropdownRef}>
              <ul>
                <li onClick={() => handleSortChange("A-Z")}>A-Z</li>
                <li onClick={() => handleSortChange("Z-A")}>Z-A</li>
                <li onClick={() => handleSortChange("price-low-high")}>Price Low-High</li>
                <li onClick={() => handleSortChange("price-high-low")}>Price High-Low</li>
                <li onClick={() => handleSortChange("newly-added")}>Newly Added</li>
                <li onClick={() => handleSortChange("level")}>Level</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="courses-container">
        {sortedCourses.map((course, index) => (
          <div key={index} className="course-card">
            <div className="course-tag">{course.price === 0 ? 'Free' : 'Paid'}</div>
            
            {/* Image before title */}
            <img src={course.imageUrl} alt={course.title} className="course-image" />
            
            <h3 className="course-title">{course.title}</h3>
            <p className="course-meta">Price: ${course.price}</p>
            <p className="course-meta">Level: {course.level}</p>
            <p className="course-description">This is a description of the course.</p>
            <button
              className="course-plus-btn"
              onClick={() => handleBookmark(course.title)}
            >
              {bookmarkedCourses.includes(course.title) ? '✔' : '+'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
