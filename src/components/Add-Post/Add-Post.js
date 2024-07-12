import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const AddPost = () => {
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id;
    const [userid, setId] = useState(uid);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const addPost = async () => {
        if (!title || !body || !image) {
            setError("Please fill in all required fields and upload an image.");
            return false;
        }

        const formData = new FormData();
        formData.append('userid', userid);
        formData.append('title', title);
        formData.append('body', body);
        formData.append('draft', false);
        formData.append('image', image);

        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const headers = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            const url = "http://localhost:4500/Add-Post";
            const res = await axios.post(url, formData, headers);
            console.log(res.data);
            alert("Congratulations! Your post has been published.");
            navigate("/Posts");
        } catch (error) {
            console.error('Error publishing post:', error);
            setError("Failed to publish post. Please try again later.");
        }
    };

    const addDraft = async () => {
        if (!title || !body) {
            setError("Please fill in all required fields.");
            return false;
        }

        const data = {
            userid,
            title,
            body,
            draft: true
        };

        try {
            const token = JSON.parse(localStorage.getItem('token'));
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const url = "http://localhost:4500/Add-Post";
            const res = await axios.post(url, data, { headers });
            console.log(res.data);
            alert("Draft saved successfully.");
        } catch (error) {
            console.error('Error saving draft:', error);
            setError("Failed to save draft. Please try again later.");
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
                            <Form.Label>Title</Form.Label>
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
                            <Form.Label>Body</Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={body}
                                onChange={setBody}
                                placeholder="Enter blog content"
                                style={{ height: '200px' }} // Set height of the editor
                            />
                            {error && !body && <span style={{ color: "red" }}>Please enter blog content.</span>}
                        </Form.Group>
                        <br></br>
                        <br></br>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
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

export default AddPost;
