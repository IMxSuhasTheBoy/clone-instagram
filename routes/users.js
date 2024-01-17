///Docs https://mongoosejs.com/docs/index.html
const mongoose = require("mongoose");
const plm = require("passport-local-mongoose"); ///https://www.npmjs.com/package/passport-local-mongoose

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/clone-instagram");
}

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  bio: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
