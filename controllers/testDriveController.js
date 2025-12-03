const utilities = require("../utilities");
const testDriveModel = require("../models/test-drive-model");
const invModel = require("../models/inventory-model");

// Show form to request a test drive
async function showRequestForm(req, res, next) {
    const inv_id = req.params.vehicle_id;
    let nav = await utilities.getNav();

    try {
        const vehicle = await invModel.getInventoryItemById(inv_id);
        res.render("testdrive/request", {
            title: "Test Drive Request",
            nav,
            flashMessages: req.flash(),
            errors: {
                isEmpty: () => true,
                array: () => []
            },
            formData: {
                inv_id,
                vehicle_name: vehicle ? `${vehicle.inv_make} ${vehicle.inv_model}` : "",
                preferred_date: "",
                comment: ""
            }
        });
    } catch (error) {
        next(error);
    }
}

// Handle form submission for test drive request
async function submitRequest(req, res, next) {
    let nav = await utilities.getNav();
    const { inv_id, preferred_date, comment } = req.body;
    const account_id = req.account.account_id;

    try {
        const result = await testDriveModel.createRequest(account_id, inv_id, preferred_date, comment);
        if (result) {
            req.flash("success", "Your test drive request has been submitted.");
            res.redirect("/testdrive/my-requests");
        } else {
            req.flash("error", "Failed to submit the test drive request.");
            res.status(400).render("testdrive/request", {
                title: "Test Drive Request",
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
    const account_id = req.account.account_id;

    try {
        const requests = await testDriveModel.getRequestsByUser(account_id);
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
