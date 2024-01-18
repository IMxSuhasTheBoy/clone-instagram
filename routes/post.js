///Docs https://mongoosejs.com/docs/index.html
const mongoose = require("mongoose");

// main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/clone-instagram");
// }

const postSchema = mongoose.Schema({
  picture: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  caption: String,
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("post", postSchema);
