import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUpload } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  // State hooks for form fields and error handling
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  // Redirect to login if user is already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/Login');
    }
  }, [navigate]);

  // Handle form submission
  const handleRegister = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!name || !email || !password || !image) {
      setError(true);
      return;
    }

    // Create a FormData object to send form data including the image
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    try {
      // Send form data to the server
      const res = await axios.post('http://localhost:4500/Register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
       
      });

      // Store user data in local storage and navigate to login
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.clear(); // Clear user authentication data from localStorage

      navigate('/Login');
    } catch (error) {
      console.error('Registration error', error);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg p-4 rounded">
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleRegister}>
              {/* Name input field */}
              <div className="form-group mb-3">
                <label htmlFor="name" className="form-label">
                  <FontAwesomeIcon icon={faUser} /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {error && !name && <div className="text-danger">Please enter your name</div>}
              </div>

              {/* Email input field */}
              <div className="form-group mb-3">
                <label htmlFor="email" className="form-label">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && !email && <div className="text-danger">Please enter your email</div>}
              </div>

              {/* Password input field */}
              <div className="form-group mb-3">
                <label htmlFor="password" className="form-label">
                  <FontAwesomeIcon icon={faLock} /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && !password && <div className="text-danger">Please enter your password</div>}
              </div>

              {/* Image upload field */}
              <div className="form-group mb-4">
                <label htmlFor="image" className="form-label">
                  <FontAwesomeIcon icon={faUpload} /> Profile Picture
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="form-control"
                  onChange={(e) => setImage(e.target.files[0])}
                  required
                />
                {error && !image && <div className="text-danger">Please upload an image</div>}
              </div>

              {/* Submit button */}
              <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
