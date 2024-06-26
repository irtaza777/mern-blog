import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query'

//user auth
const auth = localStorage.getItem('user');
const id =  JSON.parse(auth)._id
console.log(id)

// First we make an independent func in which we put our fetch api for posts of single user logged in
//then in main func we use usequery to fetch
const fetchYourpost= async()=> {
   
    //Api for fetching post on user id base
    const headers = {
        "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

    };
    //id is here is of user id fetch data of that user only who is logged in
    const url = `http://localhost:4500/Your-Posts/${id}`;

   const response= await axios.get(url, { headers });
    return response.data.post // in backend we did post in 2nd resp after showing messaage




};
// Main funcion
const YourPosts = () => {
    // auth is bz we want a post of current user only
    

    const [currentUserPosts, setCurrentUserPosts] = useState([]);
   
    
   
// delete only that post with all comments of it
    const Deletepost = async (pid) => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };

        axios.delete(`http://localhost:4500/Poosts/${pid}`, { headers })
            .then((res) => setCurrentUserPosts(res.data))
            window.location.reload();
    }
    //delete allpost func and api
    const Deleteall = async () => {
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };

//deleting on userid
        axios.delete(`http://localhost:4500/DELUPosts/${id}`, { headers })
            .then((res) => setCurrentUserPosts(res.data))
            window.location.reload();

    }
        //usequery

    const { data, isLoading,error} = useQuery('fetchData',fetchYourpost,{
        staleTime: 12000000000000000000, // for this time data is considered fresh no reload
        //cacheTime: 300000, // 5 minutes data is in cahche

    })
    //console.log(data)
    if (isLoading) {
        return <h1>Loading ....</h1>;
    }

    if (error) {
        return <p className="error">{error.message}</p>;
    }



    return (< div className="container" >
        <br></br>
        <h3>Blogs</h3>
        <button className="btn btn-danger m-2 " onClick={() => Deleteall()}>Delete</button>

        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>User id</th>
                    <th>Post id</th>
                    <th>title</th>
                    <th>body</th>
                    <th>Operations</th>


                </tr>
            </thead>


            <tbody>


                {
                    data.length > 0 ? data.map((item, index) =>
                        <tr>
                            <td>{index + 1} </td>
                            <td>{item.userid} </td>
                            <td>{item._id} </td>
                            <td>{item.title}</td>
                            <td>{item.body}</td>
                            <td>    <Link to={"/Update-Post/" + item._id}><button className="btn btn-success">Edit</button></Link>
                                <button class="btn btn-danger m-2" onClick={() => Deletepost(item._id)}>Delete</button>
                            </td>


                        </tr>

                    )
                        : <h1>No post found</h1>}</tbody>
        </Table>  </div >);
}

export default YourPosts;


