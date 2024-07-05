const mongoose = require("mongoose")

const likesschema = new mongoose.Schema({

    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'users'  },
    postid: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
    //LikedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'users', default: [] },
    liked: { type: Boolean }
    //likeCount: { type: Number, default: 0 },

});
module.exports = mongoose.model('likes', likesschema );


