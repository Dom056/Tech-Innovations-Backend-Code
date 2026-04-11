//This will be the code used once the backend is connected to the database.
//Copy code and place it into the fault.controller.js file once testing is done.

/*const pool = require("../database/db");
const { v4: uuidv4 } = require("uuid");

// GET all faults with optional filtering
exports.getAllFaults = async (req, res) => {
  const { status, priority } = req.query;

  const allowedStatuses = ["reported", "in_progress", "resolved"];
  const allowedPriorities = ["low", "medium", "high"];

  // Validate status filter
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status filter"
    });
  }

  // Validate priority filter
  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      error: "Invalid priority filter"
    });
  }

  try {
    let query = `
      SELECT 
        id,
        title,
        description,
        status,
        priority,
        created_at,
        updated_at
      FROM issues
    `;

    const queryParams = [];
    const conditions = [];

    // Add filters if provided
    if (status) {
      conditions.push("status = ?");
      queryParams.push(status);
    }

    if (priority) {
      conditions.push("priority = ?");
      queryParams.push(priority);
    }

    // Add WHERE only if filters exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query(query, queryParams);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error("Error fetching faults:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};

// GET one fault by id
exports.getFaultById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM issues WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Fault not found"
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    console.error("Error fetching fault:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};

// CREATE a new fault
exports.createFault = async (req, res) => {
  const { title, description, status, priority } = req.body;

  const allowedStatuses = ["reported", "in_progress", "resolved"];
  const allowedPriorities = ["low", "medium", "high"];

  if (!title) {
    return res.status(400).json({
      success: false,
      error: "Title is required"
    });
  }

  const finalStatus = status || "reported";
  const finalPriority = priority || "medium";

  if (!allowedStatuses.includes(finalStatus)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status value"
    });
  }

  if (!allowedPriorities.includes(finalPriority)) {
    return res.status(400).json({
      success: false,
      error: "Invalid priority value"
    });
  }

  try {
    const faultId = uuidv4();

    await pool.query(
      `INSERT INTO issues (
        id,
        title,
        description,
        status,
        priority,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [faultId, title, description || null, finalStatus, finalPriority]
    );

    const [rows] = await pool.query(
      "SELECT * FROM issues WHERE id = ?",
      [faultId]
    );

    res.status(201).json({
      success: true,
      message: "Fault created successfully",
      data: rows[0]
    });
  } catch (err) {
    console.error("Error creating fault:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};

// UPDATE a fault's status and log history
exports.updateFaultStatus = async (req, res) => {
  const { id } = req.params;
  const { status, created_by } = req.body;

  const allowedStatuses = ["reported", "in_progress", "resolved"];

  if (!status) {
    return res.status(400).json({
      success: false,
      error: "Status is required"
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status value"
    });
  }

  try {
    const [existingRows] = await pool.query(
      "SELECT * FROM issues WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Fault not found"
      });
    }

    const existingFault = existingRows[0];
    const oldStatus = existingFault.status;

    await pool.query(
      `UPDATE issues
       SET status = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, id]
    );

    // Add update history record
    const updateId = uuidv4();

    await pool.query(
      `INSERT INTO issue_updates (
        id,
        issue_id,
        created_at,
        created_by,
        update_type,
        description,
        status_from,
        status_to,
        new_issue_id
      )
      VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        updateId,
        id,
        created_by || null,
        "status_change",
        `Status changed from ${oldStatus} to ${status}`,
        oldStatus,
        status,
        null
      ]
    );

    const [updatedRows] = await pool.query(
      "SELECT * FROM issues WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Fault status updated successfully",
      data: updatedRows[0]
    });
  } catch (err) {
    console.error("Error updating fault status:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};

// GET all updates for one fault
exports.getFaultUpdates = async (req, res) => {
  const { id } = req.params;

  try {
    const [faultRows] = await pool.query(
      "SELECT id FROM issues WHERE id = ?",
      [id]
    );

    if (faultRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Fault not found"
      });
    }

    const [updateRows] = await pool.query(
      `SELECT 
        id,
        issue_id,
        created_at,
        created_by,
        update_type,
        description,
        status_from,
        status_to,
        new_issue_id
       FROM issue_updates
       WHERE issue_id = ?
       ORDER BY created_at DESC`,
      [id]
    );

    res.status(200).json({
      success: true,
      count: updateRows.length,
      data: updateRows
    });
  } catch (err) {
    console.error("Error fetching fault updates:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
};

// CREATE a new update for one fault
exports.addFaultUpdate = async (req, res) => {
  const { id } = req.params;
  const {
    created_by,
    update_type,
    description,
    status_from,
    status_to,
    new_issue_id
  } = req.body;

  if (!update_type) {
    return res.status(400).json({
      success: false,
      error: "Update type is required"
    });
  }

  if (!description) {
    return res.status(400).json({
      success: false,
      error: "Description is required"
    });
  }

  try {
    const [faultRows] = await pool.query(
      "SELECT id FROM issues WHERE id = ?",
      [id]
    );

    if (faultRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Fault not found"
      });
    }

    const updateId = uuidv4();

    await pool.query(
      `INSERT INTO issue_updates (
        id,
        issue_id,
        created_at,
        created_by,
        update_type,
        description,
        status_from,
        status_to,
        new_issue_id
      )
      VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
      [
        updateId,
        id,
        created_by || null,
        update_type,
        description,
        status_from || null,
        status_to || null,
        new_issue_id || null
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM issue_updates WHERE id = ?",
      [updateId]
    );

    res.status(201).json({
      success: true,
      message: "Fault update added successfully",
      data: rows[0]
    });
  } catch (err) {
    console.error("Error creating fault update:", err);
    res.status(500).json({
      success: false,
      error: "Database error"
    });
  }
}; */