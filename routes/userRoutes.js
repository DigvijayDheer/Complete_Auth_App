const express = require("express");
const passport = require("passport");
require("../middlewares/googleAuth.js")(passport);
const router = express.Router();
const {
  sendVerificationEmail,
  verifyEmail,
  forgotPasswordRequest,
  sendPasswordResetEmail,
  resetPassword,
  submitNewPassword,
} = require("../controllers/userControllers.js");
const { checkAuth } = require("../middlewares/authMiddleware.js");

// Route: GET /send-verification-email
// Middleware: checkAuth
// Sends a verification email to the authenticated user
router.route("/send-verification-email").get(checkAuth, sendVerificationEmail);

// Route: GET /verify-email
// Verifies the email based on the token in the query parameter
router.route("/verify-email").get(verifyEmail);

// Route: GET /forget-password
// Renders the forget password page
// Route: POST /forget-password
// Sends a password reset email
router
  .route("/forget-password")
  .get(forgotPasswordRequest)
  .post(sendPasswordResetEmail);

// Route: GET /reset-password
// Renders the reset password page based on the token in the query parameter
// Route: POST /reset-password
// Submits a new password
router.route("/reset-password").get(resetPassword).post(submitNewPassword);

module.exports = router;
