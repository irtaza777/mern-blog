import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';


const DraftPosts = () => {
    const auth = localStorage.getItem('user');
const id =JSON.parse(auth)._id
    const [posts, setposts] = useState([]);

    useEffect(() => {
         const headers = {
            "Content-Type": "application/json",
                                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        const url = `http://localhost:4500/Posts/${id}`;

        axios.get(url, { headers }).then((res) => setposts(res.data.post))

        
            },[id,setposts])
            
 const Deletepost= async (id)=>{
            console.warn(id)
const headers = {
            "Content-Type": "application/json",
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
              axios.delete(`http://localhost:4500/Posts/${id}`,{headers})
 .then((res) => setposts(res.data))
                        }
        
        
    

    return (<div className = "container" >
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
                                        <th>Operations</th>



                       </tr>
                </thead>


            <tbody>

            
              {
        posts.length>0?posts.map((item, index) =>
            <tr key={item._id}> 
                 

                <td>{index+1} </td>
                <td>{item.userid}</td>
                <td>{item._id}</td>
                <td>{item.title}</td>

                <td>{item.body}</td>

                       <td> <button class="btn btn-danger" onClick={() => Deletepost(item._id)}>Delete</button>
</td>

                
            </tr>

        ):<h1>No Drafted posts</h1>
                    }</tbody>
            </Table>  </div >)
}
 
export default DraftPosts;