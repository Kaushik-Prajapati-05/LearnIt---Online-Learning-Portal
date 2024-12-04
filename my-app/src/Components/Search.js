import React, { useState, useEffect, useRef } from "react";
import "./Styles/Search.css";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";

function Search() {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  const [selectedOthers, setSelectedOthers] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("A-Z");
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [toastMessages, setToastMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

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
    "Others",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8000/instructor/course/get")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setCourses(response.data.data); // Set courses to state
        } else {
          console.error("Courses data is not an array:", response.data.data);
        }
        setLoading(false); // Stop loading after fetching
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false); // Stop loading in case of error
      });
  }, []);

  const handleCourseClick = (id) => {
    navigate(`/buy-now/${id}`); // Navigate to the buy-now page with the course ID
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const handleCategoryChange = (category) => {
    if (category === "Others") {
      setSelectedOthers(!selectedOthers);
      if (!selectedOthers) {
        setSelectedCategories(["Others"]);
      } else {
        setSelectedCategories([]);
      }
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((cat) => cat !== category)
          : [...prev, category]
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
    switch (sortAlgorithm) {
      case "A-Z":
        return [...courses].sort((a, b) => a.title.localeCompare(b.title));
      case "Z-A":
        return [...courses].sort((a, b) => b.title.localeCompare(a.title));
      case "price-low-high":
        return [...courses].sort((a, b) => a.pricing - b.pricing);
      case "price-high-low":
        return [...courses].sort((a, b) => b.pricing - a.pricing);
      case "newly-added":
        return [...courses].sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
      case "popular":
        return [...courses].sort((a, b) => b.popularity - a.popularity);
      default:
        return courses;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
      if (
        showSortDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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

      const newToastMessage = {
        message: isBookmarked
          ? "Course is Unbookmarked!"
          : "Course is Bookmarked!",
        id: new Date().getTime(),
      };

      setToastMessages((prevMessages) => [...prevMessages, newToastMessage]);

      setTimeout(() => {
        setToastMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== newToastMessage.id)
        );
      }, 2000);

      return isBookmarked
        ? prev.filter((course) => course !== courseTitle)
        : [...prev, courseTitle];
    });
  };

  const filteredCourses = courses.filter((course) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);
    const priceMatch = priceFilter
      ? priceFilter === "Free"
        ? course.pricing === 0
        : course.pricing > 0
      : true;
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
          <button
            ref={buttonRef}
            className="filter-btn"
            onClick={toggleFilterDropdown}
          >
            Filter{" "}
            <FaChevronDown
              className={`dropdown-icon ${showFilterDropdown ? "open" : ""}`}
            />
          </button>
          {showFilterDropdown && (
            <div className="filter-dropdown" ref={dropdownRef}>
              <h3 className="filter-heading">Categories</h3>
              {categories.map((category, index) => (
                <label key={index} className="filter-option">
                  <input
                    type="checkbox"
                    checked={
                      category === "Others"
                        ? selectedOthers
                        : selectedCategories.includes(category)
                    }
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
              <h3 className="filter-heading">Price</h3>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={priceFilter === "Free"}
                  onChange={() => handlePriceChange("Free")}
                />
                Free
              </label>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={priceFilter === "Paid"}
                  onChange={() => handlePriceChange("Paid")}
                />
                Paid
              </label>
              <div className="filter-btns">
                <button className="reset-btn" onClick={resetFilters}>
                  Reset
                </button>
                <button className="apply-btn" onClick={handleApplyFilters}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sort-container">
          <div
            className="sort-btn"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            {selectedSort}{" "}
            <FaChevronDown
              className={`dropdown-icon ${showSortDropdown ? "open" : ""}`}
            />
          </div>
          {showSortDropdown && (
            <div className="sort-dropdown" ref={dropdownRef}>
              <ul>
                <li onClick={() => handleSortChange("A-Z")}>A-Z</li>
                <li onClick={() => handleSortChange("Z-A")}>Z-A</li>
                <li onClick={() => handleSortChange("price-low-high")}>
                  Price Low-High
                </li>
                <li onClick={() => handleSortChange("price-high-low")}>
                  Price High-Low
                </li>
                <li onClick={() => handleSortChange("newly-added")}>
                  Newly Added
                </li>
                <li onClick={() => handleSortChange("popular")}>Popular</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="courses-container">
        {sortedCourses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => handleCourseClick(course._id)}
          >
            <div className="course-tag">
              {course.pricing === 0 ? "Free" : "Paid"}
            </div>
            <img src={course.image} alt="Course" className="course-image" />
            <h3 className="course-title">{course.title}</h3>
            <p className="course-meta">Price: {course.pricing}rs</p>
            <p className="course-description">{course.description}</p>
            <button
              className="course-plus-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark(course.title);
              }}
            >
              {bookmarkedCourses.includes(course.title) ? "✔" : "+"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;