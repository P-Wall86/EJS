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
    utilities.handleErrors(accountController.accountLogin)
)

// Account Management
router.get(
    "/", 
    utilities.checkJWTToken,
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Update Account Form
router.get(
    "/update/:accountId", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildUpdateAccountView)
)

// Update Account
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

// Logout
router.get(
    "/logout", 
    utilities.handleErrors(accountController.accountLogout)
);

module.exports = router