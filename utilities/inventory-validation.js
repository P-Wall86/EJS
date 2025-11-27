const { body, validationResult } = require("express-validator")
const utilities = require("./")

const validate = {}

// Classification validation rules
validate.classificationRules = () => {
    return [
        body('classification_name')
            .trim()
            .isLength({ min: 1 })
            .withMessage('• A name is required')
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage('• The name cannot contain spaces, special characters or numbers.'),
    ]
}

// Check classification data
validate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash("error", error.msg))

        let nav = await utilities.getNav()

        return res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            flashMessages: req.flash(),
            classification_name: req.body.classification_name,
        })
    }

    next()
}

// Inventory validation rules
validate.inventoryRules = () => {
    return [
        body("inv_make").trim().isLength({ min: 1 }).withMessage("• Make is required."),
        body("inv_model").trim().isLength({ min: 1 }).withMessage("• Model is required."),
        body("inv_year").isInt({ min: 1900, max: 2100 }).withMessage("• Year is invalid."),
        body("inv_description").trim().isLength({ min: 1 }).withMessage("• Description is required."),
        body("inv_price").isFloat({ min: 0 }).withMessage("• Price must be a positive number."),
        body("inv_miles").isInt({ min: 0 }).withMessage("• Miles must be a positive integer."),
        body("inv_color").trim().isLength({ min: 1 }).matches(/^[A-Za-z\s]+$/).withMessage("• Color is required."),
        body("classification_id").isInt().withMessage("• Classification is required.")
    ]
}

// Check inventory data
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)

        return res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            errors,
            messages: req.flash(),
            classificationList,
            ...req.body
        })
    }
    next()
}

// Check update inventory data
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)

        return res.render("inventory/edit-inventory", {
            title: "Edit Vehicle",
            nav,
            errors,
            messages: req.flash(),
            classificationList,
            inv_id: req.body.inv_id,
            ...req.body
        })
    }
    next()
}

module.exports = validate