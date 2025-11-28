const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

// Login Page Route
router.get(
    "/login",
    utilities.handleErrors(accountController.buildLogin)
)

// Registration Page Route
router.get(
    "/registration",
    utilities.handleErrors(accountController.buildRegister)
)

// Registration Form Submission
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Login Form Submission with Validation
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Account Management Page Route
router.get(
    "/", 
    utilities.checkJWTToken,
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Show Update Account Form (GET)
router.get(
    "/update/:accountId", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildUpdateAccountView)
)

// Process Update Account Submission (POST)
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
);

// Change Password
router.post(
    "/change-password",
    utilities.checkLogin,
    regValidate.changePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
);

// Logout Route
router.get(
    "/logout", 
    utilities.handleErrors(accountController.accountLogout)
);

module.exports = router