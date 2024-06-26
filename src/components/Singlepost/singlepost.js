import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
const SinglePost = () => {
    const auth = localStorage.getItem('user');

    const uid = JSON.parse(auth)._id
    const [userid, setId] = useState(uid);
    const [posts, setPosts] = useState([]);
    const [pid, setPid] = useState('posts._id');
    const [error, setError] = useState(false);//errors

    const [comment, setComment] = useState('');// for add comment
    const [comments, setComments] = useState([]);// for fetch comments

    const [isCmmentUpdated, setisCmmentUpdated] = useState(false);

    const params = useParams();

    //Adding comment to a singlepost
    const addcomment = async (pid) => {
        if (!comment) {
            setError(true);
            return false
        }
        const data = {
            user: userid,
            comment: comment,
            postId: params.id
        }

        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        const url = "http://localhost:4500/singlepost/Add-Comment"
        axios.post(url, data, { headers })
            .then((res) => {
                setisCmmentUpdated(!isCmmentUpdated)
                console.log(res)
                    ;
            })

    }
    //deleting a comment of that user of that post of that comment id(fucntion)
    const Deletecomment = (id) => {
        const postid = params.id

        console.log(postid)

        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        //deleting comment api on userid/postid/commentid

        axios.delete(`http://localhost:4500/Comments/${userid}/${postid}/${id}`, { headers })
            .then((res) => setComments(res.data))
    }

    useEffect(() => {

        //api to retrive singlepost by its id
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };

//fetching post of that id only
        const url_singlepost_id = `http://localhost:4500/singlepost/${params.id}`;

        axios.get(url_singlepost_id, { headers }).then((res) => setPosts(res.data))
        //api end

       
    }, [params.id])

    useEffect(() => {

        //api to retrive singlepost by its id
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };



        const id = params.id// taking singlepost id to send in comments fetching api

        //Api for comment retrivel of that singlepost by singlepost id

        const urlc = `http://localhost:4500/singlepost/Comments/${id}`;

        axios.get(urlc, { headers }).then((res) => setComments(res.data))

        //console.log("::", comments)

    }, [isCmmentUpdated])




    return (<div className="container">
        <br></br>
        <Table responsive striped bordered hover>
            <thead>
                <tr>

                    <th>User id</th>
                    <th>Post id</th>
                    <th>title</th>
                    <th>body</th>


                </tr>
            </thead>


            <tbody>




                <tr key={posts._id}>
                    <td >{posts.userid}</td>
                    <td >{posts._id}</td>
                    <td >{posts.title}</td>
                    <td>{posts.body}</td>



                </tr>


            </tbody>
        </Table>
        <div className="container">
            <input type="text" className="form-control"
                value={pid} onChange={(e) => { setPid(e.target.value) }} hidden />
            Comments <textarea className="form-control" placeholder="Comments" rows="2" cols="5"
                value={comment} onChange={(e) => { setComment(e.target.value) }} required></textarea>
            {error && !comment && <span style={{ color: "red" }}>giva a comment</span>}

            <br></br>
            <button onClick={() => addcomment(posts._id)} type="submit" className="btn btn-primary">Comment</button>
        </div>
        <br></br>
        <div className="container"><h2>Comments</h2>

            <Table responsive striped bordered hover>
                <thead>
                    <tr>


                        <th>Comment</th>
                        <th>comment id</th>
                        <th>Post id</th>

                        <th>Operations</th>


                    </tr>
                </thead>

                <tbody>

                    {
                        comments.length > 0 ? comments.map((item, index) =>
                            <tr>
                                <td>{item.comment} </td>
                                <td>{item._id} </td>
                                <td>{item.pid} </td>
                                <td> <button class="btn btn-danger m-2" onClick={() => Deletecomment(item._id)}>Delete</button>
                                </td>



                            </tr>


                        ) : <h1>No Comments yet</h1>



                    }</tbody>
            </Table>
        </div>

    </div >);

}

export default SinglePost;