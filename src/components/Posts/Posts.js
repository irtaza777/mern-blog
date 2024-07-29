import React, { useEffect, useState } from "react"; // Import React and hooks
import { Link } from "react-router-dom"; // Import Link for navigation
import axiosInstance from '../../utils/axios'; // Import axios instance for API requests
import Likes from "./Likes"; // Import Likes component
import { truncateText } from "../../utils/truncatetext"; // Import truncateText utility function
import { Container, Row, Col, Card, Dropdown, DropdownButton, Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon for icons
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import search icon
import PostContent from "../../utils/dangerousinnerhtml"; // Import PostContent utility function
import '../../Css/Posts/posts.css'; // Import CSS for posts

const Posts = () => {
  const [posts, setPosts] = useState([]); // State for posts
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [postsPerPage] = useState(6); // State for number of posts per page
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const wordLimit = 30; // Set word limit for post content

  // Fetch all posts on component mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Function to fetch all posts
  const fetchAllPosts = async () => {
    console.log(posts.name)
    try {
      const response = await axiosInstance.get('/Posts');
      setPosts(response.data || []); // Ensure posts is an array, even if the response is empty
      console.log(response)
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // Calculate indexes for paginated posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.length > 0 ? posts.slice(indexOfFirstPost, indexOfLastPost) : [];

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle search input change
  const searchHandle = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle selected post change from dropdown
  const handleSelectPost = (postId) => {
    setSelectedPost(postId);
    setCurrentPage(1); // Reset to the first page when a post is selected
  };

  // Filter posts based on search term
  const filteredPosts = currentPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic to display selected post or filtered posts
  const displayPosts = selectedPost ? posts.filter(post => post._id === selectedPost) : filteredPosts;

  return (
    <div>
      <div className="banner" style={{ position: 'relative', color: 'white' }}>
        <img src={'https://res.cloudinary.com/dtjgspe71/image/upload/v1720786259/blog_image_hvjjjz.jpg'} alt="Banner" style={{ width: '100%', height: '444px' }} />
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

          {/* search bar and droptown section */}

          <div className="row mb-3">
            <div className="col-lg-4">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={searchHandle}
                />
                <Button variant="outline-secondary">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </InputGroup>
            </div>
            {/* Dropdown to select a specific post */}
            <div className="col-lg-4">
              <DropdownButton
                id="dropdown-basic-button"
                title={selectedPost ? posts.find(post => post._id === selectedPost)?.title || 'Select a post' : 'All Posts'}
                onSelect={handleSelectPost}
              >
                <Dropdown.Item eventKey={null}>All Posts</Dropdown.Item>
                {posts.map(post => (
                  <Dropdown.Item key={post._id} eventKey={post._id}>{post.title}</Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          </div>
          {/* search bar and droptown section END */}

        </header>
        <div className="row">
          {displayPosts.length > 0 ? displayPosts.map((item) => (
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
                <Card.Footer className="d-flex align-items-center">
                  {item.user && (
                    <>
                      <img
                        className="img-rounded"
                        src={item.user.imageUrl}
                        alt={item.user.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                      <b className="text ml-1">{item.user.name}</b>
                    </>
                  )}
                  <small className="text-muted ml-auto p-2">{new Date(item.createdAt).toLocaleDateString()}</small>
                  <Likes post={item} className="m-2" />
                </Card.Footer>
              </Card>
            </Col>
          )) : <h3>Ooops! </h3>}
        </div>
        {/* pagination */}

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

export default Posts; // Export the Posts component
