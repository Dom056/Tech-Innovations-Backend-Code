const express = require("express");
const router = express.Router();
const faultController = require("../controllers/fault.controller");

// GET all faults
router.get("/", faultController.getAllFaults);

// GET one fault by id
router.get("/:id", faultController.getFaultById);

module.exports = router;