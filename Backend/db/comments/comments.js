const mongoose = require("mongoose")

const commentschema = new mongoose.Schema({

   comment:String,
       userid: String,
       pid:String


});
module.exports = mongoose.model('comments', commentschema);


