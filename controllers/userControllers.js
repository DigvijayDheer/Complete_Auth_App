const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("../middlewares/passport.js")(passport);
const User = require("../models/userModel.js");
const ResetToken = require("../models/resetTokenModel.js");
const mailer = require("./sendMail.js");

// Send a verification email to the user's email address
const sendVerificationEmail = asyncHandler(async (req, res) => {
  if (req.user.isVerified || req.user.provider === "google") {
    res.redirect("/profile");
  } else {
    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");

    // Save the token to the database
    await ResetToken({ token: token, email: req.user.email }).save();

    // Send the verification email
    mailer.sendVerifyEmail(req.user.email, token);

    // Render the profile page with emailSent flag
    res.render("profile", {
      username: req.user.username,
      verified: req.user.isVerified,
      emailSent: true,
    });
  }
});

// Verify the user's email address using the provided token
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;

  if (token) {
    // Check if the token exists in the database
    const check = await ResetToken.findOne({ token: token });
    if (check) {
      // Update the user's isVerified status
      const userData = await User.findOne({ email: check.email });
      userData.isVerified = true;
      userData.save();

      // Delete the used token
      await ResetToken.findOneAndDelete({ token: token });

      res.redirect("/profile");
    } else {
      res.render("profile", {
        username: req.user.username,
        verified: req.user.isVerified,
        err: "Invalid token",
      });
    }
  } else {
    res.redirect("/profile");
  }
});

// Render the forgot password request page
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  res.render("forgetPassword", { csrfToken: req.csrfToken() });
});

// Send a password reset email to the provided email address
const sendPasswordResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find the user by email
  const userData = await User.findOne({ email: email });

  if (userData) {
    if (userData.provider === "google") {
      res.render("forgetPassword", {
        csrfToken: req.csrfToken(),
        msg: "Registered with Google, Kindly check your Google password!",
        type: "danger",
      });
    } else {
      // Generate a random token
      const token = crypto.randomBytes(32).toString("hex");

      // Save the token to the database
      await ResetToken({ token: token, email: email }).save();

      // Send the password reset email
      mailer.sendResetEmail(email, token);

      res.render("forgetPassword", {
        csrfToken: req.csrfToken(),
        msg: "Password reset link sent!",
        type: "success",
      });
    }
  } else {
    res.render("forgetPassword", {
      csrfToken: req.csrfToken(),
      msg: "No user found!",
      type: "danger",
    });
  }
});

// Render the reset password page with the provided token
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.query.token;

  if (token) {
    // Check if the token exists in the database
    const check = await ResetToken.findOne({ token: token });
    if (check) {
      res.render("forgetPassword", {
        csrfToken: req.csrfToken(),
        reset: true,
        email: check.email,
      });
    } else {
      res.render("forgetPassword", {
        csrfToken: req.csrfToken(),
        msg: "Invalid token!",
        type: "danger",
      });
    }
  } else {
    res.redirect("/login");
  }
});

// Submit a new password for the user
const submitNewPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword, email } = req.body;

  if (!password || !confirmPassword || password !== confirmPassword) {
    res.render("forgetPassword", {
      csrfToken: req.csrfToken(),
      msg: "Invalid token!",
      type: "danger",
      reset: true,
      email: email,
    });
  } else {
    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    res.redirect("/login");
  }
});

module.exports = {
  sendVerificationEmail,
  verifyEmail,
  forgotPasswordRequest,
  sendPasswordResetEmail,
  resetPassword,
  submitNewPassword,
};
