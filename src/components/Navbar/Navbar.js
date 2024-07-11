import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../../Css/Navbar/NavBar.css'; // Ensure you import the CSS file

const NavBar = () => {
  const auth = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    navigate("/Register");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
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
            <li className="nav-item">
              {auth ? (
                <div className="nav-item-content">
                  <Link onClick={logout} to="/Register" className="logout-link">
                    <span className="logout-button">Logout ({auth.name})</span>
                  </Link>
                  {auth.imageUrl && (
                    <img
                      className="img-rounded"
                      src={auth.imageUrl}
                      alt="Profile"
                    />
                  )}
                </div>
              ) : (
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
