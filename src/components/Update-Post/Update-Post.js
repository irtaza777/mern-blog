import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import ReactQuill from 'react-quill'; // Import Quill editor for rich text editing
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const Update = () => {


    // State variables for holding post data and image file
    const [posts, setPosts] = useState({});
    const [image, setImage] = useState(null);

    // Hook to get the post ID from the URL parameters
    const params = useParams();
    const navigate = useNavigate();

    // Fetch the post data when the component mounts or the post ID changes
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        const url = `http://localhost:4500/Update-Post/${params.id}`;

        axios.get(url, { headers })
            .then(res => setPosts(res.data))
            .catch(error => console.error('Error fetching post:', error));
    }, [params.id]);

    // Handle form submission to update the post
    const updatePost = (e) => {
        e.preventDefault();

        const headers = {
            authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        const formData = new FormData();
        formData.append('title', posts.title);
        formData.append('body', posts.body);
        if (image) {
            formData.append('image', image);
        }

        axios.put(`http://localhost:4500/Update-Post/${params.id}`, formData, { headers })
            .then(res => {
                console.log('Post updated:', res.data);
                navigate("/Your-Posts"); // Navigate to "Your-Posts" after successful update
            })
            .catch(error => console.error('Error updating post:', error));
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle input field changes for title and body
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPosts({ ...posts, [name]: value });
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header as="h4">Edit post</Card.Header>
                <Card.Body>
                    <Form onSubmit={updatePost}>
                        {/* Hidden inputs for user ID and post ID */}
                        <input type="text" className='inputBox' value={posts.userid} name="userid" hidden />
                        <input type="text" className='inputBox' value={posts._id} name="_id" hidden />

                        {/* Form group for post title */}
                        <Form.Group controlId="formTitle">
                            <Form.Label><b>Blog title</b></Form.Label>
                            <Form.Control
                                type="text"
                                className="form-control m-2"
                                value={posts.title || ''}
                                name="title"
                                onChange={handleInputChange}
                                placeholder="Enter blog title"
                            />
                        </Form.Group>

                        {/* Form group for post body using Quill editor */}
                        <Form.Group controlId="formBody" className="mt-3">
                            <Form.Label><b>Blog body</b></Form.Label>
                            <ReactQuill
                                value={posts.body || ''}
                                onChange={(value) => setPosts({ ...posts, body: value })}
                                placeholder="Enter blog body"
                                className="mb-2"
                            />
                        </Form.Group>

                        {/* Display current image */}
                        <img
                            src={posts.imageUrl}
                            alt="data"
                            className="rounded-top"
                            style={{ maxHeight: '200px', width: '200px', borderRadius: '10px' }}
                        />

                        {/* Form group for image file upload */}
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        {/* Submit button */}
                        <div className="mt-4 text-center">
                            <Button variant="success" type="submit">Update</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Update;
