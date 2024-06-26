const mongoose = require("mongoose")

const draftpostschema = new mongoose.Schema({

    userid: String,
    postid: String,
    title: String,
    body: String
});
module.exports = mongoose.model('draftposts', draftpostschema);


