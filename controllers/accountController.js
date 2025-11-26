const bcrypt = require("bcryptjs")
const accountModel = require('../models/account-model')
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

//Process login request
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            flashMessages: req.flash(),
            errors: null,
            account_email,
        })
        return
    }

    console.log("Password Ingresada:", req.body.account_password);
    console.log("Hash Almacenado (Debe tener 60 caracteres):", accountData.account_password);

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, secure: true })
            }
            return res.redirect("/account")
        }
        else {
            req.flash("notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                flashMessages: req.flash(),
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error("Access Forbidden")
    }
}

async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/management", {
        title: "Account Management",
        nav,
        flashMessages: req.flash(),
        errors: {
            isEmpty: () => true,
            array: () => []
        },
    })
}

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccountManagement
}