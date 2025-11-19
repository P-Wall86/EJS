const accountModel = require('../models/account-model')
const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        flashMessages: req.flash()
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Registration",
        nav,
        flashMessages: req.flash(),
        errors: {
            isEmpty: () => true,
            array: () => []
        },
    })
}

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            flashMessages: req.flash()
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            title: "Registration",
            nav,
            flashMessages: req.flash(),
            errors: {
                isEmpty: () => true,
                array: () => []
            },
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
}