import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../../Css/Navbar/NavBar.css'; // Ensure you import the CSS file

const NavBar = () => {
  const auth = JSON.parse(localStorage.getItem('user')); // Retrieve user authentication details from localStorage
  const navigate = useNavigate(); // Hook from react-router-dom for navigation
  
  // Function to handle logout
  const logout = () => {
    localStorage.clear(); // Clear user authentication data from localStorage
    navigate("/"); // Navigate the user to the home page after logout
  };

  return (
    <div>
      {/* Bootstrap navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* Navbar toggler for mobile view */}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            {/* Navigation links */}
            <li className="nav-item">
              <Link className="nav-link" to="/Posts">Posts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Add-Post">Add posts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Your-Posts">Your posts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Draft-Posts">Drafted posts</Link>
            </li>
            {/* Conditional rendering based on user authentication */}
            <li className="nav-item">
              {auth ? (
                // If user is authenticated, display logout button and profile image
                <div className="nav-item-content">
                  <Link onClick={logout} to="/" className="logout-link">
                    <span className="logout-button">Logout ({auth.name})</span>
                  </Link>
                  {/* Display user's profile image if available */}
                  {auth.imageUrl && (
                    <img
                      className="img-rounded"
                      src={auth.imageUrl}
                      alt="Profile"
                    />
                  )}
                </div>
              ) : (
                // If user is not authenticated, display login link
                <Link className="nav-link" to="/Login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
