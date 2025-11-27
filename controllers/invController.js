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

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("success", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("error", "Sorry, the update failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationList: classificationSelect,
            errors: null,
            inv_id,
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
        })
    }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
        classificationList,
        messages: req.flash()
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

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryItemById(inv_id)

    if (!itemData) {
        req.flash("notice", "Sorry, no vehicle data was found.")
        return res.redirect("/inv/")
    }

    const classificationList = await utilities.buildClassificationList(itemData.inv_classification_id)

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList: classificationList,
        errors: null,
        messages: req.flash(),
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        inv_classification_id: itemData.inv_classification_id
    })
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()

    const itemData = await invModel.getInventoryItemById(inv_id)

    if (!itemData) {
        req.flash("notice", "Sorry, no vehicle data was found.")
        return res.redirect("/inv/")
    }

    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        messages: req.flash(),
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price
    })
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()

    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult) {
        req.flash("success", "The vehicle was successfully deleted.")
        return res.redirect("/inv/")
    } else {
        req.flash("error", "Sorry, the delete failed.")
        return res.redirect(`/inv/delete/${inv_id}`)
    }
}

module.exports = invCont
