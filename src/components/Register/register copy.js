import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {

    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/Home')
    }
  })
  const handleregister = async () => {
    console.warn(name, email, password);

    let result = await fetch("http://localhost:3000/users", {
      method: "post",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.warn(result);
  localStorage.setItem("user", JSON.stringify(result));


    navigate('/Home')
  };
  return (
    <div>
      <br></br>
      <h1>Register yourself</h1>

            <h1>Register</h1>
            <input
              required
              className="inputBox"
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              required
              className="inputBox"
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              className="inputBox"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleregister} className="appButton" type="button">
              Sign Up
            </button>
          </div>
  );
};

export default Register;
