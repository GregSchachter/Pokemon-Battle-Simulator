require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB:", process.env.MONGODB_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToDb;
