const { default: mongoose, Schema, SchemaTypes } = require("mongoose");

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    opts: { type: Object, required: true },
    cust: { type: SchemaTypes.ObjectId, required: true, ref: "Customer" },
    link: { type: String, required: false }, // Single link value
  },
  { skipVersioning: true }
);

// Prevent OverwriteModelError by checking if the model already exists
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

module.exports = Event;
