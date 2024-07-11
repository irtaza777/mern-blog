import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axiosInstance from '../../utils/axios';
import Likes from "./Likes";
import { truncateText } from "../../utils/truncatetext";
// first we make a fucn in which we fetch api then in main func we use usequery


//Main func
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);//current page
  const [postsPerPage] = useState(6); // Number of posts per page
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const wordLimit = 50; // Set your desired word limit here



  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axiosInstance.get('/Posts');
      setPosts(response.data|| []); // Ensure posts is an array, even if the response is empty
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

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
  //filtering search on title
  const filteredPosts = currentPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div class="container">
        <header class="mb-4">
          <h1 class="text-center">All Posts</h1>
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
        <div class="row  ">

          {
            filteredPosts.length > 0 ? filteredPosts.map((item, index) =>

              <div style={{ padding: '11px' }} class="col-lg-3 col-md-4 col-sm-4" key={item._id}>


                <Link to={"/singlepost/" + item._id} className="custom-link" >
                  {item.imageUrl && (
                    <>
                      <img className="img-responsive" style={{ maxHeight: '300px', width: '100%', objectFit: 'cover', borderRadius: '30px' }}

                        src={item.imageUrl}
                        alt="Post"

                      />
                    </>
                  )}
                  <h5>{item.title}</h5>

                  <p>{truncateText(item.body, wordLimit)}</p>



                </Link>
                <p>{item.createdAt}</p>

                <Likes key={item._id} post={item} />
              </div>
            ) : <h1>No posts yet</h1>}

        </div>
        <br></br>
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
        </div>
      </div>
    </div>
  )
}

export default Posts;