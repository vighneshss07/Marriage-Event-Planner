const Admin = require("../models/Admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin login
/**
 * @type {import("express").Handler}
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { adminId: admin._id, role: "ADMIN" },
      "your_secret_key",
      {
        expiresIn: 1e3 * 60 * 60 * 24 * 3,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1e3 * 60 * 60 * 24 * 3,
      signed: true,
    });
    res.status(200).json({ token, role: "ADMIN" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
