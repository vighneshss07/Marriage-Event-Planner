const router = require("express").Router();
const adminController = require("../controllers/admin.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.get("/", authMiddleware, async (req, res) => {
  res.json(req.user);
});

router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("token").status(200).json({ success: true });
});

module.exports = router;
