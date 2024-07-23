const express = require("express");

require("./db/config/config")// db connection
// All schemas and models
const users = require('./db/users/users')
const posts = require('./db/posts/posts')
const comments = require('./db/comments/comments')
const likes = require('./db/likes/likes')
//Logs
const logger = require('./logs/logger');

// redis client for cache db
const redisclient = require('./redisclient')
// JWT token
const jwt = require("jsonwebtoken")
// JWT token key
const jwtkey = "blog "

//using twilio to generate an orginal sms to your phone number
const accountSid = 'AC56def539c19b1b77dd5af1c59c970b08';
const authToken = 'a99c70c5a4406376320e63745a21eaf9';
const client = require('twilio')(accountSid, authToken);

//cronjob to send email
const cron = require('node-cron');
const nodemailer = require('nodemailer');

//cloudniary to upload image
const cloudinary = require('cloudinary').v2;

//upload middleware for image upoad
//req z image to be upload name is req and send it to desried url
const upload = require('./middleware/upload');

// To avoid cors error which is by default blocking feature of browser from front end to back end
const cors = require("cors");


const app = express();

app.use(cors());

//to accept json req
app.use(express.json())
app.use((req, res, next) => {
    logger.info(`Request received: ${req.method} ${req.url}`);
    next();
  });

//cronjob
function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString());
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'irtazarizvi7@gmail.com',   //put your mail here
        pass: '' // 2fa password // im turning it off for now

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
        //if (err)
           // console.log(err);
       // else
           // console.log(info);
    });
});
//cronjob end

// cludniary Configuration
cloudinary.config({
    cloud_name: 'dtjgspe71',
    api_key: '479751656152939',
    api_secret: 'OjUmVkaHK7Fr6rf3fvFAuCo8GcA', // Click 'View Credentials' below to copy your API secret
    secure: true,

});
//Register Api front end is Register.js
app.post('/Register', upload.single('image'), async (req, res) => {
    const { name, email, password } = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save user to MongoDB
    const user = new users({
        name,
        email,
        password,
        imageUrl: result.secure_url
    });

    let savedUser = await user.save();
    savedUser = savedUser.toObject();
    delete savedUser.password;

    res.send(savedUser);
});
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
            logger.info('someone loggedIn');

        }
        else {

            resp.send([])// sending response whatever from frontend
        }

    }
    else resp.send({ result: 'No user found' })

})

//Adding post Api front end is AddPost/AddPost.js

app.post("/Add-Post", verfiytoken, upload.single('image'), async (req, resp) => {

    try {
        const { title, body, userid, draft } = req.body;
        //  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        let imageUrl = null;

        // Check if there's an uploaded image
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path); // Upload image to Cloudinary
            imageUrl = result.secure_url; // Get the Cloudinary URL
        }
        const newPost = new posts({
            title,
            body,
            userid,
            imageUrl,
            draft

        });


        await newPost.save();
        resp.status(201).json(newPost);
    } catch (err) {
        resp.status(500).json({ error: err.message });
    }
    //using twilio to generate an orginal sms to your phone number
    // client.messages
    //   .create({
    //      body: `Your post title is :${req.body.title}`,
    //      from: '+13852336630',
    //      to: '+923106918068'
    //  })
    // .then(message => console.log(message.sid));


})
//Getting all post Api front end is Posts/Posts.js

