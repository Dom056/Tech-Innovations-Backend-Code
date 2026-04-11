const pool = require("../database/db");

// GET all faults
exports.getAllFaults = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        status,
        priority,
        created_at
      FROM issues
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching faults:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};

// GET one fault
exports.getFaultById = async (req, res) => {
  const { id } = req.params; // get id from URL

  try {
    const result = await pool.query(
      "SELECT * FROM issues WHERE id = $1",
      [id]
    );

    // no matching fault found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Fault not found"
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error fetching fault:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};