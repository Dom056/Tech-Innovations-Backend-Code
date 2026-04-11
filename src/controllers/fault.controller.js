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

// GET all faults with optional filtering and sorting
exports.getAllFaults = async (req, res) => {
  const { status, priority, sort } = req.query;

  const allowedStatuses = ["reported", "in_progress", "resolved"];
  const allowedPriorities = ["low", "medium", "high"];
  const allowedSorts = ["newest", "oldest"];

  // Validate status if provided
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: "Invalid status filter"
    });
  }

  // Validate priority if provided
  if (priority && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      error: "Invalid priority filter"
    });
  }

  // Validate sort if provided
  if (sort && !allowedSorts.includes(sort)) {
    return res.status(400).json({
      success: false,
      error: "Invalid sort value"
    });
  }

  let filteredFaults = [...mockFaults];

  // Filter by status if provided
  if (status) {
    filteredFaults = filteredFaults.filter(
      fault => fault.status === status
    );
  }

  // Filter by priority if provided
  if (priority) {
    filteredFaults = filteredFaults.filter(
      fault => fault.priority === priority
    );
  }

  // Sort by created_at
  if (sort === "oldest") {
    filteredFaults.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  } else {
    // Default to newest first
    filteredFaults.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  res.status(200).json({
    success: true,
    count: filteredFaults.length,
    data: filteredFaults
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

// GET dashboard summary for faults
exports.getFaultSummary = async (req, res) => {
  const summary = {
    total: mockFaults.length,
    reported: mockFaults.filter(fault => fault.status === "reported").length,
    in_progress: mockFaults.filter(fault => fault.status === "in_progress").length,
    resolved: mockFaults.filter(fault => fault.status === "resolved").length,
    high_priority: mockFaults.filter(fault => fault.priority === "high").length,
    medium_priority: mockFaults.filter(fault => fault.priority === "medium").length,
    low_priority: mockFaults.filter(fault => fault.priority === "low").length
  };

  res.status(200).json({
    success: true,
    data: summary
  });
};