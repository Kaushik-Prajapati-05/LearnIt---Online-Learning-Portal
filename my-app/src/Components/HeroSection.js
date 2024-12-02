import React from 'react';
import { Box, Typography } from '@mui/material';
import './Styles/HeroSection.css';
import HeroImage from '../Assets/hero-image.png'; // Adjust the path according to your file structure

function HeroSection() {
  return (
    <Box className="hero-section">
      <Box className="hero-content">
        <Box className="hero-text">
          <Typography variant="h5" className="hero-subtitle">
            Professional & Lifelong Learning
          </Typography>
          <Typography variant="h2" className="hero-title">
          Learn Your Way: Online or Offline, Anytime, Anywhere!!
          </Typography>
        </Box>
        <Box className="hero-image">
          <img src={HeroImage} alt="Hero" className="hero-image-img" />
        </Box>
      </Box>
    </Box>
  );
}

export default HeroSection;
