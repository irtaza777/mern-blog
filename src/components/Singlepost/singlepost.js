import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
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
            window.location.reload();

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
        <div class="row">
            <div class="col-10">




                <h5 class="mb-1">{posts.title}</h5>

                <p class="mb-1">{posts.body}</p>
            </div>
        </div>
        <br></br>
        <div className="row " style={{ backgroundColor: 'lightgrey', padding: '20px' }}>
            <h2>Comments</h2>
            <div className="col-6">
                <input type="text" className="form-control"
                    value={pid} onChange={(e) => { setPid(e.target.value) }} hidden />
                <textarea className="form-control" placeholder="Comments" rows="1" cols="2"
                    value={comment} onChange={(e) => { setComment(e.target.value) }} required></textarea>
                {error && !comment && <span style={{ color: "red" }}>giva a comment</span>}

            </div>
            <div className="col-2">

                <button onClick={() => addcomment(posts._id)} type="submit" className="btn btn-primary">Comment</button>
            </div>

        </div>
        <div className="row " style={{ backgroundColor: 'lightgrey'}}>

        {
            comments.length > 0 ? comments.map((item, index) =>
                <tr>
                            <div className="col-6" style={{marginLeft:'20px'}}>

                    <td>{item.comment} <button class="btn btn-danger "style={{position:'relative', marginleft:'2px'}} onClick={() => Deletecomment(item._id)}>Delete</button>
</td>

                    </div>
                    <br></br>




                </tr>) : <h3>No Comments yet</h3>}
                </div >
    </div >);

}

export default SinglePost;