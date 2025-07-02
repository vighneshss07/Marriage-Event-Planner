const { decode } = require("jsonwebtoken");
const Event = require("../models/Event.model");

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      cust: { c_id: cust },
      opts,
      link, // Add the link parameter here
    } = req.body;

    // Create the event with the link field
    const event = new Event({ title, date, cust, opts, link });
    await event.save();
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const decodedData = decode(req.signedCookies.token);
    // Fetch events based on the customerId decoded from the token
    const events = await Event.find(
      decodedData?.customerId ? { cust: decodedData.customerId } : {}
    ).populate({
      path: "cust",
      select: "-_id",
      options: { projection: { c_id: "$_id", mobileNo: "$mobileNo" } },
    });

    res.status(200).json(events); // `link` will be included here by default
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate({
      path: "cust",
      select: "-_id",
      options: { projection: { c_id: "$_id", mobileNo: "$mobileNo" } },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ data: event }); // `link` is part of the event data
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.query;
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
