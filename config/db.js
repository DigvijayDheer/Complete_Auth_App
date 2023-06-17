const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to MongoDB using the MONGO_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgCyan); // Log the successful connection with the host
  } catch (error) {
    console.log(error); // Log any errors that occur during the connection
    process.exit(1); // Exit the process with a non-zero code to indicate a failure
  }
};

module.exports = connectDB;
