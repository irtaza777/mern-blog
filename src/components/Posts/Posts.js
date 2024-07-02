import React from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useQuery } from 'react-query'
import axiosInstance from '../../utils/axios';
import Likes from "./Likes";
import { useState } from "react";
// first we make a fucn in which we fetch api then in main func we use usequery
const allPost = async () => {

// using axiosintance from utils => api.js
//we also caching in redis   
    const response = await axiosInstance.get('/Posts');
    
    return response.data;



};
//Main func
const Posts = () => {
    
    // const [posts, setPosts] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    //usequery
    const { data, isLoading, error } = useQuery('postData', allPost,{
        //staleTime: 12000000000000000000, // for this time data is considered fresh no reload
        //cacheTime: 300000, // 5 minutes data is in cahche

    })
    if (isLoading) {
        return <h1>Loading ....</h1>;
    }

    if (error) {
        return <p className="error">{error.message}</p>;
    }

const Addlike=async(postid,userid)=>{
    console.log(postid)
    
    const response=await axiosInstance.get(`/Posts/${postid}/${userid}/toggle`);
    setLikes(response.data.likes);
    setLiked(response.data.liked);


   
}
const buttonStyle = {
    backgroundColor: likes ? 'red' : 'green',
    color: 'white',
    border: 'none',
    padding: '5px 11px',
    cursor: 'pointer',
    borderRadius: '5px',
    
  };

    return (<div className="container" >
        <br></br>
        <h3>Blogs</h3>
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>User id</th>
                    <th>Post id</th>

                    <th>Title</th>
                    <th>Body</th>
                    <th>likess</th>
                    <th>Operations</th>


                </tr>
            </thead>


            <tbody>


                {
                    data.length > 0 ? data.map((item, index) =>
                        <tr key={item._id}>

                            <td >{index + 1} </td>
                            <td>{item.userid}</td>
                            <td >{item._id}</td>
                            <td >{item.title}</td>

                            <td>{item.body}</td>
                            <td>{item.likeCount}</td>

                            <Link to={"/singlepost/" + item._id}><button className="btn btn-success">Read</button></Link>
                            <Likes key={item._id} post={item}  />

     
                        </tr>

                    ) : <h1>No posts yet</h1>}
            </tbody>
        </Table>  </div >)
}

export default Posts;