//Applying Redis in this api
app.get("/Posts", verfiytoken, async (req, resp) => {
    // Checking if data is in Redis cache db or not, if yes get it

    let cachedPosts = await redisclient.get("posts");
    if (cachedPosts) {
        return resp.json(JSON.parse(cachedPosts));
    }

    // Fetching posts from the database
    let post = await posts.find({ draft: false });

    // Entering data in Redis
    await redisclient.set('posts', JSON.stringify(post), 'EX', 30);

    if (post.length > 0) {
        return resp.json(post); // Send a response with the fetched posts
    } else {
        return resp.json([]); // Send an empty array if no posts found
    }
})
    ;
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
    //console.log(currentUsrId)
    //method 1
    //find all posts than filte on basis of req.query id
    //let post = await posts.find();
    //let post = await posts.filter(post => post.userid == x)
    //method 2
    //find all posts than filte on basis of req.query id




    let post = await posts.find({
        $and: [
            { userid: currentUsrId },
            { draft: false },
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

app.put("/Update-Post/:id", verfiytoken, upload.single('image'), async (req, res) => {
    // If a new image is uploaded, include it in the update
    const update = req.body;

    if (req.file) {
        const imageUrl = await cloudinary.uploader.upload(req.file.path);
        update.imageUrl = imageUrl.secure_url;
        console.log(`New image uploaded: ${imageUrl}`);
    }


    let result = await posts.updateOne(
        { _id: req.params.id },
        { $set: update }
    )
    res.send(result)
});

//drafted post deleted
app.delete("/Posts/:draftpostid", verfiytoken, async (req, resp) => {
    let result = await posts.deleteOne({ _id: req.params.draftpostid });

    resp.send(result)

});
//deleting singlepost with all comments of it yourpost.js
app.delete("/Poosts/:postid", verfiytoken, async (req, resp) => {
    await posts.deleteOne({ _id: req.params.postid });
    await likes.deleteOne({ postid: req.params.postid });


    await comments.deleteMany({ pid: req.params.postid });
    resp.send({ "msg": true })

});


//deleting user,s all posts api with all its comment front end is yourpost.js(id is of user)
app.delete("/DELUPosts/:Delid", verfiytoken, async (req, resp) => {
    // console.log("All")
    await comments.deleteMany({ userid: req.params.Delid })
    await likes.deleteMany({ userid: req.params.Delid })

    let deleteall = await posts.deleteMany({ userid: req.params.Delid });
    //console.log(deleteall)

    resp.send(deleteall)

});
//like toggle api front end is likes.js
app.post('/Posts/:postid/:uid/toggle', verfiytoken, async (req, res) => {
    let pid = req.params.postid
    let uid = req.params.uid
    console.log(uid)
    try {
        const post = await posts.findById(pid);
        // console.log(post)
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        let like = await likes.findOne({ userid: uid, postid: pid });
        console.log(like);

        if (like) {

            // User has already liked the post, so unlike it
            if (like.liked === true) {

                like.liked = false;
                post.likeCount--;
            } else {
                like.liked = true;
                post.likeCount++;

            }
        } else {
            // User has not liked the post yet, so like it
            like = new likes({ postid: pid, userid: uid, liked: true });
            post.likeCount++;
        }

        await like.save();
        await post.save();

        res.json({ likeCount: post.likeCount, liked: like.liked });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    /*   let alike = new likes({
           userid: uid,
           postid: pid,
       });
       
   
           const liked = alike.uid;
           console.log(liked)
       if (liked) {
       //user already liked post so unlike it
      alike.likeCount--;
       alike.LikedBy = alike.LikedBy.filter(id => id.toString() !== uid);
       alike.like=false;
   
       }
       else {
    alike. likeCount++;
    alike.LikedBy.push(uid);
    alike.like=true;
   
    }
   
    let result=await alike.save();
   
       res.json(result);
       */

});

//fetching like so in front end post.js we can send props to likes.js (its no needed anymore )
app.get("/Likes", verfiytoken, async (req, resp) => {


    let like = await likes.find();
    console.log(like)
    if (like.length > 0) {
        resp.send(like)
    }
    else {
        resp.send([])

    }
})
app.get('/Posts/:postId/:userId/likeStatus', async (req, res) => {
    const { postId, userId } = req.params;

    try {
        const like = await likes.findOne({ postid: postId, userid: userId });
        res.json({ liked: like ? like.liked : false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
