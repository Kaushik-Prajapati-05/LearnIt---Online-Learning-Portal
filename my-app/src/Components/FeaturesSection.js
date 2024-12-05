import React from 'react';
import './Styles/FeaturesSection.css';
import { People, LibraryBooks, School, LaptopMac } from '@mui/icons-material'; // Import MUI icons


const ENDPOINT= process.env.BACKEND_URL ||  "http://localhost:8000";

const features = [
  {
    icon: <People style={{ fontSize: 50, color: "#ff8c00" }} />,
    title: "Industry Experts",
    description: "Comprehensive self-paced courses created with top practitioners",
  },
  {
    icon: <LibraryBooks style={{ fontSize: 50, color: "#ff8c00" }} />,
    title: "Free Resources",
    description: "Free guides on career paths, salaries, interview tips, and more",
  },
  {
    icon: <School style={{ fontSize: 50, color: "#ff8c00" }} />,
    title: "Skill-based Learning",
    description: "600+ job-ready skills on offer in today's most in-demand domains",
  },
  {
    icon: <LaptopMac style={{ fontSize: 50, color: "#ff8c00" }} />,
    title: "Anytime, Anywhere",
    description: "Learn while working or studying from any place, across any device",
  },
];

const FeaturesSection = () => {
  return (
    <div className="features-section">
      <h2 className="features-title">
        Courses Focused On Building Strong Foundational Skills For Career Growth
      </h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
