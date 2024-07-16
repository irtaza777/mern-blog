import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';

const Update = () => {
    const auth = localStorage.getItem('user');
    const id = JSON.parse(auth)._id;

    const [posts, setPosts] = useState({});
    const [image, setImage] = useState(null);

    const params = useParams();
    const navigate = useNavigate();

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
                navigate("/Your-Posts");
            })
            .catch(error => console.error('Error updating post:', error));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

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
                        <input type="text" className='inputBox' value={posts.userid} name="userid" hidden />
                        <input type="text" className='inputBox' value={posts._id} name="_id" hidden />

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

                        <Form.Group controlId="formBody" className="mt-3">
                            <Form.Label><b>Blog body</b></Form.Label>
                            <Form.Control
                                as="textarea"
                                className="form-control m-2"
                                cols="5"
                                rows="13"
                                value={posts.body || ''}
                                name="body"
                                onChange={handleInputChange}
                                placeholder="Enter blog body"
                            />
                        </Form.Group>

                        <img
                            src={posts.imageUrl}
                            alt="data"
                            className="rounded-top"
                            style={{ maxHeight: '200px', width: '200px', borderRadius: '10px' }}
                        />

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

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
