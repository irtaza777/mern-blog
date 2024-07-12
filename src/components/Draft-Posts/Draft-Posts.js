import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const DraftPosts = () => {
    const auth = localStorage.getItem('user');
    const id = JSON.parse(auth)._id
    const [posts, setposts] = useState([]);
    const [postsPerPage] = useState(6); // Number of posts per page
    const [searchTerm, setSearchTerm] = useState(''); // State for search term    
    const [currentPage, setCurrentPage] = useState(1);//current page


    useEffect(() => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        const url = `http://localhost:4500/Posts/${id}`;

        axios.get(url, { headers }).then((res) => setposts(res.data.post))


    }, [id])

    const Deletepost = async (id) => {
        console.warn(id)
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        axios.delete(`http://localhost:4500/Posts/${id}`, { headers })
            .then((res) => setposts(res.data))
            window.location.reload();

    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    //checking if posts null or not ans slicing post from start to end
    const currentPosts = posts.length > 0 ? posts.slice(indexOfFirstPost, indexOfLastPost) : [];

    // function to throw on a clicked page from button
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    //function to search a post event based
    const searchHandle = async (event) => {
        setSearchTerm(event.target.value);

    }
    //filtering search on title
    const filteredPosts = currentPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    {/* posts are getting by login, filteredPosts stroes currentPosts stores data(posts)
                        all managed with states*/}


    return (<div className="container" >
        <br></br>
        <h4>Your all posts</h4>
        <br></br>
        {/* Seacrh post section*/}
        <div className="row mb-3">
            <div className="col-lg-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search posts from page..."
                    value={searchTerm}

                    onChange={searchHandle}

                />

            </div>        <Table responsive striped bordered hover>
                <thead>
                    <tr>

                        <th>Title</th>
                        <th>Body</th>
                        <th>Operations</th>



                    </tr>
                </thead>


                <tbody>


                    {
                        filteredPosts.length > 0 ? filteredPosts.map((item, index) =>
                            <tr key={item._id}>


                                <td>{item.title}</td>

                                <td>{item.body}</td>

                                <td> <button class="btn btn-danger" onClick={() => Deletepost(item._id)}>                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                                </td>


                            </tr>

                        ) : <h3>No Drafted posts</h3>
                    }</tbody>
            </Table>
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    <nav>
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button
                                        onClick={() => paginate(index + 1)}
                                        className="page-link"
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div >
        </div ></div >)
}

export default DraftPosts;