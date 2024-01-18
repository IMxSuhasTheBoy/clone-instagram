var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport"); ///https://www.npmjs.com/package/passport
const localStrategy = require("passport-local"); ///https://www.npmjs.com/package/passport-local
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login", { footer: false });
});

router.get("/feed", isLoggedIn, async (req, res) => {
  const posts = await postModel.find().populate("user");
  // console.log(posts);
  res.render("feed", { footer: true, posts });
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts")
console.log(user);
  res.render("profile", { footer: true, user });
});

router.get("/search", isLoggedIn, function (req, res) {
  res.render("search", { footer: true });
});

router.get("/edit", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  // console.log(user, "edit route");
  res.render("edit", { footer: true, user });
});

router.get("/upload", isLoggedIn, function (req, res) {
  res.render("upload", { footer: true });
});

router.post("/register", (req, res) => {
  const userData = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    picture: req.file.filename,
    user: user._id,
    caption: req.body.caption,
  });

  user.posts.push(post._id);
  console.log(post, "post route /upload");
  await user.save();
  res.redirect("/feed");
});

///Docs https://www.passportjs.org/tutorials/auth0/logout/
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post("/update", upload.single("image"), async (req, res) => {
  const user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true }
  );

  if (req.file) {
    user.profileImage = req.file.filename;
  }
  await user.save();
  // console.log(user, "update route");
  res.redirect("/profile");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
