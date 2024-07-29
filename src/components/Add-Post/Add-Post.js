import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import ReactQuill from 'react-quill'; // Import ReactQuill for rich text editor
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS

const AddPost = () => {
    // Retrieve user ID from local storage and set it in state
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id;
    const [userid, setId] = useState(uid);
    
    // Define state variables for form inputs and error handling
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    
    // Use useNavigate hook for navigation
    const navigate = useNavigate();

    // Handle image file selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Function to add a new post
    const addPost = async () => {
        // Validate required fields
        if (!title || !body || !image) {
            setError("Please fill in all required fields and upload an image.");
            return false;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('userid', userid);
        formData.append('title', title);
        formData.append('body', body);
        formData.append('draft', false);
        formData.append('image', image);

        try {
            // Prepare headers with authorization token
            const token = JSON.parse(localStorage.getItem('token'));
            const headers = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            // Send POST request to add the post
            const url = "http://localhost:4500/Add-Post";
            const res = await axios.post(url, formData, headers);
            console.log(res.data);
            alert("Congratulations! Your post has been published.");
            navigate("/Posts"); // Navigate to the posts page
        } catch (error) {
            console.error('Error publishing post:', error);
            setError("Failed to publish post. Please try again later.");
        }
    };

    // Function to save a draft post
    const addDraft = async () => {
        // Validate required fields
        if (!title || !body || !image) {
            setError("Please fill in all required fields and upload an image.");
            return false;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('userid', userid);
        formData.append('title', title);
        formData.append('body', body);
        formData.append('draft', true);
        formData.append('image', image);

        try {
            // Prepare headers with authorization token
            const token = JSON.parse(localStorage.getItem('token'));
            const headers = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            // Send POST request to add the post
            const url = "http://localhost:4500/Add-Post";
            const res = await axios.post(url, formData, headers);
            console.log(res.data);
            alert("Drafted");
            navigate("/Draft-Posts"); // Navigate to the posts page
        } catch (error) {
            console.error('Error publishing post:', error);
            setError("Failed to publish post. Please try again later.");
        }
    };


    return (
        <Container className="mt-4">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">Write a Blog Post</h2>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Title</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter blog title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                isInvalid={!!error && !title}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a blog title.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Body</b></Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={body}
                                onChange={setBody}
                                placeholder="Enter blog content"
                                style={{ height: '400px' }} // Set height of the editor
                            />
                            {error && !body && <span style={{ color: "red" }}>Please enter blog content.</span>}
                        </Form.Group>
                        <br></br>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Image</b></Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                                isInvalid={!!error && !image}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please choose a blog image.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" onClick={addPost} className="me-2">
                            Publish
                        </Button>
                        <Button variant="danger" onClick={addDraft}>
                            Save Draft
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddPost; // Export the AddPost component
