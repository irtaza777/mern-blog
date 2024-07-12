import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PostContent from '../../utils/dangerousinnerhtml';
//user auth
const auth = localStorage.getItem('user');
const id = auth && JSON.parse(auth)._id
const name = auth && JSON.parse(auth).name

// First we make an independent func in which we put our fetch api for posts of single user logged in
//then in main func we use usequery to fetch
const fetchYourpost = async () => {

    //Api for fetching post on user id base
    const headers = {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

    };
    //id is here is of user id fetch data of that user only who is logged in
    const url = `http://localhost:4500/Your-Posts/${id}`;

    const response = await axios.get(url, { headers });
    return response.data.post // in backend we did post in 2nd resp after showing messaage




};
// Main funcion
const YourPosts = () => {
    const [currentPage, setCurrentPage] = useState(1);//current page
    const [postsPerPage] = useState(6); // Number of posts per page
    const [searchTerm, setSearchTerm] = useState(''); // State for search term    

    const [currentUserPosts, setCurrentUserPosts] = useState([]);



    // delete only that post with all comments of it
    const Deletepost = async (pid) => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };

        axios.delete(`http://localhost:4500/Poosts/${pid}`, { headers })
            .then((res) => setCurrentUserPosts(res.data))
        window.location.reload();
    }
    //delete allpost func and api
    const Deleteall = async () => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };

        //deleting on userid
        axios.delete(`http://localhost:4500/DELUPosts/${id}`, { headers })
            .then((res) => setCurrentUserPosts(res.data))
        window.location.reload();

    }
    //usequery

    const { data, isLoading, error } = useQuery('fetchData', fetchYourpost, {
        //staleTime: 60000, // for this time data is considered fresh no reload
        //cacheTime: 300000, // 5 minutes data is in cahche

    })
    //console.log(data)
    if (isLoading) {
        return <h1>Loading ....</h1>;
    }

    if (error) {
        return <p className="error">{error.message}</p>;
    }

    // Logic to paginate posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    //checking if posts null or not ans slicing post from start to end
    const currentPosts = data.length > 0 ? data.slice(indexOfFirstPost, indexOfLastPost) : [];

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


    return (< div className="container" >
        <br></br>
        <h4>{name} : Your all posts</h4>
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

            </div>
            {/* Seacrh icon section*/}

            <div className="col-lg-4" >

                <FontAwesomeIcon icon={faSearch} />
            </div>
            {/* Seacrh icon section ENDS*/}

        </div>
        {/* Seacrh post section ENDS*/}

        {/* Table of yourpost section*/}

        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Body</th>
                    <th>Banner image</th>

                    <th>Operations</th>


                </tr>
            </thead>


            <tbody>

                {/* look, posts are searched on pagination base (currentPosts) 
        then that logic is in our data var. All handeled with states*/}

                {

                    filteredPosts.length > 0 ? filteredPosts.map((item, index) =>
                        <tr>
                            <td>{item.title}</td>
                            <td>
                    <PostContent content={item.body} />
                      </td>
                            <td><img
                      variant="top"
                      src={item.imageUrl}
                      alt="data"
                      className="rounded-top"
                      style={{ maxHeight: '200px',width:'200px', borderRadius: '10px' }}
                    /></td>
                            <td>
                                <Link to={`/Update-Post/${item._id}`}>
                                    <button className="btn btn-success m-2">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </Link>
                                <button className="btn btn-danger m-2" onClick={() => Deletepost(item._id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </td>


                        </tr>

                    )
                        : <h1>No post found</h1>}
                {/* ENDS*/}
            </tbody>
        </Table>
        {/* Table of yourpost section ENDs*/}

        {/* All your posts delete button section*/}

        <button className="btn btn-danger " onClick={() => Deleteall()}>Delete All</button>
        {/* All your posts delete button section END*/}

        {/* pagination button and its logic*/}

        <div className="row justify-content-center">
            <div className="col-lg-12">
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(data.length / postsPerPage) }, (_, index) => (
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
        </div>
        {/* pagination button and its logic ENDS*/}

    </div >);
}

export default YourPosts;


