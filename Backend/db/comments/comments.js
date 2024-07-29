const mongoose = require("mongoose")

const commentschema = new mongoose.Schema({

    comment: String,

    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    pid: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },


});
module.exports = mongoose.model('comments', commentschema);


