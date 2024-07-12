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
import Footer from './components/Fotter/fotter';

function App() {
  return (
    <div >
      <Navbar />
        <Routes>

          <Route path="*" element={<Error/>}></Route>
                    <Route path="/Home" element={<Home />}></Route>

        <Route element={<PrivateComponent />}>
        <Route path="/" element={<Home />}></Route>

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
        <Footer/>
    </div>
  );
}

export default App;
