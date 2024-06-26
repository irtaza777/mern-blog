import React from "react";

import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

//stateless func comp
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const auth = localStorage.getItem('user');

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/Register");
  }

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    
<div>
  
    <nav className="navbar navbar-expand-lg navbar-light bg-dark">

      <ul className="navbar-nav nav-ul">
        <li className="nav-item nav-link">        
         <Link to="/Home">Home</Link>
        </li>
        <li className="nav-item nav-link">        

          <Link to="/Posts">Posts</Link>
        </li>
        <li className="nav-item nav-link">        
          <Link to="/Add-Post">Add posts</Link>
        </li>
        <li className="nav-item nav-link">
          <Link to="/Your-Posts">Your posts</Link>
        </li>
        <li className="nav-item nav-link">
          <Link to="/Draft-Posts">Drafted posts</Link>
        </li>
        
        

        <li className="nav-item nav-link">       
          {auth ? <Link onClick={logout} to="/Register"><span className="logout-button"> Logout ({JSON.parse(auth).name}) </span> </Link> :

                <Link to="/Login">Login</Link>}

        </li>
      </ul>
    </nav>
    </div>

  );
};

export default NavBar;
