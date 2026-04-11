const express = require("express");
const router = express.Router();
const faultController = require("../controllers/fault.controller");

// GET all faults
router.get("/", faultController.getAllFaults);

// GET one fault by id
router.get("/:id", faultController.getFaultById);

// CREATE a new fault
router.post("/", faultController.createFault);

// UPDATE a fault's status
router.patch("/:id/status", faultController.updateFaultStatus);

// GET all updates for one fault
router.get("/:id/updates", faultController.getFaultUpdates);

// CREATE a new update for one fault
router.post("/:id/updates", faultController.addFaultUpdate);

module.exports = router;