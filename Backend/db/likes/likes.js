const mongoose = require("mongoose")

const likeschema = new mongoose.Schema({

    userid: String,
    postid: String,
    isToggled: { type: Boolean, default: false },

});
module.exports = mongoose.model('likes', likeschema );


