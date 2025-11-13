const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
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
            return res.status(404).send("Vehicle not found");
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

module.exports = invCont
