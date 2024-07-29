import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PostContent from "../../utils/dangerousinnerhtml";
const DraftPosts = () => {
    const auth = localStorage.getItem('user');
    const id = JSON.parse(auth)._id; // Extract user id from localStorage
    const [posts, setPosts] = useState([]); // State to hold fetched posts
    const [postsPerPage] = useState(6); // Number of posts per page
    const [searchTerm, setSearchTerm] = useState(''); // State for search term    
    const [currentPage, setCurrentPage] = useState(1); // Current page number

    // Fetch posts on component mount or when user id changes
    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };
        const url = `http://localhost:4500/Posts/${id}`;

        axios.get(url, { headers })
            .then((res) => setPosts(res.data.post || [] )) // Set fetched posts to state
            .catch((error) => console.error('Error fetching posts:', error));
    }, [id]); // Dependency array ensures useEffect runs when id changes

    // Function to delete a post
    const deletePost = async (postId) => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        };

        axios.delete(`http://localhost:4500/Posts/${postId}`, { headers })
            .then((res) => setPosts(res.data)) // Update posts state after deletion
            .catch((error) => console.error('Error deleting post:', error));

        window.location.reload(); // Refresh page after deletion (consider better UX alternatives)
    }

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.length > 0 ? posts.slice(indexOfFirstPost, indexOfLastPost) : [];

    // Function to handle search term change
    const searchHandle = (event) => {
        setSearchTerm(event.target.value);
    }

    // Filter posts based on search term
    const filteredPosts = currentPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <br />
            <h4>Your Drafted Posts</h4>
            <br />
            {/* Search post section */}
            <div className="row mb-3">
                <div className="col-lg-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={searchHandle}
                    />
                </div>
            </div>
            {/* Table of drafted posts */}
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Body</th>
                        <th>Banner image</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredPosts.length > 0 ?
                            filteredPosts.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>                                
                                        <PostContent content={item.body} />
                                    </td>
                                    <td><img
                                variant="top"
                                src={item.imageUrl}
                                alt="data"
                                className="rounded-top"
                                style={{ maxHeight: '200px', width: '200px', borderRadius: '10px' }}
                            /></td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => deletePost(item._id)}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            )) :
                            <tr>
                                <td colSpan="3"><h3>No Drafted posts</h3></td>
                            </tr>
                    }
                </tbody>
            </Table>
            {/* Pagination */}
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button
                                        onClick={() => setCurrentPage(index + 1)}
                                        className="page-link"
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default DraftPosts;
