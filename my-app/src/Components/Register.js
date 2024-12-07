import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // Import MUI Close icon
import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Styles/Register.css';


const ENDPOINT = process.env.BACKEND_URL || "http://localhost:8000";

function Register({ onClose, onLogin }) {
  const [role, setRole] = useState('Student'); // Default role
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateusername = (username) => {
    const usernameRegex = /^.{1,12}$/;
    return usernameRegex.test(username);
  };
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(userEmail)) {
      setError('Invalid email format. Email should contain "@" with characters before and after.');
      setSuccess('');
      return;
    }

    if (!validateusername(username)) {
      setError('Username can contain at max 12 charecters.');
      setSuccess('');
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      setError(
        'Password must contain a capital letter, a small letter, a number, a special character, and be 8-12 characters long.'
      );
      setSuccess('');
      return;
    }

    // Password confirmation
    if (password !== confirmPassword) {
      setError('Password confirmation does not match the password.');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch(`${ENDPOINT}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          userEmail,
          password,
          role,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError('');
        onLogin();
      } else {
        setError(data.message || 'Registration failed');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess('');
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="close-btn" onClick={onClose}>
          <CloseIcon style={{ fontSize: '24px', color: '#ffffff' }} /> {/* Close Icon */}
        </button>
        <h2 className="login-title">Create a new account</h2>

        {/* Role Selection Buttons */}
        <div className="role-buttons-container">
          <button
            className={`role-button ${role === 'Student' ? 'active' : ''}`}
            onClick={() => handleRoleChange('Student')}
          >
            Student
          </button>
          <button
            className={`role-button ${role === 'Instructor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('Instructor')}
          >
            Instructor
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <div className="password-container" style={{ position: 'relative' }}>
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
              }}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </div>

          <div className="password-container" style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <IconButton
              onClick={togglePasswordVisibility2}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
              }}
            >
              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </div>

          <button type="submit" className="login-button">Register</button>
        </form>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <p className="member-text">
          Already a member? <span className="register-link" onClick={onLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
