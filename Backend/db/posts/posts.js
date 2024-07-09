const mongoose = require("mongoose")

const postschema = new mongoose.Schema({

    userid: String,
    title: String,
    body: String,
    draft: Boolean,
    likeCount: { type: Number, default: 0 },
   // likedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'users', default: [] },
   // like: { type: Boolean },
   createdAt: { type: Date, default: Date.now }


});
module.exports = mongoose.model('posts', postschema);


