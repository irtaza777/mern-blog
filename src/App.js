import './App.css';
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Posts from "./components/Posts/Posts";
import AddPost from "./components/Add-Post/Add-Post";
import UpdatePost from "./components/Update-Post/Update-Post";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import PrivateComponent from './components/PrivateComponent/PrivateComponent'
import YourPosts from './components/Your-Posts/Your-Posts';
import SinglePost from './components/Singlepost/singlepost';
import DraftPosts from './components/Draft-Posts/Draft-Posts';
import Error from './components/Errorpage/Error';


function App() {
  return (
    <div >
      <Navbar />
        <Routes>
                    <Route path="/" element={<h1>Welcome to blog website</h1>}></Route>

          <Route path="*" element={<Error/>}></Route>
                    <Route path="/Home" element={<Home />}></Route>

        <Route element={<PrivateComponent />}>

          <Route path="/Posts" element={<Posts />}></Route>
          <Route path="/Add-Post" element={<AddPost />}></Route>
          <Route path="/Your-Posts" element={<YourPosts />}></Route>
          <Route path="/Draft-Posts" element={<DraftPosts />}></Route>

          <Route path="/Update-Post/:id" element={<UpdatePost />}></Route>
                    <Route path="/singlepost/:id" element={<SinglePost />}></Route>

          </Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Register" element={<Register/>}></Route>
        </Routes>
    </div>
  );
}

export default App;