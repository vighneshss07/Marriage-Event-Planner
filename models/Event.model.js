const { default: mongoose, Schema, SchemaTypes } = require("mongoose");

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    opts: { type: Object, required: true },
    cust: { type: SchemaTypes.ObjectId, required: true, ref: "Customer" },
  },
  { skipVersioning: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
