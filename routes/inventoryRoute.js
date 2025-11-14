// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Wrap all asynchronous route handlers with the error handling middleware (handleErrors)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get('/detail/:id', utilities.handleErrors(invController.buildDetailView))

// Test route with an intentional error
router.get('/test-error', (req, res, next) => {
    const err = new Error('Intentional server error for testing')
    err.status = 500
    next(err)
})

module.exports = router