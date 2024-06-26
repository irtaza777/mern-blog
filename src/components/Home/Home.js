import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Home = () => {
    return (

        <Container>
        <h1 classname="text-red-400">Welcome to Blog Panel</h1>

            Write a blog, but first you have to <Link to="/Login">Login</Link> yourself
        </Container>
     );
}

export default Home;