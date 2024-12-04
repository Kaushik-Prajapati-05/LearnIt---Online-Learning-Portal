// import React, { useState, useEffect } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { FaChevronDown } from 'react-icons/fa';
// import SearchIcon from '@mui/icons-material/Search';
// import './Styles/Header.css';
// import capLogo from '../Assets/Cap.png';
// import Login from './Login'; 
// import Register from './Register'; 

// function Header() {
//   const [showSearch, setShowSearch] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [activeLink, setActiveLink] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredSuggestions, setFilteredSuggestions] = useState([]);
//   const [selectedSuggestion, setSelectedSuggestion] = useState('');
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const suggestions = [
//     'Web Development',
//     'Data Science',
//     'Machine Learning',
//     'Design',
//     'Artificial Intelligence',
//     'Cybersecurity',
//     'Blockchain',
//     'Cloud Computing',
//     'JavaScript',
//     'Python'
//   ];

//   const toggleSearch = () => {
//     if (selectedSuggestion) {
//       navigate(`/courses/${selectedSuggestion.toLowerCase().replace(/\s+/g, '-')}`);
//       setSearchTerm('');
//       setSelectedSuggestion('');
//     } else {
//       setSearchTerm('');
//       setFilteredSuggestions([]);
//     }
//     setShowSearch(!showSearch);
//   };

//   const toggleLogin = () => {
//     setShowLogin(!showLogin);
//     setShowRegister(false);  
//   };

//   const toggleRegister = () => {
//     setShowRegister(!showRegister);
//     setShowLogin(false); 
//   };

//   const handleMouseEnter = () => {
//     setShowDropdown(true);
//   };

//   const handleMouseLeave = () => {
//     setShowDropdown(false);
//   };

//   const scrollToSection = (sectionId) => {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//       setActiveLink(sectionId);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const userInput = e.target.value;
//     setSearchTerm(userInput);

//     if (userInput) {
//       const filtered = suggestions.filter((suggestion) =>
//         suggestion.toLowerCase().startsWith(userInput.toLowerCase())
//       );
//       setFilteredSuggestions(filtered);
//     } else {
//       setFilteredSuggestions([]);
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setSearchTerm(suggestion);
//     setSelectedSuggestion(suggestion);
//     setFilteredSuggestions([]);
//   };

//   const highlightSearchTerm = (course) => {
//     const index = course.toLowerCase().indexOf(searchTerm.toLowerCase());
//     if (index !== -1) {
//       const beforeMatch = course.substring(0, index);
//       const match = course.substring(index, index + searchTerm.length);
//       const afterMatch = course.substring(index + searchTerm.length);
//       return (
//         <>
//           {beforeMatch}
//           <span className="highlight">{match}</span>
//           {afterMatch}
//         </>
//       );
//     }
//     return course;
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = ['home', 'about', 'contact'];
//       let currentSection = '';

//       sections.forEach((sectionId) => {
//         const section = document.getElementById(sectionId);
//         if (section) {
//           const rect = section.getBoundingClientRect();
//           if (rect.top <= 100 && rect.bottom >= 100) {
//             currentSection = sectionId;
//           }
//         }
//       });

//       setActiveLink(currentSection);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     if (location.pathname === '/') {
//       setActiveLink('home');
//     } else if (location.pathname.includes('/courses')) {
//       setActiveLink('courses');
//     } else if (location.pathname === '/contact') {
//       setActiveLink('contact');
//     }
//   }, [location]);

//   return (
//     <header className="header">
//       <div className="header-logo">
//         <img src={capLogo} alt="Graduation Cap" className="logo-image" />
//         LearnIt
//       </div>
//       <nav className="header-links-2">
//         <Link to="/" className={activeLink === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>
//           Home
//         </Link>
//         <span className={`header-button ${activeLink === 'about' ? 'active' : ''}`} onClick={() => scrollToSection('about')}>
//           About
//         </span>

//         <div className="dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
//           <Link to="/courses" className={activeLink === 'courses' ? 'active' : ''}>
//             Courses <FaChevronDown className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
//           </Link>
//           {showDropdown && (
//             <div className="dropdown-menu">
//               {suggestions.map((suggestion, index) => (
//                 <Link key={index} to={`/courses/${suggestion.toLowerCase().replace(/\s+/g, '-')}`}>
//                   {suggestion}
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>

//         <span className={`header-button ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => scrollToSection('contact')}>
//           Contact
//         </span>
//       </nav>

//       <div className="searchBox">
//         <input
//           type="text"
//           className={`searchInput ${showSearch ? 'active' : ''}`}
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           style={{ width: showSearch ? '240px' : '0px', padding: showSearch ? '0 6px' : '0' }}
//         />
//         <button className="searchButton" onClick={toggleSearch}>
//           <SearchIcon style={{ color: '#ffffff' }} />
//         </button>
//         {filteredSuggestions.length > 0 && (
//           <div className="suggestions-dropdown">
//             {filteredSuggestions.map((suggestion, index) => (
//               <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
//                 {highlightSearchTerm(suggestion)}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <button className="login-button_2" onClick={toggleLogin}>
//         Register/Login
//       </button>

//       {showLogin && (
//         <Login onClose={toggleLogin} onRegister={toggleRegister} />
//       )}

//       {showRegister && (
//         <Register onClose={toggleRegister} onLogin={toggleLogin} />
//       )}
//     </header>
//   );
// }

// export default Header;


import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import './Styles/Header.css';
import capLogo from '../Assets/Cap.png';
import Login from './Login';
import Register from './Register';

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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
    'Python'
  ];

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };
 
  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(sectionId);
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
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

  return (
    <header className="header">
      <div className="header-logo">
        <img src={capLogo} alt="Graduation Cap" className="logo-image" />
        LearnIt
      </div>
      <nav className="header-links-2">
        <Link
          to="/"
          className={activeLink === 'home' ? 'active' : ''}
          onClick={() => scrollToSection('home')}
        >
          Home
        </Link>
        <span
          className={`header-button ${activeLink === 'about' ? 'active' : ''}`}
          onClick={() => scrollToSection('about')}
        >
          About
        </span>

        
        <span
          className={`header-button ${activeLink === 'contact' ? 'active' : ''}`}
          onClick={() => scrollToSection('contact')}
        >
          Contact
        </span>
      </nav>

      <button className="go-to-courses-button" onClick={() => navigate('/search-courses')}>
        Search Courses
      </button>

      <button className="login-button_2" onClick={toggleLogin}>
        Register/Login
      </button>

      {showLogin && <Login onClose={toggleLogin} onRegister={toggleRegister} />}
      {showRegister && <Register onClose={toggleRegister} onLogin={toggleLogin} />}
    </header>
  );
}

export default Header;
