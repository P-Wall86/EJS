const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

//Login route
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

//Registration route
router.get(
    "/registration",
    utilities.handleErrors(accountController.buildRegister)
)

// Registration form submission route
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

module.exports = router