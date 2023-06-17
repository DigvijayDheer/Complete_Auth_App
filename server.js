const express = require("express");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const passport = require("passport");
const flash = require("connect-flash");

const MemoryStore = require("memorystore")(expressSession);

const dotenv = require("dotenv").config();
const colors = require("colors");

const connectDB = require("./config/db.js");

connectDB();
const port = process.env.PORT || 8000;
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("random"));

app.use(
  expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: false,
    maxAge: 60 * 1000,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
  })
);

app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Serve static assets
app.use("/assets", express.static("./views/assets"));

// Set up local variables for flash messages
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Routes
app.use("/", require("./routes/authRoutes.js"));
app.use("/", require("./routes/userRoutes.js"));

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server is started on port: ${port}`.bgMagenta);
});
