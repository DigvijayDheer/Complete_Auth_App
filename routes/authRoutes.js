const express = require("express");
const passport = require("passport");
require("../middlewares/googleAuth.js")(passport);
const router = express.Router();
const {
  renderIndexPage,
  renderLoginPage,
  loginUser,
  renderSignupPage,
  signupUser,
  renderProfilePage,
  logoutUser,
} = require("../controllers/authControllers.js");
const { checkAuth } = require("../middlewares/authMiddleware.js");

// Route: GET /
// Renders the index page
router.route("/").get(renderIndexPage);

// Route: GET /login
// Renders the login page
// Route: POST /login
// Handles user login
router.route("/login").get(renderLoginPage).post(loginUser);

// Route: GET /signup
// Renders the signup page
// Route: POST /signup
// Handles user signup
router.route("/signup").get(renderSignupPage).post(signupUser);

// Route: GET /profile
// Renders the profile page
// Middleware: checkAuth
// Ensures that the user is authenticated before accessing the profile page
router.route("/profile").get(checkAuth, renderProfilePage);

// Route: GET /logout
// Logs out the user
router.route("/logout").get(logoutUser);

// Route: GET /google
// Initiates the Google OAuth authentication process
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route: GET /google/callback
// Callback URL for Google OAuth authentication
// Middleware: passport.authenticate
// Handles the authentication callback from Google
// Redirects to the profile page upon successful authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

module.exports = router;
