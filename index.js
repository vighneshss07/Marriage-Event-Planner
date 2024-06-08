const express = require("express");
const connectDB = require("./db");
const adminRoutes = require("./routes/admin.route.js");
const authRoutes = require("./routes/auth.route.js");
const customerRoutes = require("./routes/customer.route.js");
const eventRoutes = require("./routes/events.route.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(require("cookie-parser")("cookie_sign_secret"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ success: true, msg: "Server is running" });
});
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);
app.use("/event", eventRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
