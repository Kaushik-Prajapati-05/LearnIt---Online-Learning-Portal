import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import './Styles/Header_after_signin.css';
import capLogo from '../Assets/Cap.png';
import DefaultProfilePic from '../Assets/profile-img.jpeg';



const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";

function Header2() {
  
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [profilePic, setProfilePic] = useState(DefaultProfilePic);
  const location = useLocation();
  const navigate = useNavigate();

  const suggestions = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Design',
    'Artificial Intelligence',
    'Cybersecurity',
    'Blockchain',
    'Cloud Computing',
    'JavaScript',
    'Python',
  ];

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      // Navigate to home page first if not already there
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
          setActiveLink(sectionId);
        }
      }, 300); // Delay to ensure the page loads
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setActiveLink(sectionId);
      }
    }
  };
  

  const handleLogout = () => {
    localStorage.clear();
    if(location.pathname != '/') {
      navigate('/');
    }
    window.location.reload();
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'contact'];
      let currentSection = '';

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
          }
        }
      });

      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveLink('home');
    } else if (location.pathname.includes('/courses')) {
      setActiveLink('courses');
    } else if (location.pathname === '/contact') {
      setActiveLink('contact');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-button') && !e.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <img src={capLogo} alt="Graduation Cap" className="logo-image" />
        LearnIt
      </div>

      <nav className="header-links-2">
        <Link to="/" className={activeLink === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>
          Home
        </Link>
        <span className={`header-button ${activeLink === 'about' ? 'active' : ''}`} onClick={() => scrollToSection('about')}>
          About
        </span>
        
        <span className={`header-button ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => scrollToSection('contact')}>
          Contact
        </span>
      </nav>

      <button className="go-to-courses-button" onClick={() => navigate('/search-courses')}>
        Search Courses
      </button>

      <button className="profile-button" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
        <img src={profilePic} alt="Profile" />
      </button>
      
      {showProfileDropdown && (
        <div className="profile-dropdown">
          <Link to="/profile" className="dropdown-item">View Profile</Link>
          <Link to="/edit-profile" className="dropdown-item">Edit Profile</Link>
          {localStorage.userRole == 'Instructor' && ( // Show Dashboard link only for instructors
            <Link to="/instructor-dashboard" className="dropdown-item">Dashboard</Link>
          )}
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}

export default Header2;
