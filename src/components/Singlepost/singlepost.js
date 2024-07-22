import React, { useState, useEffect } from 'react'; // Import React and hooks
import { useParams } from 'react-router-dom'; // Import useParams hook for accessing route parameters
import axios from 'axios'; // Import axios for HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for icons
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import trash icon
import PostContent from '../../utils/dangerousinnerhtml'; // Import PostContent utility function

const SinglePost = () => {
    // Retrieve user ID from local storage and set it in state
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id;
    const [userid, setId] = useState(uid);
    
    // Define state variables for post, comments, and form inputs
    const [post, setPost] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(false);
    const [isCommentUpdated, setIsCommentUpdated] = useState(false);
    
    // Access the post ID from the URL parameters
    const params = useParams();

    // Function to add a comment
    const addComment = async () => {
        // Check if the comment is empty
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
            // Send POST request to add a comment
            await axios.post("http://localhost:4500/singlepost/Add-Comment", data, { headers });
            setIsCommentUpdated(!isCommentUpdated); // Toggle comment update state
            setComment(''); // Clear the comment input
            setError(false); // Clear the error state
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
            // Send DELETE request to delete a comment
            await axios.delete(`http://localhost:4500/Comments/${userid}/${params.id}/${id}`, { headers });
            setIsCommentUpdated(!isCommentUpdated); // Toggle comment update state
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch single post details on component mount and when params.id changes
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        axios.get(`http://localhost:4500/singlepost/${params.id}`, { headers })
            .then(res => setPost(res.data))
            .catch(err => console.error(err));
    }, [params.id]);

    // Fetch comments on component mount and when isCommentUpdated changes
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        axios.get(`http://localhost:4500/singlepost/Comments/${params.id}`, { headers })
            .then(res => setComments(res.data))
            .catch(err => console.error(err));
    }, [isCommentUpdated,params.id]);

    return (
        <div className="container my-5">
            <div className="row mb-4">
                <div className="col-lg-8">
                    <h1 className="display-4 mb-4">{post.title}</h1>
                    <img
                    src={post.imageUrl}
                    alt="singlePost image"
                    className="rounded-top"
                    style={{ width: '1100px',maxHeight:'400px' }}
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

export default SinglePost; // Export the SinglePost component
