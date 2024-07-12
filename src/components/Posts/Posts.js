import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../../utils/axios';
import Likes from "./Likes";
import { truncateText } from "../../utils/truncatetext";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import PostContent from "../../utils/dangerousinnerhtml"; // to get innerhtml text in rich text
import '../../Css/Posts/posts.css'
// Main func
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // current page
  const [postsPerPage] = useState(6); // Number of posts per page
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const wordLimit = 30; // Set your desired word limit here

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axiosInstance.get('/Posts');
      setPosts(response.data || []); // Ensure posts is an array, even if the response is empty
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // Logic to paginate posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // checking if posts null or not and slicing post from start to end
  const currentPosts = posts.length > 0 ? posts.slice(indexOfFirstPost, indexOfLastPost) : [];

  // function to throw on a clicked page from button
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // function to search a post event based
  const searchHandle = (event) => {
    setSearchTerm(event.target.value);
  };

  // filtering search on title
  const filteredPosts = currentPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="banner" style={{ position: 'relative', color: 'white' }}>
        <img src={require('../../assests/blog_image.jpg')} alt="Banner" style={{ width: '100%', height: '444px' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Link to="/Add-Post" className="btn btn-primary btn-lg">Add New Post</Link>
          <p className="mt-2" style={{ color: 'black', fontSize: '22px' }}>
            We like articles that fit within the self-development genre: Motivation, Success, Inspiration, Spirituality, and Life
          </p>
        </div>
      </div>
      <div className="container">
        <header className="mb-4 mt-4">
          <h2>All Posts</h2>
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
            <div className="col-lg-4">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
        </header>
        <div className="row">
          {filteredPosts.length > 0 ? filteredPosts.map((item) => (
            <Col key={item._id} lg={3} md={6} sm={12} className="mb-4">
              <Card className="h-100 shadow-sm">
                {item.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={item.imageUrl}
                    alt="Post image"
                    className="rounded-top"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    <PostContent content={truncateText(item.body, wordLimit)} />
                  </Card.Text>
                  <Link to={`/singlepost/${item._id}`} className="btn btn-primary mt-auto">
                    Read more
                  </Link>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</small>
                  <Likes post={item} />
                </Card.Footer>
              </Card>
            </Col>
          )) : <h1>No posts yet</h1>}
        </div>
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
  );
};

export default Posts;
