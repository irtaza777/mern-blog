import React, { useState } from "react"; // Import React and useState hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            // Send login request to the server
            let response = await fetch('http://localhost:4500/Login', {
                method: "POST",
                body: JSON.stringify({ email, password }), // Send email and password in the request body
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                }
            });

            let result = await response.json(); // Parse the JSON response

            if (result.auth) {
                // If authentication is successful, store user info and token in local storage
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("token", JSON.stringify(result.auth));
                navigate('/Posts'); // Navigate to the Posts page
            } else {
                setError("Invalid email or password"); // Set error message if authentication fails
            }
        } catch (err) {
            setError("An error occurred. Please try again."); // Set error message if request fails
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <div className="text-center mb-4">
                        <h1 className="mb-3">Login</h1>
                        <p className="lead">Access your account to add & manage your posts.</p>
                    </div>
                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>} {/* Display error message if there is one */}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p>Don't have an account? <a href="/Register">Register here</a></p> {/* Link to the Register page */}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login; // Export the Login component
