const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const faultRoutes = require("./routes/fault.route"); // ✅ correct file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AR Maintenance Backend is running"
  });
});

// Use fault routes
app.use("/api/faults", faultRoutes); // ✅ this replaces your old route

module.exports = app;
