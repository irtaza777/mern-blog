import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container } from 'react-bootstrap';

const AddPost = () => {
    //generating auth bz we add a post of a particular user only
    const auth = localStorage.getItem('user');
    const uid = JSON.parse(auth)._id
    const [userid, setId] = React.useState(uid);

    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');

    const [error, setError] = React.useState(false);// error set for wrong input

    const navigate=useNavigate();

    // publish post function
    const addPost = async () => {

        if (!title || !body) {
            setError(true);
            return false
        }

        console.warn(title, body);
        //storing data in object and later on call on api url
        const data = {
            userid, title, body, draft: false
        }
        //publish post api
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        const url = "http://localhost:4500/Add-Post";
        axios.post(url, data, { headers })
            .then((res) => {
                console.log(res)
                    ;
            })

          
            
           

        alert("Congratzz: Your post has been published")
        navigate("/Posts")
    }

    //darft post function
    const addDraft = async () => {

        if (!title || !body) {
            setError(true);
            return false
        }
        //storing data in object and later on call on api url
        const data = { userid, title, body, draft: true }
        //draft post api
        const headers = {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

        };
        const url = "http://localhost:4500/Add-Post";
        axios.post(url, data, { headers })
            .then((res) => {
                console.log(res)
                    ;
            })

    }
    return (


        <div>
            <br></br>
            <Container>
                <h2>Write a blog</h2>
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control"
                            value={userid} onChange={(e) => { setId(e.target.value) }} hidden />

                    </div>




                    <br></br>
                    <div class="form-group">
                        <input type="TEXT" class="form-control" placeholder="Blog title"
                            value={title} onChange={(e) => { setTitle(e.target.value) }} required />
                        {error && !title && <span style={{ color: "red" }}>Enter blog title</span>}

                    </div>
                    <br></br>

                    <div class="form-group">
                        <textarea class="form-control" placeholder="Blog body" rows="13"
                            value={body} onChange={(e) => { setBody(e.target.value) }} required></textarea>
                        {error && !body && <span style={{ color: "red" }}>Enter blog body</span>}

                    </div>
                    <br></br>
                    <button onClick={addPost} type="submit" class="btn btn-primary">Publish</button>
                    <button onClick={addDraft} type="submit" className="btn btn-danger m-2">Draft</button>

                </form>
            </Container>
        </div>);
}

export default AddPost;