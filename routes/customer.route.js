const router = require("express").Router();
const customerController = require("../controllers/customer.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/register", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);
router.get("/combo", authMiddleware, customerController.getCombo);

module.exports = router;
