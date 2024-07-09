import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from 'react-query'
import { useState } from "react";
import axiosInstance from '../../utils/axios';
import Likes from "./Likes";

// first we make a fucn in which we fetch api then in main func we use usequery

const fetchPosts = async () => {
  const response = await axiosInstance.get('/Posts');
  return response.data.post || []; // Ensure posts is an array, even if the response is empty
};

//Main func
const Posts = () => {
  useEffect(()=>{

  },[])
  const [currentPage, setCurrentPage] = useState(1);//current page
  const [postsPerPage] = useState(6); // Number of posts per page
  const [searchTerm, setSearchTerm] = useState(''); // State for search term


  //usequery
  const { data: posts = [], error, isLoading, refetch } = useQuery('posts', fetchPosts, {
    //  cacheTime: 0, // No cache
    //staleTime: 1000 * 60 * 1, // Consider data fresh for 1 minute
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnReconnect: false, // Disable refetch on reconnect
    //refetchInterval: false, // Disable polling
    //enabled: true // You can control this based on certain conditions
  })


  // Logic to paginate posts
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
  const handleRefetch = () => {
    refetch();
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;
  //filtering search on title base
  const filteredPosts = currentPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <div className="container">
        <header className="mb-4">
          <h1 className="text-center">All Posts</h1>
          <div className="row justify-content-center mb-3">
            <div className="col-lg-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search posts..."
                value={searchTerm}

                onChange={searchHandle}
              />
            </div>
          </div>
        </header>
        <div className="row justify-content-center ">

          {
            filteredPosts.length > 0 ? filteredPosts.map((item, index) =>

              <div className="col-lg-4 col-md-4 col-sm-4" key={item._id}>


                <Link  to={"/singlepost/" + item._id} className="custom-link" >
                  <h5   >{item.title}</h5>

                  <p >{item.body}</p>
                </Link>

                <Likes key={`like-${item._id}`} post={item} />
              </div>
            ) : <h1>No posts yet</h1>}
        </div>
        <br></br>
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
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
      </div>
    </div>
  )
}

export default Posts;