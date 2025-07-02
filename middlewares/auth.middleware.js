const jwt = require("jsonwebtoken");

/** @type {import("express").Handler} */
const authMiddleware = (req, res, next) => {
  const token = req.signedCookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded; // Assign decoded user information to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
