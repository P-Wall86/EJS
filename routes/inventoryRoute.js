// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Existing routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:id", utilities.handleErrors(invController.buildDetailView))

// Test route
router.get("/test-error", (req, res, next) => {
    const err = new Error("Intentional server error for testing")
    err.status = 500
    next(err)
})

// Inventory Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagementView))

// Show the classification form
router.get("/add-classification", async (req, res) => {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null,
        messages: req.flash(),
        classification_name: '',
    })
})

// Process the classification form
router.post(
    "/add-classification",
    (req, res, next) => {
        console.log("POST RECEIVED!", req.body);
        next();
    },
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Show Add Inventory Form
router.get("/add-inventory", async (req, res) => {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
        title: "New Vehicle",
        nav,
        errors: null,
        messages: req.flash(),
        classificationList,
        inv_make: "",
        inv_model: "",
        inv_year: "",
        inv_description: "",
        inv_image: "",
        inv_thumbnail: "",
        inv_price: "",
        inv_miles: "",
        inv_color: ""
    })
})

// Process the inventory form
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Get inventory JSON
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON))

// Show Edit Inventory Form
router.get(
    "/edit/:inventory_id",
    utilities.handleErrors(invController.buildEditInventoryView)
)

router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router