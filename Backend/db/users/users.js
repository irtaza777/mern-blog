const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userschema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Exclude password from queries
    imageUrl: String


});

// using pre hook to convert password forma to hashed one
userschema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
module.exports = mongoose.model('users', userschema);


