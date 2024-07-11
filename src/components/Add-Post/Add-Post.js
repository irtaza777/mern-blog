import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const AddPost = () => {
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id;
    const [userid, setId] = useState(uid);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const addPost = async () => {
        if (!title || !body || !image) {
            setError(true);
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
            alert("Failed to publish post. Please try again later.");
        }
    };

    const addDraft = async () => {
        if (!title || !body) {
            setError(true);
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
            alert("Failed to save draft. Please try again later.");
        }
    };

    return (
        <div>
            <br></br>
            <Container>
                <h2>Write a Blog</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <input type="text" className="form-control" value={userid} onChange={(e) => setId(e.target.value)} hidden />
                    </div>

                    <br></br>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Blog Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        {error && !title && <span style={{ color: "red" }}>Please enter a blog title.</span>}
                    </div>
                    <br></br>

                    <div className="form-group">
                        <textarea className="form-control" placeholder="Blog Body" rows="13" value={body} onChange={(e) => setBody(e.target.value)} required></textarea>
                        {error && !body && <span style={{ color: "red" }}>Please enter blog content.</span>}
                    </div>
                    <br></br>

                    <div className="form-group">
                        <label>Image:</label>
                        <input type="file" onChange={handleImageChange} required />
                        {error && !image && <span style={{ color: "red" }}>Please choose blog image.</span>}

                    </div>
                    <br></br>

                    <button type="button" className="btn btn-primary" onClick={addPost}>Publish</button>
                    <button type="button" className="btn btn-danger m-2" onClick={addDraft}>Save Draft</button>
                </form>
            </Container>
        </div>
    );
};

export default AddPost;
