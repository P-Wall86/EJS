const { body, validationResult } = require("express-validator")
const utilities = require("./")

const validate = {}

// Classification Validation Rules
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

// Check Classification Data
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

// Inventory Validation Rules
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("• Classification is required.")
            .bail()
            .isInt()
            .withMessage("• Invalid classification selection."),

        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("• Make is required."),

        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("• Model is required."),

        body("inv_year")
            .notEmpty()
            .withMessage("• Year is required.")
            .isInt({ min: 1900, max: 2100 })
            .withMessage("• Year is invalid."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("• Description is required."),

        body("inv_price")
            .notEmpty()
            .withMessage("• Price is required.")
            .isFloat({ min: 0 })
            .withMessage("• Price must be a positive number."),

        body("inv_miles")
            .notEmpty()
            .withMessage("• Miles is required.")
            .isInt({ min: 0 })
            .withMessage("• Miles must be a positive integer."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("• Color is required.")
            .matches(/^[A-Za-z\s]+$/)
            .withMessage("• Color must contain only letters."),
    ]
}

// Check Inventory Data
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

// Check Update Data
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