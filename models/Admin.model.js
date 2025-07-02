const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Other admin fields
  },
  { skipVersioning: true }
);

module.exports = mongoose.model("Admin", adminSchema);
