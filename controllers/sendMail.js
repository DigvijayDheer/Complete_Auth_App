const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// Create a nodemailer transport using Gmail service and authentication
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// Send a reset password email to the provided email address
const sendResetEmail = asyncHandler(async (email, token) => {
  const url = `${process.env.APP_URI}/reset-password?token=${token}`;

  // Use the transport to send the email
  await transport.sendMail({
    from: "Email",
    to: email,
    subject: "Reset your password!",
    text: `Click this link to reset password: ${url}`,
    html: `<h3>Click this link to reset password: </h3> <a href=${url}>Continue to Reset</a>`,
  });
});

// Send a verification email to the provided email address
const sendVerifyEmail = asyncHandler(async (email, token) => {
  const url = `${process.env.APP_URI}/verify-email?token=${token}`;

  // Use the transport to send the email
  await transport.sendMail({
    from: "Email",
    to: email,
    subject: "Verify your account!",
    text: `Click this link to verify: ${url}`,
    html: `<h3>Click this link to verify: </h3> <a href=${url}>Continue to verify</a>`,
  });
});

module.exports = {
  sendResetEmail,
  sendVerifyEmail,
};
