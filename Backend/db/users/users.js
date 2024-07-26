const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    imageUrl: String


});
module.exports = mongoose.model('users', userschema);


