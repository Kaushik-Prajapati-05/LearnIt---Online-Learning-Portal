import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close'; // Import MUI Close icon
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Styles/Login.css';


function Login({ onClose, onRegister }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
 
      if (response.ok) {
        setError('');
        console.log('Logged in successfully');
       
        const userRole = data.data.user?.role;  
        console.log('User role:', userRole);  
 
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(data.data.user));
        localStorage.setItem('userRole', userRole);
 
        onClose();
 
        // Redirect based on the role
        if (userRole === 'Instructor') {
          navigate('/instructor-dashboard');
        } else {
           navigate('/profile');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };


  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon style={{ fontSize: '24px', color: '#ffffff' }} /> {/* Close Icon */}
        </button>
        <h2 className="login-title">Login to your account</h2>


        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-container">
          <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <IconButton
        onClick={togglePasswordVisibility}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'white',
          }}>
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>


        {error && <p className="error-text">{error}</p>}
       
        <p className="member-text">
          Not a member yet? <span className="register-link" onClick={onRegister}>Register</span>
        </p>
      </div>
    </div>
  );
}


export default Login;
