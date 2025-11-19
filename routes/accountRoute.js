const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

// Login page route
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

// Registration page route
router.get(
    "/registration",
    utilities.handleErrors(accountController.buildRegister)
)

// Registration form submission
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Login form submission with validation middleware
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
)

module.exports = router