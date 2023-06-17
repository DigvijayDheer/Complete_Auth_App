const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, set Cache-Control headers to prevent caching of sensitive information
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0"
    );

    // Call the next middleware or route handler
    next();
  } else {
    // If the user is not authenticated, redirect them to the login page and display an error message
    req.flash("error_message", "Please login to continue!");
    res.redirect("/login");
  }
};

module.exports = { checkAuth };
