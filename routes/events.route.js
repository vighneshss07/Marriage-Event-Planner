const express = require("express");
const router = express.Router();
const { 
  createEvent, 
  getAllEvents, 
  getById, 
  deleteEvent 
} = require("../controllers/events.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Event = require("../models/Event.model");
// Ensure the correct path to your model

// Create an event
router.post("/create", authMiddleware, createEvent);

// Get all events for the logged-in user
router.get("/all", authMiddleware, getAllEvents);

// Get a specific event by ID
router.get("/:id", authMiddleware, getById);

// Delete an event by ID
router.delete("/delete", authMiddleware, deleteEvent);

// Search events by 'opts' field
router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const events = await Event.find({
      opts: { $regex: query, $options: "i" }, // Perform case-insensitive regex search on 'opts'
    }).populate({
      path: "cust", // Assuming 'cust' is a reference field in the Event model
      select: "c_id mobileNo", // Fields to include in the populated data
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events", error });
  }
});

module.exports = router;
