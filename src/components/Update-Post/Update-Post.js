import React from 'react';
import { useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
const Update = () => {
    const auth = localStorage.getItem('user');

    const id =JSON.parse(auth)._id

    const [posts, setPosts] = useState([]);


    const params = useParams();
    const navigate = useNavigate();

    //  const navigate = useNavigate();
    useEffect(() => {

         const headers = {
            "Content-Type": "application/json",
    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        //updating post on post id
        const url = `http://localhost:4500/Update-Post/${params.id}`;

        axios.get(url, { headers }).then((res) => setPosts(res.data))

    }, [])

    const updatePost = () => {
        const headers = {
            "Content-Type": "application/json",
    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        //updating api
        axios.put(`http://localhost:4500/Update-Post/${params.id}`,posts,{headers})
           .then((res) => setPosts(res.data))
        navigate("/Your-Posts");
    }

    return (<div>
        <br></br>
        <h3>Edit post</h3>
<br></br>
<div className="container">
        <form onSubmit={updatePost}  >
            <input type="text" className='inputBox'
            value={posts.userid} name="userid" 
        hidden /><input type="text" className='inputBox'
            value={posts._id} name="_id" 
      hidden/>

       <b>Blog title</b> <input type="text" className="form-control m-2"
            value={posts.title} name="title" 
            onChange={e => setPosts({ ...posts, title: e.target.value })}
       required />

        <b>Blog body</b><textarea type="text" className="form-control m-2" cols="5" rows="13"
            value={posts.body} name="body" onChange={e => setPosts({ ...posts, body: e.target.value })}
        required> </textarea>

                    <br></br>

            <button className='btn btn-success'>Update</button></form></div>
    </div>);
}

export default Update;
