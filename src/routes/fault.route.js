const express = require("express");
const router = express.Router();
const pool = require("../database/db");

// GET all faults
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, status, priority FROM issues ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;