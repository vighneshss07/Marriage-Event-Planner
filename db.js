const mongoose = require("mongoose");

const connectDB = () =>
  mongoose.connect("mongodb://127.0.0.1:27017/marriage-event-db");

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

module.exports = connectDB;
