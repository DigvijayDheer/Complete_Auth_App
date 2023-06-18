const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel.js");

module.exports = (passport) => {
  // Configure Google OAuth 2.0 authentication strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.APP_URI}/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find user in the database based on the Google profile email
          const data = await User.findOne({ email: profile.emails[0].value });

          if (data) {
            // If user exists, pass the user data to the done callback
            return done(null, data);
          } else {
            // If user doesn't exist, create a new user with Google profile data
            const newUser = await User.create({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              password: null,
              provider: "google",
              isVerified: true,
            });

            // Pass the newly created user data to the done callback
            return done(null, newUser);
          }
        } catch (err) {
          // If an error occurs, pass the error to the done callback
          return done(err);
        }
      }
    )
  );

  // Serialize user ID into a session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session based on user ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
