const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const testDriveController = require("../controllers/testDriveController");

// Route to show the form to request a test drive (GET)
router.get(
    "/request/:vehicle_id",
    utilities.checkLogin,
    utilities.handleErrors(testDriveController.showRequestForm)
);

// Route to handle the form submission (POST)
router.post(
    "/request",
    utilities.checkLogin,
    utilities.handleErrors(testDriveController.submitRequest)
);

// Route to list test drives for the logged-in user
router.get(
    "/my-requests",
    utilities.checkLogin,
    utilities.handleErrors(testDriveController.listUserRequests)
);

module.exports = router;
