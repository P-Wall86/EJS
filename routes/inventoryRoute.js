// Required Modules 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Public Routes
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:id", utilities.handleErrors(invController.buildDetailView))

// Intentional Error Route
router.get("/test-error", (req, res, next) => {
    const err = new Error("Intentional server error for testing")
    err.status = 500
    next(err)
})

// Inventory Management View
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagementView))

// Show Classification Form
router.get("/add-classification", utilities.checkAccountType, async (req, res) => {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null,
        messages: req.flash(),
        classification_name: '',
    })
})

// Process Classification Form
router.post(
    "/add-classification", utilities.checkAccountType,
    (req, res, next) => {
        console.log("POST RECEIVED!", req.body);
        next();
    },
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Show Add Inventory Form
router.get("/add-inventory", utilities.checkAccountType, async (req, res) => {
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

// Process Inventory Form
router.post(
    "/add-inventory",
    utilities.checkAccountType, 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Get Inventory JSON
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON))

// Show Edit Inventory Form
router.get(
    "/edit/:inventory_id",
    utilities.handleErrors(invController.buildEditInventoryView)
)

// Process Inventory Form
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Show Delete Confirmation
router.get(
    "/delete/:inventory_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildDeleteInventoryView)
);

//Process Delete
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.handleErrors(invController.deleteInventory)
);

module.exports = router