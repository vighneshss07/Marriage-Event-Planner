const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    mobileNo: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
  },
  { skipVersioning: true }
);

module.exports = mongoose.model("Customer", customerSchema);
