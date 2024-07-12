import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PostContent from '../../utils/dangerousinnerhtml';
const SinglePost = () => {
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id;
    const [userid, setId] = useState(uid);
    const [post, setPost] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(false);
    const [isCommentUpdated, setIsCommentUpdated] = useState(false);

    const params = useParams();

    // Add a comment
    const addComment = async () => {
        if (!comment.trim()) {
            setError(true);
            return;
        }
        const data = {
            user: userid,
            comment: comment,
            postId: params.id
        };
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        try {
            await axios.post("http://localhost:4500/singlepost/Add-Comment", data, { headers });
            setIsCommentUpdated(!isCommentUpdated);
            setComment('');
            setError(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Delete a comment
    const deleteComment = async (id) => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        try {
            await axios.delete(`http://localhost:4500/Comments/${userid}/${params.id}/${id}`, { headers });
            setIsCommentUpdated(!isCommentUpdated);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch single post details
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        axios.get(`http://localhost:4500/singlepost/${params.id}`, { headers })
            .then(res => setPost(res.data))
            .catch(err => console.error(err));
    }, [params.id]);

    // Fetch comments
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        axios.get(`http://localhost:4500/singlepost/Comments/${params.id}`, { headers })
            .then(res => setComments(res.data))
            .catch(err => console.error(err));
    }, [isCommentUpdated]);

    return (
        <div className="container my-5">
            <div className="row mb-4">
                <div className="col-lg-8">
                    <h1 className="display-4 mb-4">{post.title}</h1>
                    <p className="lead"><PostContent content={post.body}/></p>
                    Posted on:<b style={{marginLeft:'2px',fontStyle:'italic'}}>{post.createdAt}</b>

                    
                </div>
            </div>

            <div className="row mb-4" style={{ backgroundColor: '#f8f9fa', paddingTop: '20px', borderRadius: '10px' }}>
                <div className="col-lg-8">
                    <h4>Add a Comment</h4>
                    <textarea
                        className="form-control mb-3"
                        rows="1"
                        placeholder="Write your comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    {error && !comment.trim() && <div className="text-danger mb-2">Please enter a comment.</div>}
                    <button
                        onClick={addComment}
                        className="btn btn-primary"
                    >
                        Add Comment
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <h4>Comments</h4>
                    {comments.length > 0 ? (
                        comments.map((item) => (
                            <div key={item._id} className="d-flex justify-content-between align-items-center mb-3" style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '8px' }}>
                                <p className="mb-0">{item.comment}</p>
                                <button
                                    onClick={() => deleteComment(item._id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SinglePost;
