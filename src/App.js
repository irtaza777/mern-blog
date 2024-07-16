import './App.css'; // Import the main stylesheet for the app
import Navbar from './components/Navbar/Navbar'; // Import the Navbar component
import { Route, Routes } from "react-router-dom"; // Import Route and Routes for routing
import Home from "./components/Home/Home"; // Import the Home component
import Posts from "./components/Posts/Posts"; // Import the Posts component
import AddPost from "./components/Add-Post/Add-Post"; // Import the AddPost component
import UpdatePost from "./components/Update-Post/Update-Post"; // Import the UpdatePost component
import Login from "./components/Login/login"; // Import the Login component
import Register from "./components/Register/register"; // Import the Register component
import PrivateComponent from './components/PrivateComponent/PrivateComponent'; // Import the PrivateComponent for protected routes
import YourPosts from './components/Your-Posts/Your-Posts'; // Import the YourPosts component
import SinglePost from './components/Singlepost/singlepost'; // Import the SinglePost component
import DraftPosts from './components/Draft-Posts/Draft-Posts'; // Import the DraftPosts component
import Error from './components/Errorpage/Error'; // Import the Error component for handling 404 errors
import Footer from './components/Fotter/fotter'; // Import the Footer component

function App() {
  return (
    <div>
      <Navbar /> {/* Render the Navbar component */}
      <Routes> {/* Define the routes for the app */}

        {/* Route for handling any unmatched paths, renders the Error component */}
        <Route path="*" element={<Error />} />

        {/* Route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Group routes that require authentication */}
        <Route element={<PrivateComponent />}>

          {/* Route for the Posts page */}
          <Route path="/Posts" element={<Posts />} />
          {/* Route for adding a new post */}
          <Route path="/Add-Post" element={<AddPost />} />
          {/* Route for displaying user's posts */}
          <Route path="/Your-Posts" element={<YourPosts />} />
          {/* Route for displaying draft posts */}
          <Route path="/Draft-Posts" element={<DraftPosts />} />
          {/* Route for updating a post, with post ID as a parameter */}
          <Route path="/Update-Post/:id" element={<UpdatePost />} />
          {/* Route for displaying a single post, with post ID as a parameter */}
          <Route path="/singlepost/:id" element={<SinglePost />} />

        </Route>

        {/* Route for the login page */}
        <Route path="/Login" element={<Login />} />
        {/* Route for the register page */}
        <Route path="/Register" element={<Register />} />

      </Routes>
      <Footer /> {/* Render the Footer component */}
    </div>
  );
}

export default App; // Export the App component as the default export
