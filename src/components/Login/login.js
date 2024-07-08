import React from "react";
import { useNavigate } from 'react-router-dom'
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
   

    const handleLogin = async (e) => {
        e.preventDefault();//preventing default refersh of form 
      
       
        let result = await fetch('http://localhost:4500/Login', {


            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }

        })
        result = await result.json();
        // console.warn(result.email)
        if (result.auth) {
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", JSON.stringify(result.auth));

            navigate('/Posts');

        }
        else { alert("Please enter correct details") }

    }
    return (
        <div>
            <Container>
            
                <h1>Login</h1>
                <form onSubmit={handleLogin} >
                    <input type="text" className="form-control m-2" rows="2" cols="5" placeholder='Enter Email'
                        onChange={(e) => setEmail(e.target.value)} value={email} required />

                    <input type="password" className="form-control m-2" placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)} value={password} required />
                    
                    <button className="btn btn-success" type="submit">Login</button>
                </form>
                <br></br>

                Have,nt resgisterd yet <Link to="/Register">Register</Link> yourself
            </Container>
        </div>


    );
}

export default Login;