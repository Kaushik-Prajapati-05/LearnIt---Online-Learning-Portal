import React from 'react';
import './Styles/About.css';

const About = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        <h2>About</h2>
        <p>
          Welcome to <strong>LearnIt</strong>, your ultimate online learning destination! Whether you're looking to start a new skill, advance your career, or explore a new hobby, our platform offers a range of high-quality courses, both paid and free. With expert instructors and practical exercises, LearnIt is dedicated to empowering students everywhere.
        </p>
        <p>
          Our courses cover a diverse set of topics, from technology and business to arts and personal development. Join a community of learners and take your knowledge to the next level with interactive videos, projects, and a supportive community.
        </p>
        <div className="about-stats">
          <div className="stat">
            <h3>1,000+</h3>
            <p>Courses Available</p>
          </div>
          <div className="stat">
            <h3>500k+</h3>
            <p>Students Enrolled</p>
          </div>
          {/* <div className="stat">
            <h3>95%</h3>
            <p>Success Rate</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default About;
