// This file will contain all database queries related to faults

const pool = require("../database/db");

// Get all faults from DB
exports.getAllFaults = async () => {
  const [rows] = await pool.query(`
    SELECT id, title, status, priority, created_at
    FROM issues
    ORDER BY created_at DESC
  `);

  return rows;
};

// Get one fault by id
exports.getFaultById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM issues WHERE id = ?",
    [id]
  );

  return rows[0];
};