const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
        return next({ status: 404, message: "Classification not found" })
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    });
};

/* ***************************************** *
 *  Build detail view for a specific vehicle *
 * ***************************************** */
invCont.buildDetailView = async function (req, res, next) {
    try {
        const itemId = req.params.id;
        const itemData = await invModel.getInventoryItemById(itemId);
        if (!itemData) {
            return next({ status: 404, message: "Vehicle not found" });
        }
        const itemHTML = utilities.buildItemHTML(itemData);
        let nav = await utilities.getNav();
        res.render("./inventory/detail", {
            title: `${itemData.inv_make} ${itemData.inv_model} (${itemData.inv_year})`,
            nav,
            itemHTML,
        });
    } catch (error) {
        next(error);
    }
};

/* ***************************
 * Add new classification
 ***************************/
invCont.addClassification = async (req, res) => {
    const classificationName = req.body.classification_name;

    try {
        const result = await invModel.insertClassification(classificationName);
        if (result) {
            const nav = await utilities.getNav();
            req.flash('success', `Classification "${classificationName}" added successfully!`);
            return res.redirect('/inv');
        } else {
            throw new Error('Insertion failed');
        }
    } catch (error) {
        req.flash('error', 'Failed to add classification. Try again.');
        const nav = await utilities.getNav();
        res.render('inventory/add-classification', {
            title: 'Add New Classification',
            nav,
            errors: null,
            messages: req.flash(),
            classification_name: req.body.classification_name || '',
        });
    }
};

/* ***************************
 * Add new inventory
 ***************************/
invCont.addInventory = async function (req, res) {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body

    const addResult = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (addResult) {
        req.flash("success", "Vehicle added successfully!")
        return res.redirect("/inv")
    } else {
        req.flash("notice", "Failed to add vehicle.")
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)

        return res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            errors: null,
            messages: req.flash(),
            classificationList,
            ...req.body
        })
    }
}


invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        classificationList,
    })
}

/* ***************************
 * Intentional 500 Error
 ***************************/
invCont.testError = (req, res, next) => {
    next(new Error("Intentional 500 error for testing purposes"))
}

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classificationId)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.length > 0) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
