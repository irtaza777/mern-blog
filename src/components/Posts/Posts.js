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
      //usequery
    const { data, isLoading, error } = useQuery('postData', allPost,{
        //cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
       // staleTime: 1000 * 60 * 1, // Consider data fresh for 1 minute
        //refetchOnWindowFocus: false, // Disable refetch on window focus
        //refetchOnReconnect: false, // Disable refetch on reconnect
        //refetchInterval: false, // Disable polling
//enabled: true // You can control this based on certain conditions
    })
    if (isLoading) {
        return <h1>Loading ....</h1>;
    }

    if (error) {
        return <p className="error">{error.message}</p>;
    }




    return (
    <div>
    <div class="container">
    <header class="mb-4">
      <h1 class="text-center">All Posts</h1>
    </header>
    <div class="row">

    {
                    data.length > 0 ? data.map((item, index) =>
      <div class="col-4">

                            <h5 class="mb-1">{item.title}</h5>

                            <p class="mb-1">{item.body}</p>

                            <Link to={"/singlepost/" + item._id}><button className="btn btn-success">Read</button></Link>
                            <Likes key={item._id} post={item}  />
                            </div>
     
  ) : <h1>No posts yet</h1>}
            </div>
            
            </div>
            </div>
        
         )
}

export default Posts;