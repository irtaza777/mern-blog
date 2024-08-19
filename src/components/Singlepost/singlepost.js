import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import PostContent from '../../utils/dangerousinnerhtml';

const SinglePost = () => {
    // Retrieve the user ID from localStorage and set it in state
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id;
    const [userid, setId] = useState(uid);
    
    // State variables for the post, comments, comment input, and error handling
    const [post, setPost] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(false);
    const [isCommentUpdated, setIsCommentUpdated] = useState(false);
    
    // State variables for editing comments
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    
    // Get the post ID from the URL parameters
    const params = useParams();

    // Function to add a new comment
    const addComment = async () => {
        if (!comment.trim()) {
            setError(true); // Show error if comment is empty
            return;
        }

        const data = {
            user: userid,       // Current user's ID
            comment: comment,   // Comment text
            postId: params.id   // Current post ID
        };
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        try {
            // Send POST request to add the comment
            await axios.post("http://localhost:4500/singlepost/Add-Comment", data, { headers });
            setIsCommentUpdated(!isCommentUpdated); // Toggle to trigger re-fetch of comments
            setComment(''); // Clear the comment input
            setError(false); // Reset the error state
        } catch (err) {
            console.error(err);
        }
    };

    // Function to delete a comment
    const deleteComment = async (id) => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        try {
            // Send DELETE request to remove the comment
            await axios.delete(`http://localhost:4500/Comments/${userid}/${params.id}/${id}`, { headers });
            setIsCommentUpdated(!isCommentUpdated); // Toggle to trigger re-fetch of comments
        } catch (err) {
            console.error(err);
        }
    };

    // Function to edit a comment
    const editComment = async (id) => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        try {
            const data = { comment: editingCommentText }; // Updated comment text
            // Send PUT request to update the comment
            await axios.put(`http://localhost:4500/Comments/${userid}/${params.id}/${id}`, data, { headers });
            setIsCommentUpdated(!isCommentUpdated); // Toggle to trigger re-fetch of comments
            cancelEdit(); // Exit edit mode
        } catch (err) {
            console.error(err);
        }
    };

    // Function to start editing a comment
    const startEditing = (id, text) => {
        setEditingCommentId(id); // Set the ID of the comment being edited
        setEditingCommentText(text); // Set the text of the comment being edited
    };

    // Function to cancel editing a comment
    const cancelEdit = () => {
        setEditingCommentId(null); // Clear the edit comment ID
        setEditingCommentText(''); // Clear the editing comment text
    };

    // Fetch post details on component mount and when params.id changes
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        // Fetch the details of the single post
        axios.get(`http://localhost:4500/singlepost/${params.id}`, { headers })
            .then(res => setPost(res.data)) // Set the fetched post data in state
            .catch(err => console.error(err));
    }, [params.id]);

    // Fetch comments on component mount and when isCommentUpdated or params.id changes
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        // Fetch the comments related to the post
        axios.get(`http://localhost:4500/singlepost/Comments/${params.id}`, { headers })
            .then(res => setComments(res.data)) // Set the fetched comments in state
            .catch(err => console.error(err));
    }, [isCommentUpdated, params.id]);

    return (
        <div className="container my-5">
            <div className="row mb-4">
                <div className="col-lg-8">
                    <h1 className="display-4 mb-4">{post.title}</h1>
                    <img
                    src={post.imageUrl}
                    alt="singlePost image"
                    className="rounded-top"
                    style={{ width: '1100px', maxHeight: '400px' }}
                  />
                  <br></br>
                    <p className="lead"><PostContent content={post.body}/></p>
                    Posted on:<b style={{marginLeft:'2px',fontStyle:'italic'}}>{post.createdAt}</b>
                    <br></br>
                    Likes:<b style={{marginLeft:'2px',fontStyle:'normal'}}>{post.likeCount}</b>
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
                                {editingCommentId === item._id ? (
                                    // If the comment is being edited, show a textarea with save and cancel buttons
                                    <div className="w-100">
                                        <textarea
                                            className="form-control mb-2"
                                            rows="1"
                                            value={editingCommentText}
                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                        />
                                        <button
                                            onClick={() => editComment(item._id)}
                                            className="btn btn-success btn-sm mr-2"
                                        >
                                            <FontAwesomeIcon icon={faSave} /> Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <FontAwesomeIcon icon={faTimes} /> Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="mb-0">{item.comment}</p>
                                        {/* Show edit and delete buttons only if the comment belongs to the logged-in user */}
                                        {item.userid === userid && (
                                            <div>
                                                <button
                                                    onClick={() => startEditing(item._id, item.comment)}
                                                    className="btn btn-warning btn-sm mr-2"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                                <button
                                                    onClick={() => deleteComment(item._id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
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
