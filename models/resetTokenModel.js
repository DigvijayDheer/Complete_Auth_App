const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

module.exports = mongoose.model("ResetToken", resetTokenSchema);
