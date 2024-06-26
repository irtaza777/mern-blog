const express = require("express");

require("./db/config/config")// db connection
// All schemas and models
const users = require('./db/users/users')
const posts = require('./db/posts/posts')
const comments = require('./db/comments/comments')
const redisclient = require('./client')

const jwt = require("jsonwebtoken")// JWT token
const jwtkey = "blog "// JWT token key
//using twilio to generate an orginal sms to your phone number
const accountSid = 'AC56def539c19b1b77dd5af1c59c970b08';
const authToken = 'a99c70c5a4406376320e63745a21eaf9';
const client = require('twilio')(accountSid, authToken);
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const cors = require("cors");// To avoid cors error which is by default blocking feature of browser
//from front end to back end


const app = express();

app.use(cors());

app.use(express.json())



function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString());
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'irtazarizvi7@gmail.com',   //put your mail here
        pass: 'ahtk zalw thhn kujx' // 2fa password // im turning it off for now

    }
});
const mailOptions = {
    from: 'irtazarizvi7@gmail.com',       // sender address
    to: 'irtazarizvi4@gmail.com',          // recieveraddress
    subject: 'Meeting Reminder',
    html: '<p>hi! Your salary arrived</p>'// plain text body
};
// Schedule the cron job to run every minute
cron.schedule('* * * * *', () => {
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    });
});
//Register Api front end is Register.js
app.post("/Register", async (req, resp) => {
    let data = new users(req.body)
    let result = await data.save();
    //below 2 lines r 4 1st converting array to object then removing password
    result = result.toObject();

    delete result.password

    resp.send(result)


})
//Login Api front end is Login.js
app.post("/Login", async (req, resp) => {
    if (req.body.password && req.body.email) {

        let user = await users.findOne(req.body).select("-password")
        if (user) {
            jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send("Something went wrong")
                }
                resp.send({ user, auth: token })//auth with token
            })
        }
        else {

            resp.send([])// sending response whatever from frontend
        }

    }
    else resp.send({ result: 'No user found' })

})

//Adding post Api front end is AddPost/AddPost.js

app.post("/Add-Post", verfiytoken, async (req, resp) => {

    let post = new posts(req.body);
    let result = await post.save();
    resp.send(result)
    //using twilio to generate an orginal sms to your phone number
    client.messages
        .create({
            body: `Your post title is :${req.body.title}`,
            from: '+13852336630',
            to: '+923106918068'
        })
        .then(message => console.log(message.sid));


})
//Getting all post Api front end is Posts/Posts.js

//Applying Redis in this api
app.get("/Posts", verfiytoken, async (req, resp) => {

    let post = await posts.find();
    // Checking if data is in redis cache db or not if yes get it
    const cvalue = await redisclient.get("posts")
    if (cvalue) return resp.send(JSON.parse(cvalue))

    post = await post.filter(post => post.draft !== true)

    // entering data in redis 
    await redisclient.set('posts', JSON.stringify(post))
    await redisclient.expire('posts', 30)// exp after 30s
    if (post.length > 0) {
        resp.send(post)
    }
    else {
        resp.send([])

    }
})
//drafted post with id frontend draftpost
app.get("/Posts/:id", verfiytoken, async (req, resp) => {
    const currentUsrId = req.params.id;

    let post = await posts.find();
    post = await post.filter(post => post.userid === currentUsrId && post.draft !== false)

    if (post) {
        resp.send({ "message": "Success", "post": post })
    }
    else {
        resp.send([])

    }
})
//Getting all postof current user Api front end Your-Post/Your-Post.js

