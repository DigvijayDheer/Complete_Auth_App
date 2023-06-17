const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../middlewares/passport.js")(passport);
const User = require("../models/userModel.js");

// Render the index page based on user authentication
const renderIndexPage = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("index", { logged: true });
  } else {
    res.render("index", { logged: false });
  }
};

// Render the login page with CSRF token for security
const renderLoginPage = (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
};

// Authenticate the user using Passport's local strategy
const loginUser = (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
    failureFlash: true,
  })(req, res, next);
};

// Render the signup page with CSRF token for security
const renderSignupPage = (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
};

// Sign up a new user
const signupUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate if all required fields are provided
  if (!username || !email || !password || !confirmPassword) {
    return res.render("signup", {
      err: "All fields are required!",
      csrfToken: req.csrfToken(),
    });
  }

  // Check if passwords match
  if (password != confirmPassword) {
    return res.render("signup", {
      err: "Passwords don't match!",
      csrfToken: req.csrfToken(),
    });
  }

  // Check if user with the same username or email already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    return res.render("signup", {
      err: "User already exists. Try logging in.",
      csrfToken: req.csrfToken(),
    });
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user instance
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
    googleId: null,
    provider: "email",
  });

  // Save the new user to the database
  await newUser.save();

  res.redirect("/login");
});

// Render the user profile page
const renderProfilePage = (req, res) => {
  res.render("profile", {
    username: req.user.username,
    verified: req.user.isVerified,
  });
};

// Log out the user and destroy the session
const logoutUser = (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  });
};

module.exports = {
  renderIndexPage,
  renderLoginPage,
  loginUser,
  renderSignupPage,
  signupUser,
  renderProfilePage,
  logoutUser,
};
