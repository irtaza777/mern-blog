import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();
    useEffect(() => {

        const auth = localStorage.getItem('user');
        //console.log(auth)
        if (auth) {
            navigate('/Home')
        }
    })

    const handleLogin = async () => {
        //console.warn("email,password", email, password)
        let result = await fetch('http://localhost:3000/users', {


            method: "post",
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }

        })
        result = await result.json();
    console.warn(result)
        if (result.auth) {
            localStorage.setItem("user", JSON.stringify(result.user));

            navigate('/Home');

        }
        else { alert("Please enter correct details") }
    }
    return (
        <div>
                <h1>Login</h1>

                <input type="text" className="inputBox" placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)} value={email} />
                <input type="password" className="inputBox" placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)} value={password} />
                    
                <button onClick={handleLogin} className="appButton" type="button">Login</button>
            </div>
    );
}
 
export default Login;