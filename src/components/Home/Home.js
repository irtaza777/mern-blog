import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../Css/Home/home.css'; // Assuming you have custom CSS for additional styling

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section text-center">
        
      </div>
      <br></br>
      <Container>
          <h className="hero-title" >Welcome to Blog Panel</h>
          <p className="hero-subtitle">Write a blog, Let yourself get login by clicking on here... </p>
          <Link to="/Login">    <Button variant="primary" size="lg" className="mt-4">Get Started</Button></Link>
        </Container>

          {/* About Us Section */}
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <h2 className="text-center mb-4">About Us</h2>
            <p>
              At Blog Panel, we believe in the power of sharing knowledge and experiences. Our platform is designed to provide a seamless blogging experience, allowing users to create, manage, and share their posts with ease. Whether you're an experienced writer or just getting started, Blog Panel offers the tools and flexibility you need to express yourself and connect with your audience.
            </p>
            <p>
              Our mission is to empower individuals to share their stories and insights, fostering a community of writers and readers. With an intuitive interface and customizable features, Blog Panel is the perfect place to bring your ideas to life.
            </p>
          </Col>
          <Col md={6}>
            <img 
     src='https://res.cloudinary.com/dtjgspe71/image/upload/v1720786259/uarxrxcs43svmupbstzl.png'
      alt="About Us" 
              className="img-fluid"
              style={{ borderRadius: '8px' }}
            />
          </Col>
        </Row>
      </Container>

      {/* Features Section */}

      <Container className="mt-5">
        <h2 className="text-center mb-4">Features</h2>
        <Row>
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Easy to Use</Card.Title>
                <Card.Text>Create and manage your blogs with ease.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Customizable</Card.Title>
                <Card.Text>Personalize your blog posts with a variety of options.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card">
              <Card.Body>
                <Card.Title>Responsive Design</Card.Title>
                <Card.Text>Access your blogs on any device, anytime.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Testimonials Section */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">What Our Users Say</h2>
        <Row>
          <Col md={4}>
            <Card className="testimonial-card">
              <Card.Body>
                <Card.Text>"This is the best blogging platform I've ever used!"</Card.Text>
                <Card.Footer>- Irtaza</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="testimonial-card">
              <Card.Body>
                <Card.Text>"Incredibly easy to use and very powerful."</Card.Text>
                <Card.Footer>-Hatim</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="testimonial-card">
              <Card.Body>
                <Card.Text>"I love the customization options available."</Card.Text>
                <Card.Footer>- Ali</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      
    </>
  );
}

export default Home;
