import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false)//setting errors for wrong inputs;
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    //user auth
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/Login')
    }

  })
  const handleRegister = async (event) => {
    event.preventDefault();

    if (!name || !email || !password || !image) {
      setError(true);
      return false;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:4500/Register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.clear();
      navigate('/Login');
    } catch (error) {
      console.error('Registration error', error);
    }
  };

  return (
    <div className="container">

      <br></br>
      <h1>Register yourself</h1>
      <form onSubmit={handleRegister} >
        <input type="text" name="name" className="form-control m-2" placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} required/>
            {error && !name && <span style={{color:"red"}}>Enter name</span>}

        <br></br>

        <input type="text" name="email" className="form-control m-2" placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} required  />
            {error && !email && <span style={{color:"red"}}>Enter email</span>}

        <br></br>

        <input type="password"   name="password" className="form-control m-2" placeholder="Enter 8 digits Password)"
          value={password}
          onChange={(e) => setPassword(e.target.value)} required />
            {error && !password && <span style={{color:"red"}}>Enter password</span>}

      <br></br>
      <input
          type="file"
          name="image"
          className="form-control m-2"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        {error && !image && <span style={{ color: "red" }}>Upload an image</span>}
<br></br>        

    <button  type="submit" class="btn btn-success">Sign up</button>
    </form></div>
  );
};

export default Register;
