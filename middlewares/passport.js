const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  // Configure local authentication strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Find user in the database based on the email
          const data = await User.findOne({ email: email });
          if (!data) {
            // If user doesn't exist, pass an error message to the done callback
            return done(null, false, { message: "User Doesn't Exist !" });
          }
          // Compare the provided password with the stored hashed password
          const match = await bcrypt.compare(password, data.password);
          if (!match) {
            // If passwords don't match, pass an error message to the done callback
            return done(null, false, { message: "Wrong password !" });
          }
          // If user exists and password is correct, pass the user data to the done callback
          return done(null, data);
        } catch (err) {
          // If an error occurs, pass the error to the done callback
          return done(err);
        }
      }
    )
  );

  // Serialize user ID into a session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize user from the session based on user ID
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
