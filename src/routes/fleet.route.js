// This file defines all fleet-related API routes.

const express = require("express");
const router = express.Router();
const fleetController = require("../controllers/fleet.controller");

// GET all buses in the fleet
router.get("/", fleetController.getAllBuses);

// GET one bus by id
router.get("/:id", fleetController.getBusById);

// CREATE a new maintenance entry for a component
router.post("/:id/components/:componentId/history", fleetController.addMaintenanceEntry);

module.exports = router;