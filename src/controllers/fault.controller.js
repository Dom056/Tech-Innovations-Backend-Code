/* const pool = require("../database/db");
const { v4: uuidv4 } = require("uuid");

// GET all faults
exports.getAllFaults = async (req, res) => {
  try {
    // Fetch a simple list of faults for overview pages
    const [rows] = await pool.query(`
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
    // Fetch one fault using its id
    const [rows] = await pool.query(
      "SELECT * FROM issues WHERE id = ?",
      [id]
    );

    // Return 404 if no fault exists with that id
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

// POST create a new fault
exports.createFault = async (req, res) => {
  const { title, description, status, priority } = req.body;

  // Basic validation
  if (!title) {
    return res.status(400).json({
      success: false,
      error: "Title is required"
    });
  }

  const allowedStatuses = ["reported", "in_progress", "resolved"];

  const finalStatus = status || "reported";
  const finalPriority = priority || "medium";

  if (!allowedStatuses.includes(finalStatus)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status value"
    });
  }

  try {
    // Generate UUID to match schema design
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

// PATCH update a fault's status
exports.updateFaultStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

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

    await pool.query(
      `UPDATE issues
       SET status = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, id]
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
}; */

// TEMPORARY MOCK DATA (used until database is ready)
const mockFaults = [
  {
    id: "1",
    title: "Tunnel crack detected",
    status: "reported",
    priority: "high",
    created_at: "2026-04-11"
  },
  {
    id: "2",
    title: "Signal failure",
    status: "in_progress",
    priority: "medium",
    created_at: "2026-04-10"
  }
];

let mockFaultUpdates = [
  {
    id: "1",
    issue_id: "1",
    created_at: "2026-04-11T10:00:00.000Z",
    created_by: "engineer_1",
    update_type: "comment",
    description: "Initial inspection completed.",
    status_from: null,
    status_to: null,
    new_issue_id: null
  },
  {
    id: "2",
    issue_id: "1",
    created_at: "2026-04-11T11:00:00.000Z",
    created_by: "engineer_2",
    update_type: "status_change",
    description: "Status changed from reported to in_progress.",
    status_from: "reported",
    status_to: "in_progress",
    new_issue_id: null
  }
];

// GET all faults
exports.getAllFaults = async (req, res) => {
  res.status(200).json({
    success: true,
    count: mockFaults.length,
    data: mockFaults
  });
};

// GET one fault
exports.getFaultById = async (req, res) => {
  const fault = mockFaults.find(f => f.id === req.params.id);

  if (!fault) {
    return res.status(404).json({
      success: false,
      error: "Fault not found"
    });
  }

  res.status(200).json({
    success: true,
    data: fault
  });
};

// CREATE a new fault
exports.createFault = async (req, res) => {
  const { title, status, priority } = req.body;

  // Basic validation
  if (!title) {
    return res.status(400).json({
      success: false,
      error: "Title is required"
    });
  }

  const newFault = {
    id: (mockFaults.length + 1).toString(),
    title,
    status: status || "reported",
    priority: priority || "medium",
    created_at: new Date().toISOString()
  };

  mockFaults.push(newFault);

  res.status(201).json({
    success: true,
    message: "Fault created successfully",
    data: newFault
  });
};

// UPDATE a fault's status
exports.updateFaultStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["reported", "in_progress", "resolved"];

  // Check if status was provided
  if (!status) {
    return res.status(400).json({
      success: false,
      error: "Status is required"
    });
  }

  // Check if status is valid
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status value"
    });
  }

  // Find the fault
  const fault = mockFaults.find(f => f.id === id);

  if (!fault) {
    return res.status(404).json({
      success: false,
      error: "Fault not found"
    });
  }

  const oldStatus = fault.status;
  fault.status = status;

  // Add a history record for the status change
  const statusUpdate = {
    id: (mockFaultUpdates.length + 1).toString(),
    issue_id: id,
    created_at: new Date().toISOString(),
    created_by: "system_user",
    update_type: "status_change",
    description: `Status changed from ${oldStatus} to ${status}`,
    status_from: oldStatus,
    status_to: status,
    new_issue_id: null
  };

  mockFaultUpdates.push(statusUpdate);

  res.status(200).json({
    success: true,
    message: "Fault status updated successfully",
    data: fault
  });
};

// GET all updates for one fault
exports.getFaultUpdates = async (req, res) => {
  const { id } = req.params;

  // Make sure the fault exists first
  const fault = mockFaults.find(f => f.id === id);

  if (!fault) {
    return res.status(404).json({
      success: false,
      error: "Fault not found"
    });
  }

  // Filter updates that belong to this fault
  const updates = mockFaultUpdates.filter(update => update.issue_id === id);

  res.status(200).json({
    success: true,
    count: updates.length,
    data: updates
  });
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

  // Make sure the fault exists first
  const fault = mockFaults.find(f => f.id === id);

  if (!fault) {
    return res.status(404).json({
      success: false,
      error: "Fault not found"
    });
  }

  // Basic validation
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

  const newUpdate = {
    id: (mockFaultUpdates.length + 1).toString(),
    issue_id: id,
    created_at: new Date().toISOString(),
    created_by: created_by || "system_user",
    update_type,
    description,
    status_from: status_from || null,
    status_to: status_to || null,
    new_issue_id: new_issue_id || null
  };

  mockFaultUpdates.push(newUpdate);

  res.status(201).json({
    success: true,
    message: "Fault update added successfully",
    data: newUpdate
  });
};