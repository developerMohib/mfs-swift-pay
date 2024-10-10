const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_url, {
      useNewUrlParser: ture,
      useUnifiedTopology: true,
    });
    console.log("mongoDB connection successfully");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
module.exports = connectDB;
