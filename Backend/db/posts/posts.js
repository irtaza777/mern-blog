const mongoose = require("mongoose")

const postschema = new mongoose.Schema({

    userid: String,
    title: String,
    body: String,
    draft: Boolean,
    isToggled: { type: Boolean }

});
module.exports = mongoose.model('posts', postschema);


