const utilities = require(".")
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator")
const validate = {}

// Registration validation rules
validate.registrationRules = () => {
    return [
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/)
            .withMessage("• Please provide a first name."),
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/)
            .withMessage("• Please provide a last name."),
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("• A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("• Email exists. Please log in or use a different email")
                }
            }),
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("• Password does not meet requirements."),
    ]
}

// Check registration data
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.render("account/registration", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            flashMessages: req.flash()
        })
    }
    next()
}

// Login validation rules
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .withMessage("• A valid email is required."),
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("• Password is required."),
    ];
}

// Check login data
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors,
            flashMessages: req.flash(),
            account_email,
        })
    }
    next()
}

// Validation rules for account update
validate.updateAccountRules = () => {
    return [
        body("account_firstname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("• Please provide a first name."),

        body("account_lastname")
            .trim()
            .isLength({ min: 1 })
            .withMessage("• Please provide a last name."),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("• A valid email is required.")
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id;
                const account = await accountModel.getAccountById(account_id);
                
                if (account_email === account.account_email) {
                    return true; 
                }
                
                const emailExists = await accountModel.getAccountByEmail(account_email);
                if (emailExists) {
                    throw new Error("• Email already exists. Please use a different email address.");
                }
            }),
    ];
};

// Check data for account update
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update-account", {
            errors,
            title: "Update Account Information",
            nav,
            accountData: req.body, 
            messages: req.flash(),
        });
        return;
    }
    next();
};

// Validation rules for password change
validate.changePasswordRules = () => {
    return [
        body("account_password")
            .trim()
            .isLength({ min: 12 })
            .withMessage("• Password must be at least 12 characters long.")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).{12,}$/)
            .withMessage("• Password must contain at least 1 uppercase letter, 1 number, and 1 special character."),
    ];
};

// Check data for password change
validate.checkPasswordData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/update-account", {
            errors,
            title: "Update Account Information",
            nav,
            accountData: req.body, 
            messages: req.flash(),
        });
        return;
    }
    next();
};

module.exports = validate