app.get("/Your-Posts/:id", verfiytoken, async (req, resp) => {

    const currentUsrId = req.params.id;
console.log(currentUsrId)
    //method 1
    //find all posts than filte on basis of req.query id
    //let post = await posts.find();
    //let post = await posts.filter(post => post.userid == x)
    //method 2
    //find all posts than filte on basis of req.query id

    let post= await posts.find({
        $and: [
          { userid: currentUsrId},
          { draft:false},
        ]
      });
    //let post = await posts.find(post => post.userid === currentUsrId && post.draft !== true)
    //     post = await post.filter(post => post.userid === currentUsrId && post.draft !== false)

    // if(post.length>0){
    //      resp.send(post)
     // }
    // else{
    //              resp.send("No record")

    // }
    resp.send({ "msg": "Success", "post": post })
})
//api of singlepost only that post frontend singlepost.js
app.get("/singlepost/:id", verfiytoken, async (req, resp) => {
    //console.log("singlehit");

    let result = await posts.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
})
//Adding comments to a single post of current user api front end is singlepost/singlepost.js
app.post("/singlepost/Add-Comment", verfiytoken, async (req, resp) => {
    //console.log(req.body)
    const { user, comment, postId } = req.body;

    //console.log("user", user)
    // console.log("comment", comment)
    // console.log("postId", postId)
    let Comment = new comments({
        comment: comment,
        userid: user,
        pid: postId
    });
    let result = await Comment.save();
    resp.send(result)
})
//Getting comments of a single post of current user api front end is singlepost/singlepost.js


app.get("/post/:id/:userId", verfiytoken, async (req, resp) => {

    let comment = await comments.find();
    if (comment.length > 0) {
        resp.send(comment)
    }
    else {
        resp.send("No record")

    }
})
// fetch comment of that post id singlepost.js
app.get("/singlepost/Comments/:id", verfiytoken, async (req, resp) => {
    //console.log("hit", req.params.id)
    let comment = await comments.find({ pid: req.params.id });
    //console.log(">>>>>>>>>>>>>>", comment)
    if (comment.length > 0) {
        resp.send(comment)
    }
    else {
        resp.send([])

    }
})
//deleting a comment of that user of that id and id oc comment
app.delete("/Comments/:userid/:postid/:commentid", verfiytoken, async (req, resp) => {
    console.log("helloCommentdelete")
    let deleteOne = await comments.deleteOne({ $and: [{ userid: req.params.userid }, { pid: req.params.postid }, { _id: req.params.commentid }] })
        ;
    resp.send(deleteOne)

});
//update post on if fist get it api front end update-post
app.get("/Update-Post/:id", verfiytoken, async (req, resp) => {
    //const currentUsrId = req.params.userid;
    console.log("hello")

    //  const pid= req.params.id;
    // let post = await posts._findOne({_id:req.params.id});
    // post = await post.filter(post =>post.id===pid )
    //resp.send({ "msg": "Success", "post": post })
    let result = await posts.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
})
//update post on if 2nd update get it api front end update-post

app.put("/Update-Post/:id", verfiytoken, async (req, resp) => {
    let result = await posts.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});
//drafted post deleted
app.delete("/Posts/:draftpostid", verfiytoken, async (req, resp) => {
    let result = await posts.deleteOne({ _id: req.params.draftpostid });

    resp.send(result)

});
//deleting singlepost with all comments of it yourpost.js
app.delete("/Poosts/:postid", verfiytoken, async (req, resp) => {
    console.log(req.params.postid, "2")
    await posts.deleteOne({ _id: req.params.postid });

    console.log(req.params.postid)

    await comments.deleteMany({ pid: req.params.postid });
    resp.send({ "msg": true })

});


//deleting user,s all posts api with all its comment front end is yourpost.js(id is of user)
app.delete("/DELUPosts/:Delid", verfiytoken, async (req, resp) => {
    // console.log("All")
    await comments.deleteMany({ userid: req.params.Delid })
    let deleteall = await posts.deleteMany({ userid: req.params.Delid });
    //console.log(deleteall)

    resp.send(deleteall)

});

// token verication (to be implemented)
function verfiytoken(req, resp, next) {
    //console.log('req.headers.authorization')
    let token = req.headers["authorization"];
    if (token) {
        token = token.split(' ')[1];
        jwt.verify(token, jwtkey, (err, valid) => {

            if (err) {
                resp.status(401).send({ result: "Please provide valid token" })


            }
            else { next(); }
        })
    }
    else {
        resp.status(403).send({ result: "you are not authorized to perform this action" })

    }
}
//runing on localhost 4500
app.listen(4500);