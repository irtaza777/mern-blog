const mongoose = require("mongoose")

const postschema = new mongoose.Schema({

  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  title: String,
  body: String,
  draft: Boolean,
  imageUrl: String, // Add this line

  likeCount: { type: Number, default: 0 },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] }


});
//using middleware express hook to extract only date not time NOT NEED NOW
//postschema.pre('save', function(next) {
//    if (this.isNew || this.isModified('createdAt')) {
//     let today = new Date(this.createdAt);
//    today.setHours(0, 0, 0, 0);
//    this.createdAt = today;
// }
// next();
// });
module.exports = mongoose.model('posts', postschema);


