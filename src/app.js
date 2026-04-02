const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// For Middleware
app.use(cors());              // allow frontend requests
app.use(express.json());      // parse JSON body
app.use(morgan("dev"));       // log requests

// Test route (IMPORTANT - make sure server works)
app.get("/", (req, res) => {
  res.json({
    message: "AR Maintenance Backend is running"
  });
});

// Example route to get faults (replace with real logic later)
app.get("/api/faults", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Crack in wall",
      location: "Tunnel A",
      severity: "high"
    }
  ]);
});


module.exports = app;