const bcrypt = require("bcryptjs")
const accountModel = require('../models/account-model')
const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        flashMessages: req.flash(),
        errors: {
            isEmpty: () => true,
            array: () => []
        },
        account_email: ""
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

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        return res.status(500).render("account/registration", {
            title: "Registration",
            nav,
            errors: {
                isEmpty: () => true,
                array: () => []
            }
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        return res.status(201).render("account/login", {
            title: "Login",
            nav,
            flashMessages: req.flash(),
            errors: {
                isEmpty: () => true,
                array: () => []
            },
            account_email: ""
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        return res.status(501).render("account/registration", {
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

//Login process function
async function loginAccount(req, res) {
    req.flash("notice", "Login successful");
    res.redirect("/");
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    loginAccount
}
