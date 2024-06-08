const router = require("express").Router();
const requireAuth = require("../middlewares/auth.middleware");
const eventController = require("../controllers/events.controller");

router.post("/create", requireAuth, eventController.createEvent);
router.get("/all", requireAuth, eventController.getAllEvents);
router.get("/:id", requireAuth, eventController.getById);
router.delete("/", requireAuth, eventController.deleteEvent);

module.exports = router;
