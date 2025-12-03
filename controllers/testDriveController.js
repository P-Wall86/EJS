const utilities = require("../utilities");
const testDriveModel = require("../models/test-drive-model");

// Show form to request a test drive
async function showRequestForm(req, res, next) {
    const vehicle_id = req.params.vehicle_id;
    let nav = await utilities.getNav();
    res.render("testdrive/request", {
        title: "Request a Test Drive",
        nav,
        flashMessages: req.flash(),
        errors: {
            isEmpty: () => true,
            array: () => []
        },
        formData: {}
    });
}

// Handle form submission for test drive request
async function submitRequest(req, res, next) {
    let nav = await utilities.getNav();
    const { vehicle_id, preferred_date, comments } = req.body;
    const user_id = req.account.account_id;

    try {
        const result = await testDriveModel.createRequest(user_id, vehicle_id, preferred_date, comments);
        if (result) {
            req.flash("success", "Your test drive request has been submitted.");
            res.redirect("/testdrive/my-requests");
        } else {
            req.flash("error", "Failed to submit the test drive request.");
            res.status(400).render("testdrive/request", {
                title: "Request a Test Drive",
                nav,
                flashMessages: req.flash(),
                errors: {
                    isEmpty: () => false,
                    array: () => ["Failed to save your request."]
                },
                formData: req.body
            });
        }
    } catch (error) {
        next(error);
    }
}

// List test drive requests for the logged-in user
async function listUserRequests(req, res, next) {
    let nav = await utilities.getNav();
    const user_id = req.account.account_id;

    try {
        const requests = await testDriveModel.getRequestsByUser(user_id);
        res.render("testdrive/my-requests", {
            title: "My Test Drive Requests",
            nav,
            flashMessages: req.flash(),
            requests
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    showRequestForm,
    submitRequest,
    listUserRequests,
};