const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const faultRoutes = require("./routes/fault.route");
const authRoutes = require("./routes/auth.route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Auth routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AR Maintenance Backend is running"
  });
});

// Fault routes
app.use("/api/faults", faultRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

module.exports = app;
