import React from 'react';
import './Styles/Contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaUsers} from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-item">
        <FaMapMarkerAlt className="contact-icon" />
        <h3>Address</h3>
        <p>DAIICT-campus, nearReliance Cross Rd, Gandhinagar, Gujarat 382007</p>
        <br />
        <a href="https://www.google.com/maps/place/DA-IICT/@23.1889152,72.6278185,17z/data=!4m6!3m5!1s0x395c2a3c9618d2c5:0xc54de484f986b1fa!8m2!3d23.188537!4d72.6289155!16zL20vMDIzc2g3?entry=ttu&g_ep=EgoyMDI0MTEyNC4xIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="contact-link">
          View Map
        </a>
      </div>
      
      <div className="contact-item">
        <FaPhoneAlt className="contact-icon" />
        <h3>Contact Info</h3>
        <p>Mobile: (+91) 7990377408 </p>
        <p>Email: 202201471@daiict.ac.in
        </p>
      </div>
      
      <div className="contact-item">
        <FaUsers className="contact-icon" />
        <h3>About us</h3>
        <p>We are a group of students, and we made this website for our project! We worked together, learned a lot, and had fun building it. This is our big idea, and we hope you like it</p>
      </div>
    </section>
  );
};

export default Contact;
