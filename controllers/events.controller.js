const { decode } = require("jsonwebtoken");
const Event = require("../models/Event.model");

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      cust: { c_id: cust },
      opts,
    } = req.body;
    const event = new Event({ title, date, cust, opts });
    await event.save();
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const decodedData = decode(req.signedCookies.token);
    const events = await Event.find(
      decodedData?.customerId ? { cust: decodedData.customerId } : {}
    ).populate({
      path: "cust",
      select: "-_id",
      options: { projection: { c_id: "$_id", mobileNo: "$mobileNo" } },
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @type {import("express").Handler}
 */
exports.getById = async (req, res) => {
  try {
    const events = await Event.findById(req.params.id).populate({
      path: "cust",
      select: "-_id",
      options: { projection: { c_id: "$_id", mobileNo: "$mobileNo" } },
    });
    res.status(200).json({ data: events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @type {import("express").Handler}
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.query;
    await Event.findByIdAndDelete(id);
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
